import React from "react";
import { HelpCircle, Target, Workflow, ArrowDown } from "lucide-react";
import Reveal from "../components/ui/Reveal.jsx";
import { scrollToSection } from "../lib/scrollTo.js";

const blocks = [
  {
    Icon: HelpCircle,
    label: "What",
    title: "An AI fact-checker for YouTube videos",
    body: "FactLens takes any YouTube video, pulls out the individual factual claims made in it, and checks each one against real, retrieved evidence — returning a verdict, the reasoning behind it, and the actual sources used.",
  },
  {
    Icon: Target,
    label: "Why",
    title: "Long-form video is hard to fact-check by hand",
    body: "A short video can still contain a dozen or more claims, buried in commentary and opinion. There's no easy way to tell which statements are actually checkable, let alone verify them — so most claims just go unexamined.",
  },
  {
    Icon: Workflow,
    label: "How",
    title: "Classify first, then verify with real evidence",
    body: "A custom-trained classifier separates factual claims from opinion and filler. Each claim is then checked against retrieved evidence by an AI verification layer with automatic fallback, so one provider being unavailable doesn't stop the process.",
  },
];

export default function Overview() {
  return (
    <section className="mx-auto max-w-6xl px-5 py-20 sm:px-8">
      <Reveal className="mb-12 text-center">
        <h2 className="font-serif text-[30px] font-semibold sm:text-[36px]">
          What FactLens is, and why it exists
        </h2>
      </Reveal>

      <div className="grid grid-cols-1 gap-5 md:grid-cols-3">
        {blocks.map((b, i) => (
          <Reveal key={b.label} delay={i * 110} variant="scale" className="lift rounded-2xl border border-line bg-surface p-6">
            <div className="flex items-center gap-2.5">
              <div className="flex h-9 w-9 items-center justify-center rounded-lg border border-teal/40 bg-teal/10">
                <b.Icon size={16} className="text-teal" />
              </div>
              <span className="font-mono text-[11px] uppercase tracking-widest text-teal">{b.label}</span>
            </div>
            <h3 className="mt-4 text-[16px] font-semibold leading-snug">{b.title}</h3>
            <p className="mt-2 text-[13.5px] leading-relaxed text-muted">{b.body}</p>
          </Reveal>
        ))}
      </div>

      <Reveal delay={330} className="mt-8 flex justify-center">
        <a
          href="#how"
          onClick={scrollToSection("how")}
          className="fl-focus flex items-center gap-1.5 font-mono text-[12px] text-muted transition-colors hover:text-teal"
        >
          See the full pipeline <ArrowDown size={13} />
        </a>
      </Reveal>
    </section>
  );
}
