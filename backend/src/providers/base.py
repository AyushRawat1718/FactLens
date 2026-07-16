# src/providers/base.py

from abc import ABC, abstractmethod


class AIProvider(ABC):
    """
    Base class for every AI provider.

    Any provider (Gemini, Groq, OpenRouter, etc.)
    must implement the verify_claims() method.
    """

    @abstractmethod
    def verify_claims(self, claims: list[str]) -> dict:
        """
        Accepts a list of claims and returns
        a standardized response.
        """
        pass