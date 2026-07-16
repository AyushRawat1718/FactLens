import sys
import os

sys.path.append(os.path.abspath(os.path.join(os.path.dirname(__file__), "..")))

from src.providers.groq import GroqProvider

provider = GroqProvider()

result = provider.verify_claims([
    "The Earth revolves around the Sun.",
    "The Earth is flat."
])

print(result)