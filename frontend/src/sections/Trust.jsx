import React from "react";
import { ShieldCheck, CheckCircle2 } from "lucide-react";
import Reveal from "../components/ui/Reveal.jsx";

const points = [
  "Claims are first filtered by a custom-trained RoBERTa model.",
  "Only likely factual claims are sent to the LLM layer.",
  "Gemini is the primary verifier.",
  "Groq is the automatic fallback if Gemini is unavailable.",
  "Evidence and sources are displayed alongside every verdict.",
];

export default function Trust() {
  return (
    <section id="trust" className="mx-auto max-w-3xl px-5 py-20 sm:px-8">
      <Reveal className="rounded-3xl border border-line bg-surface p-8 sm:p-12">
        <div className="flex items-center gap-3">
          <div className="flex h-10 w-10 items-center justify-center rounded-xl border border-teal/40 bg-teal/10">
            <ShieldCheck size={18} className="text-teal" />
          </div>
          <h2 className="font-serif text-[24px] font-semibold sm:text-[28px]">Trust &amp; Transparency</h2>
        </div>
        <p className="mt-4 max-w-lg text-[14px] leading-relaxed text-muted">
          FactLens is making factual judgments, so it's worth being plain about how a verdict
          gets produced.
        </p>
        <ul className="mt-6 flex flex-col gap-3">
          {points.map((p, i) => (
            <Reveal as="li" key={p} delay={i * 70} className="flex items-start gap-3 text-[14px]">
              <CheckCircle2 size={16} className="mt-0.5 shrink-0 text-teal" />
              {p}
            </Reveal>
          ))}
        </ul>
        <div className="mt-6 rounded-xl border border-amber/40 bg-amber/[0.06] px-4 py-3.5 text-[13px] leading-relaxed text-muted">
          <strong className="text-amber">AI can make mistakes.</strong> Treat FactLens results as
          decision support, not absolute truth.
        </div>
      </Reveal>
    </section>
  );
}
