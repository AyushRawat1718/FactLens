# 🧠 YouTube Fact Checker (AI-Powered)

An end-to-end **AI Fact-Checking System** that:

- Downloads & extracts YouTube transcripts (including Shorts)
- Splits the transcript into sentences (spaCy)
- Classifies each sentence using a **custom RoBERTa claim-classifier**
- Retrieves supporting evidence for each claim via **Tavily Search**
- Fact-checks claims in batches using **Groq**, automatically failing over
  to **OpenRouter** if Groq's quota/rate limit is hit
- Generates a **detailed HTML / PDF report**
- Provides a **FastAPI backend** + **Streamlit UI**

👉 Ideal for research, misinformation analysis, YouTube content analysis, and academic demos.

---

## 🚀 Features

### ✅ 1. Transcript Extraction

- Supports **YouTube URLs**, **YouTube Shorts URLs**, **YouTube IDs**, and **local transcript files (`.json3`)**
- Uses `yt-dlp` for auto-subtitle extraction

### ✅ 2. Sentence Segmentation

- Uses **spaCy** (`en_core_web_sm`) to split transcript into clean sentences

### ✅ 3. Claim Classification

Uses a **fine-tuned RoBERTa model** to classify sentences into:

- `FACTUAL_CLAIM`
- `DISPUTED_CLAIM`
- `NOT_A_CLAIM`

### ✅ 4. LLM Fact Verification

Claims are grouped into batches (`BATCH_SIZE` in `.env`, default 5) and each
batch is verified in a **single LLM request** — not one request per claim.

For each claim, evidence is retrieved via **Tavily Search** first, then the
whole batch (claims + their evidence) is sent to:

- **Groq** (`llama-3.3-70b-versatile` by default) — tried first
- **OpenRouter** (`qwen/qwen3-235b-a22b:free` by default) — automatic
  fallback if Groq hits a quota/rate limit/auth error for this video

Once a provider fails with a quota/auth-type error, it's disabled for the
rest of that video (not retried every batch) and the next provider takes
over. Provider availability resets for each new video.

Each verified claim returns:

```json
{
  "claim": "...",
  "verdict": "TRUE | FALSE | PARTIALLY TRUE | UNVERIFIABLE",
  "confidence": 0.0,
  "reasoning": "Short reasoning",
  "sources": [{ "title": "", "description": "", "url": "" }],
  "provider": "groq | openrouter | null"
}
```

### ✅ 5. Output Report

Generates:

- HTML Report
- (Optional) PDF Report via wkhtmltopdf

✅ 6. UI + API

- FastAPI backend for pipeline execution

- Streamlit UI for simple user-friendly interface

## 📂 Project Structure

```
backend/
│
├── model/ # NOT included in repo (download separately)
│
├── reports/ # (auto-created) saved HTML / PDF results
│
├── src/
│ ├── app.py # FastAPI backend
│ ├── streamlit_app.py # Streamlit UI
│ ├── pipeline.py # Main logic orchestrator
│ ├── model_loader.py # Loads RoBERTa classifier
│ ├── fact_checker.py # Thin wrapper around ProviderManager
│ ├── segmenter.py # Transcript extraction + spaCy split
│ ├── triage.py # Claim classification
│ ├── report_generator.py
│ ├── evaluate_classifier.py # test robustness of classifier
│ ├── providers/
│ │ ├── provider_manager.py # Batching, evidence fetch, failover, logging
│ │ ├── groq.py # Groq batch provider
│ │ ├── openrouter.py # OpenRouter batch provider (fallback)
│ │ ├── prompts.py # Batch prompt builder
│ │ ├── base.py # AIProvider interface
│ │ └── utils.py # JSON extraction + batch-result reconciliation
│ └── retrieval/
│   ├── tavily.py # Tavily evidence search
│   ├── models.py # Evidence / EvidenceBundle dataclasses
│   └── base.py # RetrievalProvider interface
│
├── yt_captions/ # Auto-downloaded captions
│
├── requirements.txt
├── .env.example
├── .gitignore
└── README.md
```

