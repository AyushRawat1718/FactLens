# src/retrieval/base.py

from abc import ABC, abstractmethod

from src.retrieval.models import EvidenceBundle


class RetrievalProvider(ABC):
    """
    Base interface for every retrieval provider.
    """

    @abstractmethod
    def search(self, claim: str) -> EvidenceBundle:
        """
        Retrieve evidence for a factual claim.
        """
        pass