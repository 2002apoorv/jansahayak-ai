"""
JanSahayak AI — Ingestion & Vector Index Builder CLI
Usage:
    python -m app.ingest
"""

import sys
import logging
from app.ingestion.pipeline import IngestionPipeline
from app.services.retrieval_service import retrieval_service

logging.basicConfig(
    level=logging.INFO,
    format="%(asctime)s [%(levelname)s] %(name)s: %(message)s"
)
logger = logging.getLogger("ingest")


def main():
    logger.info("==================================================")
    logger.info("   JanSahayak AI — Knowledge Base Ingestion CLI   ")
    logger.info("==================================================")

    # 1. Run document parser and chunking pipeline
    pipeline = IngestionPipeline()
    chunks = pipeline.run()

    if not chunks:
        logger.error("No chunks produced by ingestion pipeline. Aborting index build.")
        sys.exit(1)

    # 2. Build FAISS vector index
    logger.info(f"Building semantic FAISS index for {len(chunks)} chunks...")
    success = retrieval_service.build_index(chunks)

    if success:
        logger.info("SUCCESS: FAISS index and metadata successfully created and persisted.")
        logger.info("Ingestion and indexing complete.")
    else:
        logger.warning("Vector index build failed. Lexical retrieval remains operational.")


if __name__ == "__main__":
    main()
