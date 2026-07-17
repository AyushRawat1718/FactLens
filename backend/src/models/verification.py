from dataclasses import dataclass


@dataclass
class Source:

    title: str

    url: str

    description: str


@dataclass
class VerificationResult:

    claim: str

    verdict: str

    confidence: float

    reasoning: str

    sources: list[Source]