from groq import Groq

from src.config import GROQ_API_KEY, GROQ_MODEL
from src.providers.base import AIProvider
from src.providers.prompts import build_batch_fact_check_prompt
from src.providers.utils import extract_json_array, reconcile_batch_results


DISABLE_KEYWORDS = [
    "429",
    "quota",
    "rate limit",
    "payment required",
    "401",
    "403",
    "404",
    "503",
    "unauthorized",
    "model_not_found",
]


class GroqProvider(AIProvider):

    def __init__(self):
        self.client = Groq(api_key=GROQ_API_KEY)
        self.model = GROQ_MODEL

    def verify_batch(self, claims: list[str], evidence_bundles: list) -> dict:
        """
        Verifies an entire batch of claims in a SINGLE Groq request.
        """

        prompt = build_batch_fact_check_prompt(claims, evidence_bundles)

        try:

            response = self.client.chat.completions.create(
                model=self.model,
                messages=[
                    {
                        "role": "user",
                        "content": prompt,
                    }
                ],
                temperature=0.2,
            )

            choices = getattr(response, "choices", None)

            if not choices:
                return {
                    "success": False,
                    "provider": "groq",
                    "disable_provider": False,
                    "error": {
                        "code": "EMPTY_RESPONSE",
                        "message": "Groq returned a response with no choices.",
                    },
                }

            message = getattr(choices[0], "message", None)
            raw = getattr(message, "content", None) if message else None

            if not raw:
                return {
                    "success": False,
                    "provider": "groq",
                    "disable_provider": False,
                    "error": {
                        "code": "EMPTY_RESPONSE",
                        "message": "Groq returned an empty message.",
                    },
                }

            data = extract_json_array(raw)

            if data is None:
                return {
                    "success": False,
                    "provider": "groq",
                    "disable_provider": False,
                    "error": {
                        "code": "INVALID_RESPONSE",
                        "message": "Groq returned invalid JSON.",
                    },
                }

            results = reconcile_batch_results(claims, data, evidence_bundles)

            return {
                "success": True,
                "provider": "groq",
                "results": results,
            }

        except Exception as e:

            error_message = str(e)
            lowered = error_message.lower()

            disable_provider = any(
                keyword in lowered
                for keyword in DISABLE_KEYWORDS
            )

            return {
                "success": False,
                "provider": "groq",
                "disable_provider": disable_provider,
                "error": {
                    "code": "REQUEST_FAILED",
                    "message": error_message,
                },
            }
