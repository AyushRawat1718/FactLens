import React from "react";
import { Brain, Sparkles, Zap, FileCheck2, Server, Layers } from "lucide-react";
import Reveal from "../components/ui/Reveal.jsx";

const items = [
  { Icon: Brain, title: "Custom NLP Classification", body: "A RoBERTa model fine-tuned to isolate factual claims from opinion and filler." },
  { Icon: Sparkles, title: "Gemini Verification", body: "Each claim is checked against sourced, current information via Gemini." },
  { Icon: Zap, title: "Automatic Groq Fallback", body: "If Gemini is unavailable, Groq steps in seamlessly — no interruption." },
  { Icon: FileCheck2, title: "Evidence-backed Reports", body: "Every verdict ships with reasoning and linked sources, not just a label." },
  { Icon: Server, title: "FastAPI Backend", body: "A lean, typed API layer handles transcription, classification, and verification." },
  { Icon: Layers, title: "Interactive Dashboard", body: "Filter, search, and export results in a focused, distraction-free interface." },
];

export default function Why() {
  return (
    <section className="mx-auto max-w-6xl px-5 py-20 sm:px-8">
      <Reveal className="mb-12 text-center">
        <h2 className="font-serif text-[30px] font-semibold sm:text-[36px]">Why FactLens</h2>
      </Reveal>
      <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-3">
        {items.map((f, i) => (
          <Reveal key={f.title} delay={i * 90} variant="scale" className="lift rounded-2xl border border-line p-6">
            <div className="flex h-10 w-10 items-center justify-center rounded-xl border border-teal/40 bg-teal/10">
              <f.Icon size={18} className="text-teal" />
            </div>
            <h3 className="mt-4 text-[15.5px] font-semibold">{f.title}</h3>
            <p className="mt-1.5 text-[13.5px] leading-relaxed text-muted">{f.body}</p>
          </Reveal>
        ))}
      </div>
    </section>
  );
}
