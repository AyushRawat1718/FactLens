# src/config.py

import os
from dotenv import load_dotenv

# ----------------------------------
# Load Environment Variables
# ----------------------------------

load_dotenv()

# ----------------------------------
# AI Provider API Keys
# ----------------------------------

GROQ_API_KEY = os.getenv("GROQ_API_KEY")
OPENROUTER_API_KEY = os.getenv("OPENROUTER_API_KEY")


# ----------------------------------
# AI Models
# ----------------------------------

GROQ_MODEL = os.getenv(
    "GROQ_MODEL",
    "llama-3.3-70b-versatile"
)

OPENROUTER_MODEL = os.getenv(
    "OPENROUTER_MODEL",
    "qwen/qwen3-235b-a22b:free"
)


# ----------------------------------
# Retrieval
# ----------------------------------

TAVILY_API_KEY = os.getenv("TAVILY_API_KEY")

# ----------------------------------
# Hugging Face Model
# ----------------------------------

HF_MODEL_ID = os.getenv(
    "HF_MODEL_ID",
    "ayushrawat-1718/youtube-fact-checker-roberta"
)

# ----------------------------------
# AI Configuration
# ----------------------------------

# Number of claims sent to the LLM in one request
BATCH_SIZE = int(os.getenv("BATCH_SIZE", 5))

# Number of Tavily search results retrieved per claim
MAX_EVIDENCE_RESULTS = int(
    os.getenv("MAX_EVIDENCE_RESULTS", 5)
)

# ----------------------------------
# Server Configuration
# ----------------------------------

HOST = os.getenv("HOST", "0.0.0.0")
PORT = int(os.getenv("PORT", 8000))

CORS_ORIGINS = [
    origin.strip()
    for origin in os.getenv("CORS_ORIGINS", "*").split(",")
    if origin.strip()
]

# ----------------------------------
# Validation
# ----------------------------------

required_keys = {
    "GROQ_API_KEY": GROQ_API_KEY,
    "OPENROUTER_API_KEY": OPENROUTER_API_KEY,
    "TAVILY_API_KEY": TAVILY_API_KEY,
}

missing = [
    key
    for key, value in required_keys.items()
    if not value
]

if missing:
    raise ValueError(
        "Missing environment variables: "
        + ", ".join(missing)
    )