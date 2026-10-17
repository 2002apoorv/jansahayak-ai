import hashlib
import re
from typing import Any, Dict, List


class TextChunker:
    """Splits official scheme documents into overlapping chunks with metadata."""

    def __init__(self, chunk_size: int = 600, overlap: int = 100):
        self.chunk_size = chunk_size
        self.overlap = overlap

    def chunk_text(self, text: str) -> List[str]:
        """Splits raw text using paragraph boundaries and window sliding with overlap."""
        text = re.sub(r"\s+", " ", text).strip()
        if not text:
            return []

        if len(text) <= self.chunk_size:
            return [text]

        # Break text into sentence-ish units
        sentences = re.split(r"(?<=[.!?\n]) +", text)
        chunks = []
        current_chunk = []
        current_len = 0

        for sentence in sentences:
            sentence = sentence.strip()
            if not sentence:
                continue

            if current_len + len(sentence) > self.chunk_size and current_chunk:
                chunk_str = " ".join(current_chunk)
                chunks.append(chunk_str)

                # Keep overlap from the end of current_chunk
                overlap_tokens = []
                overlap_len = 0
                for s in reversed(current_chunk):
                    if overlap_len + len(s) <= self.overlap:
                        overlap_tokens.insert(0, s)
                        overlap_len += len(s)
                    else:
                        break

                current_chunk = overlap_tokens
                current_len = overlap_len

            current_chunk.append(sentence)
            current_len += len(sentence)

        if current_chunk:
            final_chunk = " ".join(current_chunk)
            if not chunks or final_chunk != chunks[-1]:
                chunks.append(final_chunk)

        return chunks

    def create_chunks_for_scheme(
        self,
        scheme_id: str,
        scheme_name: str,
        category: str,
        source_title: str,
        source_url: str,
        verified: bool,
        raw_sections: List[Dict[str, Any]]
    ) -> List[Dict[str, Any]]:
        """Splits extracted sections of a scheme into indexed chunks with unique chunk_ids."""
        chunks = []
        seen_hashes = set()

        for sec in raw_sections:
            text = sec.get("text", "")
            page_num = sec.get("page_number", 1)

            text_splits = self.chunk_text(text)
            for split in text_splits:
                # Deduplication check
                content_hash = hashlib.md5(split.encode("utf-8")).hexdigest()
                if content_hash in seen_hashes:
                    continue
                seen_hashes.add(content_hash)

                chunk_id = f"{scheme_id}-CHK-{content_hash[:8]}"
                chunks.append({
                    "chunk_id": chunk_id,
                    "scheme_id": scheme_id,
                    "scheme_name": scheme_name,
                    "category": category,
                    "source_title": source_title,
                    "source_url": source_url,
                    "page_number": page_num,
                    "verified": verified,
                    "content": split
                })

        return chunks
