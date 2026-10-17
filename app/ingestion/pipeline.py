import json
import logging
from pathlib import Path
from typing import Any, Dict, List

from app.core.config import settings
from app.data.schemes_data import VERIFIED_SCHEMES
from app.ingestion.chunker import TextChunker
from app.ingestion.parser import DocumentParser

logger = logging.getLogger(__name__)


class IngestionPipeline:
    """End-to-end pipeline to process scheme records, raw official texts, and produce chunks."""

    def __init__(self):
        self.chunker = TextChunker(chunk_size=600, overlap=120)
        self.parser = DocumentParser()

    def run(self) -> List[Dict[str, Any]]:
        """Executes full ingestion and exports processed files."""
        logger.info("Starting JanSahayak scheme ingestion pipeline...")
        all_chunks: List[Dict[str, Any]] = []

        # 1. Process each verified scheme and its structured attributes
        schemes_json = []
        for scheme in VERIFIED_SCHEMES:
            scheme_dict = scheme.model_dump()
            schemes_json.append(scheme_dict)

            # Generate structured summary chunks
            summary_text = (
                f"SCHEME: {scheme.name} ({scheme.short_name or ''})\n"
                f"CATEGORY: {scheme.category.upper()}\n"
                f"JURISDICTION: {scheme.government_level} ({scheme.state or 'All India'})\n"
                f"MINISTRY: {scheme.ministry or 'Central/State Department'}\n"
                f"DESCRIPTION: {scheme.description}\n"
                f"BENEFITS: " + "; ".join([f"{b.title}: {b.description} ({b.amount or ''})" for b in scheme.benefits]) + "\n"
                f"ELIGIBILITY CRITERIA: " + "; ".join([f"{rule.description} (Source: {rule.source_ref or 'Rules'})" for rule in scheme.eligibility_rules]) + "\n"
                f"DOCUMENTS: " + "; ".join([f"{doc.name} - {doc.description}" for doc in scheme.required_documents]) + "\n"
                f"APPLICATION STEPS: " + " -> ".join(scheme.application_steps) + "\n"
                f"APPLICATION PORTAL: {scheme.application_url or 'Official Portal'}"
            )

            structured_chunk = {
                "chunk_id": f"{scheme.id}-SUMMARY",
                "scheme_id": scheme.id,
                "scheme_name": scheme.name,
                "category": scheme.category,
                "source_title": scheme.source_title,
                "source_url": scheme.source_url,
                "page_number": 1,
                "verified": scheme.verified,
                "content": summary_text
            }
            all_chunks.append(structured_chunk)

        # 2. Process raw text files in data/raw/
        raw_files = list(settings.RAW_DATA_DIR.glob("*.*"))
        logger.info(f"Found {len(raw_files)} raw documents in {settings.RAW_DATA_DIR}")

        file_to_scheme_map = {
            "pm_kisan": "PM-KISAN",
            "pm_jay": "AB-PMJAY",
            "pmay": "PMAY-U",
            "mudra": "PMMY-MUDRA",
            "post_matric": "NSP-PMS-SC",
            "svanidhi": "PM-SVANidhi",
            "sukanya": "SUKANYA-SAMRIDDHI",
            "ladli_behna": "MP-LADLI-BEHNA",
        }

        for file_path in raw_files:
            if file_path.suffix.lower() not in [".txt", ".pdf", ".html", ".htm", ".json"]:
                continue

            # Identify matching scheme
            matched_scheme_id = None
            for key, s_id in file_to_scheme_map.items():
                if key in file_path.name.lower():
                    matched_scheme_id = s_id
                    break

            if not matched_scheme_id:
                logger.warning(f"No scheme mapping for file: {file_path.name}")
                continue

            scheme_obj = next((s for s in VERIFIED_SCHEMES if s.id == matched_scheme_id), None)
            if not scheme_obj:
                continue

            sections = self.parser.extract_from_file(file_path)
            file_chunks = self.chunker.create_chunks_for_scheme(
                scheme_id=scheme_obj.id,
                scheme_name=scheme_obj.name,
                category=scheme_obj.category,
                source_title=scheme_obj.source_title,
                source_url=scheme_obj.source_url,
                verified=scheme_obj.verified,
                raw_sections=sections
            )
            all_chunks.extend(file_chunks)
            logger.info(f"Extracted {len(file_chunks)} chunks from {file_path.name}")

        # Save processed files
        settings.PROCESSED_DATA_DIR.mkdir(parents=True, exist_ok=True)

        schemes_file = settings.PROCESSED_DATA_DIR / "schemes.json"
        with open(schemes_file, "w", encoding="utf-8") as f:
            json.dump(schemes_json, f, indent=2, ensure_ascii=False)

        chunks_file = settings.PROCESSED_DATA_DIR / "chunks.json"
        with open(chunks_file, "w", encoding="utf-8") as f:
            json.dump(all_chunks, f, indent=2, ensure_ascii=False)

        logger.info(f"Ingestion complete: {len(schemes_json)} schemes, {len(all_chunks)} chunks saved.")
        return all_chunks
