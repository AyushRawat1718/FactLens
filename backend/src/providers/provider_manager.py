# src/providers/provider_manager.py

from src.providers.gemini import GeminiProvider
from src.providers.groq import GroqProvider


class ProviderManager:

    def __init__(self):
        self.gemini = GeminiProvider()
        self.groq = GroqProvider()

    def verify_claims(self, claims: list[str]):

        # Try Gemini first
        result = self.gemini.verify_claims(claims)

        if result["success"]:
            return result

        print("Gemini failed. Falling back to Groq...")

        # Fallback to Groq
        result = self.groq.verify_claims(claims)

        if result["success"]:
            return result

        # Both providers failed
        return {
            "success": False,
            "provider": None,
            "error": {
                "code": "AI_QUOTA_EXCEEDED",
                "message": (
                    "We're currently experiencing high demand. "
                    "Both AI providers are temporarily unavailable. "
                    "Please try again later."
                )
            }
        }