## 📥 Model Download (IMPORTANT)

The trained RoBERTa model is too large for GitHub.

📌 Download the model folder from Google Drive:
👉 [Link](https://drive.google.com/file/d/1tTpVDudmCzzR7kyBYxouhDYCb1_6xu8x/view?usp=sharing)

After downloading:

```
youtube-fact-checker/
│
└── model/
      ├── config.json
      ├── merges.txt
      ├── model.safetensors
      ├── special_tokens_map.json
      ├── tokenizer.json
      ├── tokenizer_config.json
      ├── training_args.bin
      ├── vocab.json
```

## ⚙️ Installation (No venv required)

Anyone cloning the repo can run this project by following these steps:

### 1️⃣ Install Python 3.10+

Download from: https://www.python.org/downloads/

### 2️⃣ Install Requirements

Open terminal inside project folder:

```bash
pip install -r requirements.txt
```

### 3️⃣ Configure API Keys

Copy the example env file and fill in your keys:

```bash
cp .env.example .env
```

You'll need free/low-cost keys from:
👉 [Groq](https://console.groq.com/keys)
👉 [OpenRouter](https://openrouter.ai/keys)
👉 [Tavily](https://tavily.com)

All three are required — Groq is tried first, OpenRouter is the automatic
fallback, and Tavily supplies the evidence each claim is checked against.

### 4️⃣ (Optional) Install PDF Export Support

Install wkhtmltopdf (required):
👉 https://wkhtmltopdf.org/downloads.html

Run in terminal inside project folder

```bash
pip install pdfkit
```

## ▶️ Run the Project

### Start the FastAPI Backend

```bash
uvicorn src.app:app --reload
```

### Start Streamlit UI

(Run in another terminal)

```bash
streamlit run src/streamlit_app.py
```

## 🎯 Usage

Paste a YouTube URL in Streamlit:

```bash
https://www.youtube.com/watch?v=XXXXXXX
```

## 🧾 SAMPLE OUTPUT

### A sample result looks like:

```
Total sentences: 98
Factual claims: 12
Disputed claims: 4
Ignored: 82
```

### Example factual claim:

```
Sentence: "Water boils at 100°C at sea level."
Model Score: 0.97
Verdict: TRUE
Reasoning: Scientific fact confirmed by multiple sources.
Sources:
- Title: Boiling point (Wikipedia)
  URL: https://en.wikipedia.org/wiki/Boiling_point
Provider: groq
```

### Example disputed claim:

```
Sentence: "The earth is flat."
Model Score: 0.99
Verdict: FALSE
Reasoning: Overwhelming scientific evidence contradicts this.
Sources:
- Title: Earth
  URL: https://en.wikipedia.org/wiki/Earth
Provider: openrouter
```

![Demo Screenshot](https://github.com/AyushRawat1718/youtube-fact-checker/blob/main/Screenshot/Screenshot1718.png)


## 🧩 Tech Stack

| Component              | Technology                          |
| ---------------------- | ------------------------------------ |
| Transcript Extraction  | yt-dlp                               |
| Sentence Splitting     | spaCy                                |
| Claim Classification   | Custom RoBERTa model                 |
| Evidence Retrieval     | Tavily Search                        |
| Fact Checking          | Groq (primary) → OpenRouter (fallback), batched |
| Backend                | FastAPI                              |
| Frontend               | React (see `../frontend`) + Streamlit (dev UI) |
| Report Generation      | HTML / PDF                           |

## ✨ Credits

- Built with passion by `Ayush Rawat` ✨
  This project was inspired by modern misinformation-detection research and designed for clarity, usability, and real-world utility.

- If this tool helps you, consider giving the repo a ⭐ on GitHub!

## 🤝 Contributing

Contributions are warmly welcomed!
Whether it's improving accuracy, extending the UI, or optimizing the pipeline — your help makes this project better

1. Fork the repository
2. Create a new branch (feature/new-feature)
3. Commit your changes
4. Open a pull request 🚀
