import sys
import os

sys.path.append(os.path.abspath(os.path.join(os.path.dirname(__file__), "..")))

# Manual smoke test — hits the real Groq/OpenRouter + Tavily APIs, so it
# needs GROQ_API_KEY, OPENROUTER_API_KEY, and TAVILY_API_KEY set in your
# .env. Run with:
#   python test/test_provider_manager.py
#
# Unlike test_groq.py, this exercises the full ProviderManager: evidence
# retrieval, real batching (one LLM request for the whole claims list),
# and automatic Groq -> OpenRouter failover if Groq's quota is hit.

from src.providers.provider_manager import ProviderManager

manager = ProviderManager()

result = manager.verify_claims([
    "The Earth revolves around the Sun.",
    "The Earth is flat."
])

print(result)