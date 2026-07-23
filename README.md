<h1 align="center">FactLens</h1>

<p align="center">
  <strong>AI-Powered YouTube Fact Checker</strong>
</p>

<p align="center">
  An end-to-end AI pipeline that extracts factual claims from YouTube videos, retrieves supporting evidence, and verifies them using Large Language Models.
</p>

<p align="center">
  🌐 <a href="https://fact-lens-indol.vercel.app/">Live Website</a> •
  🤗 <a href="https://huggingface.co/ayushrawat-1718/youtube-fact-checker-roberta">Hugging Face Model</a>
</p>

---

FactLens is an AI-powered fact verification system that analyzes YouTube videos, extracts factual claims from their transcripts, retrieves supporting evidence from the web, and verifies each claim using Large Language Models.

Unlike traditional video summarization tools, FactLens identifies factual claims, retrieves supporting evidence, and generates explainable, source-backed verification reports with verdicts, confidence scores, and reasoning.

---

## Why FactLens?

Millions of factual claims are shared through online videos every day, yet verifying them often requires manually searching multiple sources.

FactLens simplifies this process by combining Natural Language Processing, Information Retrieval, and Large Language Models into a complete AI pipeline capable of automatically verifying factual claims from YouTube videos.

The project focuses on:

- Detecting meaningful factual claims instead of processing every sentence.
- Retrieving supporting evidence before verification.
- Producing explainable AI-generated verdicts.
- Providing real evidence sources for every verified claim.

---

## Features

- 🎥 YouTube video transcript extraction
- ✂️ Sentence segmentation using spaCy
- 🧠 AI-powered factual claim detection
- 🔍 Evidence retrieval from trusted web sources
- 🤖 LLM-based fact verification
- 📊 Confidence scoring
- 📄 Structured verification reports
- 🔄 Automatic LLM provider failover
- 📱 Responsive React frontend
- 🎬 Interactive product walkthrough

---

## System Architecture

```text
YouTube URL
      │
      ▼
Transcript Extraction (yt-dlp)
      │
      ▼
Sentence Segmentation (spaCy)
      │
      ▼
RoBERTa Claim Classifier
      │
      ▼
Evidence Retrieval (Tavily)
      │
      ▼
LLM Verification
(Groq → OpenRouter Failover)
      │
      ▼
Verdict + Confidence + Evidence
```

---

## Tech Stack

| Frontend | Backend |
|-----------|----------|
| React | FastAPI |
| Vite | Python |
| Tailwind CSS | Hugging Face Transformers |
| Framer Motion | RoBERTa |
| React Router | spaCy |
| | yt-dlp |
| | Tavily Search API |
| | Groq |
| | OpenRouter |
| | scikit-learn |

---

## Model

FactLens uses a **fine-tuned RoBERTa model** to classify transcript sentences before verification.

Instead of sending every transcript sentence to an LLM, the classifier filters out:

- Opinions
- Greetings
- Conversational filler
- Personal statements
- Non-verifiable content

Only factual claims continue through the verification pipeline, reducing unnecessary LLM requests while improving efficiency and overall accuracy.

---

## Model Weights

The fine-tuned RoBERTa claim classification model is available on Hugging Face.

🤗 **Repository**

https://huggingface.co/ayushrawat-1718/youtube-fact-checker-roberta

The repository includes:

- Fine-tuned model weights
- Tokenizer
- Model configuration
- Usage examples

---

## Verification Pipeline

Each detected factual claim passes through the following stages:

1. Query Generation
2. Evidence Retrieval
3. Evidence Ranking
4. LLM Verification
5. Verdict Generation

Each verified claim contains:

- ✅ Verdict
- 📈 Confidence Score
- 📝 AI-generated Explanation
- 🔗 Supporting Evidence
- 🌐 Source References

---

## Model Evaluation

The RoBERTa classifier is evaluated on a manually labeled benchmark dataset using **scikit-learn**.

Evaluation metrics include:

- Accuracy
- Precision
- Recall
- F1 Score
- Confusion Matrix

Run the evaluation using:

```bash
cd backend
python -m src.evaluate_classifier
```

The generated report is stored at:

```text
backend/reports/model_evaluation.json
```

---

## Running Locally

### Backend

```bash
cd backend

pip install -r requirements.txt

cp .env.example .env
```

Configure:

```env
GROQ_API_KEY=
OPENROUTER_API_KEY=
TAVILY_API_KEY=
```

Run:

```bash
uvicorn src.app:app --reload
```

Backend:

```text
http://localhost:8000
```

---

### Frontend

```bash
cd frontend

npm install

cp .env.example .env
```

Configure:

```env
VITE_API_URL=http://localhost:8000
```

Run:

```bash
npm run dev
```

Frontend:

```text
http://localhost:5173
```

---

## Deployment

### Frontend

The frontend is deployed on **Vercel** and showcases:

- Project overview
- System architecture
- Classifier performance
- Technology stack
- Product walkthrough

🌐 https://fact-lens-indol.vercel.app/

### Backend

The backend is fully implemented and can be run locally using the setup instructions above.

Since the complete verification pipeline relies on multiple external AI providers, custom NLP models, and third-party APIs, it is not continuously hosted under free-tier infrastructure. The live website therefore includes a recorded product walkthrough demonstrating the complete verification workflow.

---

## Current Limitations

- English-language videos only
- Optimized for videos up to approximately 10–15 minutes
- Backend is intended for local execution
- Verification quality depends on retrieved evidence
- Processing time varies depending on transcript length and web search latency

---

## Future Improvements

- 🌍 Multi-language support
- 📄 PDF & HTML report export
- 📦 Docker deployment
- 📊 Batch video processing
- ⚡ Cached verification results
- 🔍 Additional evidence providers
- 👤 User authentication
- 📁 Saved verification history

---

## Project Structure

```text
FactLens/
├── backend/      FastAPI backend & AI verification pipeline
├── frontend/     React + Vite portfolio website
└── README.md
```

---

## ✨ Credits

Built with ❤️ by **Ayush Rawat**

FactLens is an end-to-end AI engineering project exploring claim extraction, evidence retrieval, and LLM-powered fact verification for YouTube content.

If you found this project useful or interesting, consider giving the repository a ⭐.

---

## 🤝 Contributing

Contributions are welcome!

Whether it's improving the verification pipeline, enhancing the UI, optimizing the AI workflow, or fixing bugs, every contribution is appreciated.

1. Fork the repository.
2. Create a feature branch.
3. Commit your changes.
4. Open a Pull Request 🚀.

---

## 📄 License

This project is licensed under the **MIT License**. See the `LICENSE` file for details.
