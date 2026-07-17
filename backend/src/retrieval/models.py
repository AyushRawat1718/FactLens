# src/retrieval/models.py

from dataclasses import dataclass


@dataclass
class Evidence:
    """
    Represents a single piece of retrieved evidence.
    """

    title: str
    url: str
    content: str
    score: float | None = None


@dataclass
class EvidenceBundle:
    """
    Collection of evidence returned for a claim.
    """

    claim: str
    evidence: list[Evidence]