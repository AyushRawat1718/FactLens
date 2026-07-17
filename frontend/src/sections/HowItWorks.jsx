import React, { Fragment } from "react";
import { motion } from "framer-motion";
import { Youtube, FileText, ScanText, Brain, Sparkles, Zap, FileCheck2 } from "lucide-react";
import Reveal from "../components/ui/Reveal.jsx";

const stages = [
  { label: "YouTube URL", sub: "Video is fetched", Icon: Youtube },
  { label: "Transcript", sub: "Captions extracted", Icon: FileText },
  { label: "Sentence Segmentation", sub: "Split into units", Icon: ScanText },
  { label: "RoBERTa Classification", sub: "Factual vs. non-factual", Icon: Brain },
  { label: "Gemini Verification", sub: "Checked against sources", Icon: Sparkles },
  { label: "Groq Fallback", sub: "Only if Gemini is unavailable", Icon: Zap },
  { label: "Interactive Report", sub: "Verdicts, evidence, export", Icon: FileCheck2 },
];

export default function HowItWorks() {
  return (
    <section id="how" className="mx-auto max-w-2xl px-5 py-20 sm:px-8">
      <Reveal className="mb-12 text-center">
        <h2 className="font-serif text-[30px] font-semibold sm:text-[36px]">How it works</h2>
        <p className="mx-auto mt-3 max-w-sm text-[14.5px] text-muted">
          One pipeline, from raw video to a sourced verdict.
        </p>
      </Reveal>
      <div className="flex flex-col items-center">
        {stages.map((s, i) => (
          <Fragment key={s.label}>
            <Reveal delay={i * 110} variant="scale">
              <div className="flex w-64 items-center gap-3 rounded-xl border border-line bg-surface px-4 py-3 sm:w-80">
                <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg border border-teal/40 bg-teal/10">
                  <s.Icon size={15} className="text-teal" />
                </div>
                <div className="min-w-0">
                  <div className="text-[13.5px] font-semibold">{s.label}</div>
                  <div className="truncate text-[11px] text-muted">{s.sub}</div>
                </div>
              </div>
            </Reveal>
            {i < stages.length - 1 && (
              <svg width="2" height="26" className="my-0.5">
                <motion.line
                  x1="1" y1="0" x2="1" y2="26"
                  stroke="#4FD1C5" strokeWidth="2"
                  initial={{ pathLength: 0 }}
                  whileInView={{ pathLength: 1 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.5, delay: i * 0.11 + 0.2 }}
                />
              </svg>
            )}
          </Fragment>
        ))}
      </div>
    </section>
  );
}
