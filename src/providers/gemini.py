from google import genai
from google.genai import types

from src.config import GEMINI_API_KEY
from src.providers.base import AIProvider
from src.providers.utils import extract_json


class GeminiProvider(AIProvider):

    def __init__(self):
        self.client = genai.Client(api_key=GEMINI_API_KEY)
        self.model = "gemini-3.5-flash"

    def verify_claims(self, claims: list[str]) -> dict:

        prompt = f"""
You are an expert fact-checking assistant.

Verify every claim independently.

Return ONLY valid JSON.

Claims:
{chr(10).join(f"{i+1}. {claim}" for i, claim in enumerate(claims))}

Return this JSON format:

[
  {{
    "claim": "",
    "verdict": "TRUE | FALSE | PARTIALLY TRUE | UNVERIFIABLE",
    "confidence": 0.95,
    "reasoning": "",
    "sources": [
      {{
        "title": "",
        "description": "",
        "url": ""
      }}
    ]
  }}
]
"""

        try:
            response = self.client.models.generate_content(
                model=self.model,
                contents=prompt,
                config=types.GenerateContentConfig(
                    temperature=0.2,
                    max_output_tokens=2048,
                ),
            )

            data = extract_json(response.text)

            if data is None:
                return {
                    "success": False,
                    "provider": "gemini",
                    "error": {
                        "code": "INVALID_RESPONSE",
                        "message": "Gemini returned invalid JSON."
                    }
                }

            return {
                "success": True,
                "provider": "gemini",
                "results": data
            }

        except Exception as e:
            return {
                "success": False,
                "provider": "gemini",
                "error": {
                    "code": "REQUEST_FAILED",
                    "message": str(e)
                }
            }