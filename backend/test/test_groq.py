import sys
import os

sys.path.append(os.path.abspath(os.path.join(os.path.dirname(__file__), "..")))

# Manual smoke test — hits the real Groq + Tavily APIs, so it needs
# GROQ_API_KEY and TAVILY_API_KEY set in your .env. Run with:
#   python test/test_groq.py

from src.providers.groq import GroqProvider
from src.retrieval.tavily import TavilyRetriever

provider = GroqProvider()
retriever = TavilyRetriever()

claims = [
    "The Earth revolves around the Sun.",
    "The Earth is flat.",
]

# GroqProvider.verify_batch verifies the whole list in ONE request, so it
# needs one evidence bundle per claim (same order as `claims`).
evidence_bundles = [retriever.search(claim) for claim in claims]

result = provider.verify_batch(claims, evidence_bundles)

print(result)
