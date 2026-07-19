import React from "react";
import { motion } from "framer-motion";
import {
  Youtube,
  FileText,
  ScanText,
  Brain,
  Search,
  ShieldCheck,
  RefreshCw,
  FileCheck2,
  ArrowRight,
  ArrowDown,
} from "lucide-react";
import Reveal from "../components/ui/Reveal.jsx";

// Three grouped phases instead of one flat list: ingest, understand, verify.
const phases = [
  {
    label: "01",
    title: "Ingest",
    description: "Pull the raw material out of the video.",
    steps: [
      { label: "YouTube URL", sub: "Video is fetched", Icon: Youtube },
      { label: "Transcript", sub: "Captions extracted", Icon: FileText },
      { label: "Sentence Segmentation", sub: "Split into checkable units", Icon: ScanText },
    ],
  },
  {
    label: "02",
    title: "Understand",
    description: "Work out what's actually a claim worth checking.",
    steps: [
      { label: "Claim Classification", sub: "Factual vs. disputed vs. filler", Icon: Brain },
      { label: "Evidence Retrieval", sub: "Real sources gathered per claim", Icon: Search },
    ],
  },
  {
    label: "03",
    title: "Verify & Report",
    description: "Check each claim and hand back a sourced verdict.",
    steps: [
      { label: "AI Verification", sub: "Checked against retrieved evidence", Icon: ShieldCheck },
      { label: "Automatic Fallback", sub: "A second provider takes over if needed", Icon: RefreshCw },
      { label: "Interactive Report", sub: "Verdicts, reasoning, real sources", Icon: FileCheck2 },
    ],
  },
];

function PhaseCard({ phase, delay }) {
  return (
    <Reveal delay={delay} variant="scale" className="flex-1">
      <div className="lift flex h-full flex-col rounded-2xl border border-line bg-surface p-5">
        <div className="flex items-center gap-2.5">
          <span className="font-mono text-[11px] text-teal">{phase.label}</span>
          <h3 className="font-serif text-[17px] font-semibold">{phase.title}</h3>
        </div>
        <p className="mt-1 text-[12.5px] text-muted">{phase.description}</p>

        <div className="mt-4 flex flex-col gap-2.5">
          {phase.steps.map((s) => (
            <div
              key={s.label}
              className="flex items-center gap-2.5 rounded-lg border border-line bg-ink px-3 py-2.5"
            >
              <div className="flex h-7 w-7 shrink-0 items-center justify-center rounded-md border border-teal/40 bg-teal/10">
                <s.Icon size={13} className="text-teal" />
              </div>
              <div className="min-w-0">
                <div className="text-[12.5px] font-medium">{s.label}</div>
                <div className="truncate text-[10.5px] text-muted">{s.sub}</div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </Reveal>
  );
}

export default function HowItWorks() {
  return (
    <section id="how" className="mx-auto max-w-5xl px-5 py-20 sm:px-8">
      <Reveal className="mb-12 text-center">
        <h2 className="font-serif text-[30px] font-semibold sm:text-[36px]">How it works</h2>
        <p className="mx-auto mt-3 max-w-md text-[14.5px] text-muted">
          Three phases, from raw video to a sourced verdict — ingest the material, understand
          what's actually being claimed, then verify and report on it.
        </p>
      </Reveal>

      <div className="flex flex-col items-stretch gap-4 lg:flex-row lg:items-start">
        {phases.map((phase, i) => (
          <React.Fragment key={phase.title}>
            <PhaseCard phase={phase} delay={i * 140} />
            {i < phases.length - 1 && (
              <Reveal
                delay={i * 140 + 80}
                className="flex items-center justify-center py-1 lg:py-0"
              >
                <motion.div
                  animate={{ x: [0, 4, 0] }}
                  transition={{ duration: 1.6, repeat: Infinity, ease: "easeInOut" }}
                  className="text-teal/70"
                >
                  <ArrowDown size={18} className="lg:hidden" />
                  <ArrowRight size={18} className="hidden lg:block" />
                </motion.div>
              </Reveal>
            )}
          </React.Fragment>
        ))}
      </div>
    </section>
  );
}
