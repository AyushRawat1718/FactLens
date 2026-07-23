import React from "react";
import { ExternalLink } from "lucide-react";
import Reveal from "../components/ui/Reveal.jsx";

// Real attribution — the actual services/tools this project is built on
// and pulls evidence from, each linking to its real site.
const refs = [
  { name: "Hugging Face", desc: "Hosts the fine-tuned claim classifier", url: "https://huggingface.co" },
  { name: "Groq", desc: "Primary AI verification provider", url: "https://groq.com" },
  { name: "OpenRouter", desc: "Automatic fallback verification provider", url: "https://openrouter.ai" },
  { name: "Tavily", desc: "Real-time web search for evidence retrieval", url: "https://tavily.com" },
  { name: "spaCy", desc: "Sentence segmentation and NLP preprocessing", url: "https://spacy.io" },
  { name: "yt-dlp", desc: "YouTube transcript and metadata extraction", url: "https://github.com/yt-dlp/yt-dlp" },
];

export default function BuiltWith() {
  return (
    <section className="mx-auto max-w-4xl px-5 py-20 sm:px-8">
      <Reveal className="mb-10 text-center">
        <h2 className="font-serif text-[28px] font-semibold sm:text-[32px]">Built with</h2>
        <p className="mx-auto mt-3 max-w-md text-[14px] text-muted">
          The real services and tools FactLens runs on — evidence shown alongside every verdict
          is retrieved live from the open web via these, not written by the AI itself.
        </p>
      </Reveal>

      <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
        {refs.map((r, i) => (
          <Reveal key={r.name} delay={i * 70}>
            <a
              href={r.url}
              target="_blank"
              rel="noreferrer"
              className="fl-focus lift flex items-center justify-between gap-3 rounded-xl border border-line bg-surface px-4 py-3.5 transition-colors hover:border-teal/40"
            >
              <div>
                <div className="text-[13.5px] font-semibold">{r.name}</div>
                <div className="mt-0.5 text-[12px] text-muted">{r.desc}</div>
              </div>
              <ExternalLink size={14} className="shrink-0 text-muted" />
            </a>
          </Reveal>
        ))}
      </div>
    </section>
  );
}
