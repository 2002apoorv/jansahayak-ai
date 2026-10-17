import os
from dotenv import load_dotenv
from google import genai

load_dotenv()

api_key = os.getenv("GEMINI_API_KEY")
model = os.getenv("GEMINI_MODEL", "gemini-2.5-flash")

if not api_key:
    raise SystemExit("GEMINI_API_KEY is missing from .env")

client = genai.Client(api_key=api_key)

try:
    response = client.models.generate_content(
        model=model,
        contents="Reply with exactly: Gemini connection successful."
    )
    print("Model:", model)
    print("Response:", response.text)

except Exception as exc:
    print("Error type:", type(exc).__name__)
    print("Error:", exc)