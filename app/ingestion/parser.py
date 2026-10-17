import json
import logging
from pathlib import Path
from typing import Dict, List, Optional
from bs4 import BeautifulSoup
import pypdf

logger = logging.getLogger(__name__)


class DocumentParser:
    """Extracts text from PDF, HTML, TXT, and JSON files with metadata preservation."""

    @staticmethod
    def extract_from_file(file_path: Path) -> List[Dict[str, any]]:
        """
        Parses a file and returns a list of page/section dictionaries:
        [{'text': str, 'page_number': int, 'source_file': str}]
        """
        if not file_path.exists():
            raise FileNotFoundError(f"File not found: {file_path}")

        suffix = file_path.suffix.lower()

        if suffix == ".pdf":
            return DocumentParser._parse_pdf(file_path)
        elif suffix in [".html", ".htm"]:
            return DocumentParser._parse_html(file_path)
        elif suffix == ".txt":
            return DocumentParser._parse_txt(file_path)
        elif suffix == ".json":
            return DocumentParser._parse_json(file_path)
        else:
            logger.warning(f"Unsupported file format '{suffix}' for {file_path.name}")
            return []

    @staticmethod
    def _parse_pdf(file_path: Path) -> List[Dict[str, any]]:
        sections = []
        try:
            reader = pypdf.PdfReader(str(file_path))
            total_pages = len(reader.pages)
            total_text_length = 0

            for idx, page in enumerate(reader.pages, start=1):
                page_text = page.extract_text() or ""
                cleaned = page_text.strip()
                total_text_length += len(cleaned)
                if cleaned:
                    sections.append({
                        "text": cleaned,
                        "page_number": idx,
                        "source_file": file_path.name
                    })

            if total_pages > 0 and total_text_length < 50:
                logger.warning(
                    f"PDF {file_path.name} contains {total_pages} pages but barely extracted text. "
                    "This document may be scanned or image-based and requires OCR."
                )

        except Exception as e:
            logger.error(f"Error parsing PDF {file_path}: {e}")
            raise
        return sections

    @staticmethod
    def _parse_html(file_path: Path) -> List[Dict[str, any]]:
        try:
            content = file_path.read_text(encoding="utf-8")
            soup = BeautifulSoup(content, "html.parser")

            # Remove scripts and style elements
            for tag in soup(["script", "style", "noscript", "header", "footer"]):
                tag.decompose()

            text = soup.get_text(separator="\n")
            lines = [line.strip() for line in text.splitlines() if line.strip()]
            cleaned_text = "\n".join(lines)

            return [{
                "text": cleaned_text,
                "page_number": 1,
                "source_file": file_path.name
            }]
        except Exception as e:
            logger.error(f"Error parsing HTML {file_path}: {e}")
            return []

    @staticmethod
    def _parse_txt(file_path: Path) -> List[Dict[str, any]]:
        try:
            text = file_path.read_text(encoding="utf-8").strip()
            return [{
                "text": text,
                "page_number": 1,
                "source_file": file_path.name
            }]
        except Exception as e:
            logger.error(f"Error parsing TXT {file_path}: {e}")
            return []

    @staticmethod
    def _parse_json(file_path: Path) -> List[Dict[str, any]]:
        try:
            with open(file_path, "r", encoding="utf-8") as f:
                data = json.load(f)
            # If structured scheme format, format into readable text
            text_repr = json.dumps(data, indent=2)
            return [{
                "text": text_repr,
                "page_number": 1,
                "source_file": file_path.name
            }]
        except Exception as e:
            logger.error(f"Error parsing JSON {file_path}: {e}")
            return []
