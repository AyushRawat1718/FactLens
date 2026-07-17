# src/retrieval/tavily.py

from tavily import TavilyClient

from src.config import (
    TAVILY_API_KEY,
    MAX_EVIDENCE_RESULTS,
)

from src.retrieval.base import RetrievalProvider
from src.retrieval.models import (
    Evidence,
    EvidenceBundle,
)


class TavilyRetriever(RetrievalProvider):
    """
    Retrieves supporting evidence for factual claims using Tavily Search.
    """

    def __init__(self):
        self.client = TavilyClient(api_key=TAVILY_API_KEY)

    def search(self, claim: str) -> EvidenceBundle:

        response = self.client.search(
            query=claim,
            topic="general",
            search_depth="advanced",
            max_results=MAX_EVIDENCE_RESULTS,
            include_answer=False,
            include_raw_content=False,
        )

        evidence = []

        for result in response.get("results", []):

            evidence.append(
                Evidence(
                    title=result.get("title", ""),
                    url=result.get("url", ""),
                    content=result.get("content", ""),
                    score=result.get("score"),
                )
            )

        return EvidenceBundle(
            claim=claim,
            evidence=evidence,
        )
        