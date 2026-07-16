# src/config.py

import os
from dotenv import load_dotenv

# ----------------------------------
# Load environment variables
# ----------------------------------
load_dotenv()

# ----------------------------------
# AI Provider API Keys
# ----------------------------------
GEMINI_API_KEY = os.getenv("GEMINI_API_KEY")
GROQ_API_KEY = os.getenv("GROQ_API_KEY")

# ----------------------------------
# Hugging Face Model
# ----------------------------------
HF_MODEL_ID = os.getenv(
    "HF_MODEL_ID",
    "ayushrawat-1718/youtube-fact-checker-roberta"
)

# ----------------------------------
# Provider Configuration
# ----------------------------------
PRIMARY_PROVIDER = os.getenv("PRIMARY_PROVIDER", "gemini")
SECONDARY_PROVIDER = os.getenv("SECONDARY_PROVIDER", "groq")

# ----------------------------------
# AI Configuration
# ----------------------------------
BATCH_SIZE = int(os.getenv("BATCH_SIZE", 5))

# ----------------------------------
# Validation
# ----------------------------------
if not GEMINI_API_KEY:
    raise ValueError("GEMINI_API_KEY not found in .env")

if not GROQ_API_KEY:
    raise ValueError("GROQ_API_KEY not found in .env")