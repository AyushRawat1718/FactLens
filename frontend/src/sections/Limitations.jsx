import React from "react";
import { ServerOff, Clock3, Globe2, FileDown } from "lucide-react";
import Reveal from "../components/ui/Reveal.jsx";

// Honest, current constraints — update as each one gets resolved.
const items = [
  {
    Icon: ServerOff,
    title: "Live demo is currently offline",
    body: "The verification backend needs more memory than free-tier hosting reliably provides, so it isn't consistently live right now. A full walkthrough video is provided instead.",
  },
  {
    Icon: Clock3,
    title: "Shorts and videos up to ~15 minutes",
    body: "Longer videos aren't supported yet — the pipeline is tuned for shorter, denser content for now.",
  },
  {
    Icon: Globe2,
    title: "English-language videos only",
    body: "Transcript extraction and claim verification are both tuned for English at the moment.",
  },
  {
    Icon: FileDown,
    title: "Report export not yet wired up",
    body: "HTML/PDF report generation exists on the backend but isn't connected to the frontend UI yet.",
  },
];

export default function Limitations() {
  return (
    <section className="mx-auto max-w-5xl px-5 py-20 sm:px-8">
      <Reveal className="mb-10 text-center">
        <h2 className="font-serif text-[28px] font-semibold sm:text-[32px]">Current limitations</h2>
        <p className="mx-auto mt-3 max-w-md text-[14px] text-muted">
          Built and shipped by one person — here's what's genuinely not finished yet.
        </p>
      </Reveal>

      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
        {items.map((it, i) => (
          <Reveal key={it.title} delay={i * 90} className="flex items-start gap-3.5 rounded-2xl border border-line bg-surface p-5">
            <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg border border-line bg-ink">
              <it.Icon size={16} className="text-muted" />
            </div>
            <div>
              <h3 className="text-[14px] font-semibold">{it.title}</h3>
              <p className="mt-1 text-[12.5px] leading-relaxed text-muted">{it.body}</p>
            </div>
          </Reveal>
        ))}
      </div>
    </section>
  );
}
