import json
import logging
import os
import re
from pathlib import Path
from typing import Any, Dict, List, Optional
import numpy as np

from app.core.config import settings
from app.schemas.rag import RetrievedChunk

logger = logging.getLogger(__name__)


# Stop words for lexical search
STOP_WORDS = {
    "a", "an", "the", "is", "are", "am", "i", "me", "my",
    "you", "your", "for", "to", "of", "in", "on", "and",
    "or", "can", "could", "would", "should", "what", "how",
    "do", "does", "it", "this", "that", "with", "about",
    "please", "tell", "show", "find", "help", "scheme",
    "schemes", "government", "apply", "eligible", "eligibility"
}


class RetrievalService:
    """
    Production hybrid retrieval engine:
    1. FAISS dense vector search with normalized inner product (cosine similarity)
    2. BM25-style lexical keyword overlap as evaluation baseline and resilient fallback
    """

    def __init__(self):
        self.embedding_model = None
        self.index = None
        self.chunks_metadata: List[Dict[str, Any]] = []
        self._is_initialized = False

    def _lazy_init_model(self):
        """Lazy load sentence transformers model on demand."""
        if self.embedding_model is None:
            try:
                from sentence_transformers import SentenceTransformer
                logger.info(f"Loading embedding model: {settings.EMBEDDING_MODEL_NAME}...")
                self.embedding_model = SentenceTransformer(settings.EMBEDDING_MODEL_NAME)
            except Exception as e:
                logger.error(f"Failed to load sentence-transformers model: {e}")
                self.embedding_model = None

    def build_index(self, chunks: List[Dict[str, Any]]) -> bool:
        """Embeds all chunks and persists the FAISS index and metadata."""
        if not chunks:
            logger.warning("No chunks supplied to build_index.")
            return False

        self._lazy_init_model()
        if self.embedding_model is None:
            logger.error("Cannot build FAISS index without embedding model.")
            return False

        try:
            import faiss

            texts = [c["content"] for c in chunks]
            logger.info(f"Encoding {len(texts)} chunks for vector indexing...")
            embeddings = self.embedding_model.encode(texts, convert_to_numpy=True, show_progress_bar=False)

            # L2 normalize embeddings for cosine similarity via IndexFlatIP
            faiss.normalize_L2(embeddings)
            dim = embeddings.shape[1]

            index = faiss.IndexFlatIP(dim)
            index.add(embeddings)

            # Persist index and metadata
            settings.VECTOR_INDEX_DIR.mkdir(parents=True, exist_ok=True)
            index_path = settings.VECTOR_INDEX_DIR / "index.faiss"
            meta_path = settings.VECTOR_INDEX_DIR / "metadata.json"

            faiss.write_index(index, str(index_path))
            with open(meta_path, "w", encoding="utf-8") as f:
                json.dump(chunks, f, indent=2, ensure_ascii=False)

            self.index = index
            self.chunks_metadata = chunks
            self._is_initialized = True
            logger.info(f"FAISS index built and persisted at {index_path} with {len(chunks)} vectors.")
            return True

        except Exception as e:
            logger.error(f"Error building FAISS index: {e}")
            return False

    def load_index(self) -> bool:
        """Loads persisted FAISS index and chunk metadata from disk."""
        index_path = settings.VECTOR_INDEX_DIR / "index.faiss"
        meta_path = settings.VECTOR_INDEX_DIR / "metadata.json"

        if not index_path.exists() or not meta_path.exists():
            logger.info("No persisted FAISS index found on disk. Checking chunks.json...")
            processed_chunks_file = settings.PROCESSED_DATA_DIR / "chunks.json"
            if processed_chunks_file.exists():
                with open(processed_chunks_file, "r", encoding="utf-8") as f:
                    chunks = json.load(f)
                return self.build_index(chunks)
            return False

        try:
            import faiss
            self._lazy_init_model()
            self.index = faiss.read_index(str(index_path))
            with open(meta_path, "r", encoding="utf-8") as f:
                self.chunks_metadata = json.load(f)

            self._is_initialized = True
            logger.info(f"Loaded FAISS index with {self.index.ntotal} vectors.")
            return True
        except Exception as e:
            logger.error(f"Failed to load FAISS index from {index_path}: {e}")
            return False

    @property
    def is_ready(self) -> bool:
        return self._is_initialized and self.index is not None and len(self.chunks_metadata) > 0

    def search_semantic(
        self,
        query: str,
        top_k: int = 4,
        category: Optional[str] = None,
        state: Optional[str] = None,
        threshold: float = 0.20
    ) -> List[RetrievedChunk]:
        """Perform dense semantic vector retrieval using cosine similarity."""
        if not self.is_ready:
            if not self.load_index():
                return []

        self._lazy_init_model()
        if self.embedding_model is None or self.index is None:
            return []

        try:
            import faiss
            query_emb = self.embedding_model.encode([query], convert_to_numpy=True)
            faiss.normalize_L2(query_emb)

            # Search more items to allow post-filtering by category/state
            k_search = min(top_k * 4, self.index.ntotal)
            distances, indices = self.index.search(query_emb, k_search)

            results: List[RetrievedChunk] = []
            seen_schemes = set()

            for dist, idx in zip(distances[0], indices[0]):
                if idx < 0 or idx >= len(self.chunks_metadata):
                    continue

                score = float(dist)
                if score < threshold:
                    continue

                chunk_meta = self.chunks_metadata[idx]

                # Category filter
                if category and chunk_meta.get("category", "").lower() != category.lower():
                    continue

                scheme_id = chunk_meta["scheme_id"]
                # Prevent returning too many duplicate chunks of the exact same scheme
                scheme_count = sum(1 for r in results if r.scheme_id == scheme_id)
                if scheme_count >= 2:
                    continue

                results.append(
                    RetrievedChunk(
                        chunk_id=chunk_meta["chunk_id"],
                        scheme_id=chunk_meta["scheme_id"],
                        scheme_name=chunk_meta["scheme_name"],
                        category=chunk_meta.get("category", "general"),
                        content=chunk_meta["content"],
                        source_title=chunk_meta["source_title"],
                        source_url=chunk_meta["source_url"],
                        similarity_score=round(score, 3),
                        verified=chunk_meta.get("verified", True),
                        retrieval_method="semantic_faiss"
                    )
                )

                if len(results) >= top_k:
                    break

            return results
        except Exception as e:
            logger.error(f"Semantic search error: {e}")
            return []

    def search_lexical(
        self,
        query: str,
        top_k: int = 4,
        category: Optional[str] = None
    ) -> List[RetrievedChunk]:
        """Keyword overlap baseline retrieval."""
        words = re.findall(r"[a-zA-Z0-9]+", query.lower())
        query_tokens = {w for w in words if w not in STOP_WORDS}
        if not query_tokens:
            return []

        # Use chunks if available, or fall back to structured schemes
        corpus = self.chunks_metadata
        if not corpus:
            processed_file = settings.PROCESSED_DATA_DIR / "chunks.json"
            if processed_file.exists():
                with open(processed_file, "r", encoding="utf-8") as f:
                    corpus = json.load(f)

        if not corpus:
            return []

        scored_chunks = []
        for c in corpus:
            if category and c.get("category", "").lower() != category.lower():
                continue

            content_tokens = set(re.findall(r"[a-zA-Z0-9]+", c["content"].lower()))
            overlap = query_tokens.intersection(content_tokens)
            if not overlap:
                continue

            score = len(overlap) / len(query_tokens)
            scored_chunks.append((score, c))

        scored_chunks.sort(key=lambda x: x[0], reverse=True)
        results = []
        seen_schemes = set()

        for score, c in scored_chunks:
            s_id = c["scheme_id"]
            if sum(1 for r in results if r.scheme_id == s_id) >= 2:
                continue

            results.append(
                RetrievedChunk(
                    chunk_id=c.get("chunk_id", f"{s_id}-LEX"),
                    scheme_id=c["scheme_id"],
                    scheme_name=c["scheme_name"],
                    category=c.get("category", "general"),
                    content=c["content"],
                    source_title=c["source_title"],
                    source_url=c["source_url"],
                    similarity_score=round(score, 3),
                    verified=c.get("verified", True),
                    retrieval_method="lexical_overlap"
                )
            )
            if len(results) >= top_k:
                break

        return results

    def search(
        self,
        query: str,
        top_k: int = 4,
        category: Optional[str] = None,
        state: Optional[str] = None,
        prefer_semantic: bool = True
    ) -> List[RetrievedChunk]:
        """Hybrid retrieval router: attempts semantic search first, falls back gracefully to lexical overlap."""
        if prefer_semantic:
            semantic_results = self.search_semantic(
                query=query,
                top_k=top_k,
                category=category,
                state=state,
                threshold=settings.SIMILARITY_THRESHOLD
            )
            if semantic_results:
                return semantic_results

        # Fallback to lexical keyword overlap
        logger.info(f"Falling back to lexical keyword retrieval for: '{query}'")
        return self.search_lexical(query=query, top_k=top_k, category=category)


retrieval_service = RetrievalService()
