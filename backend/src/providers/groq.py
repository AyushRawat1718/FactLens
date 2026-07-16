from groq import Groq

from src.config import GROQ_API_KEY
from src.providers.base import AIProvider
from src.providers.utils import extract_json


class GroqProvider(AIProvider):

    def __init__(self):
        self.client = Groq(api_key=GROQ_API_KEY)
        self.model = "llama-3.3-70b-versatile"

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

            response = self.client.chat.completions.create(
                model=self.model,
                messages=[
                    {
                        "role": "user",
                        "content": prompt
                    }
                ],
                temperature=0.2,
            )

            raw = response.choices[0].message.content

            data = extract_json(raw)

            if data is None:
                return {
                    "success": False,
                    "provider": "groq",
                    "error": {
                        "code": "INVALID_RESPONSE",
                        "message": "Groq returned invalid JSON."
                    }
                }

            return {
                "success": True,
                "provider": "groq",
                "results": data
            }

        except Exception as e:

            return {
                "success": False,
                "provider": "groq",
                "error": {
                    "code": "REQUEST_FAILED",
                    "message": str(e)
                }
            }