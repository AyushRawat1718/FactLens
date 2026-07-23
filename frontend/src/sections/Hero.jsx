import React from "react";
import { motion } from "framer-motion";
import { Link } from "react-router-dom";
import { Github, Sparkles, Link2, Play } from "lucide-react";
import Reveal from "../components/ui/Reveal.jsx";
import CharReveal from "../components/ui/CharReveal.jsx";
import LensMark from "../components/ui/Logo.jsx";
import RingGauge from "../components/ui/RingGauge.jsx";
import { Badge, PrimaryButton, GhostButton } from "../components/ui/Buttons.jsx";
import { VerdictBadge } from "../components/ClaimCard.jsx";
import { T } from "../lib/tokens.js";
import { scrollToSection } from "../lib/scrollTo.js";

function DashboardPreviewMock() {
  const chips = [
    { label: "TRUE", color: "text-teal border-teal/40", style: { top: "-6%", left: "-8%" }, delay: 0 },
    { label: "DISPUTED", color: "text-amber border-amber/40", style: { top: "70%", left: "-16%" }, delay: 0.7 },
    { label: "UNVERIFIABLE", color: "text-slate border-slate/40", style: { top: "-8%", right: "-6%" }, delay: 1.3 },
  ];

  return (
    <div className="relative mx-auto w-full max-w-md">
      <div className="pointer-events-none absolute -inset-10 flex items-center justify-center">
        <div className="absolute h-full w-full animate-spin-slow rounded-full border border-dashed border-line" />
        <div className="absolute inset-6 animate-spin-slow-rev rounded-full border border-line" />
      </div>

      {chips.map((c) => (
        <motion.div
          key={c.label}
          className={`absolute z-30 rounded-full border bg-surface px-2.5 py-1 font-mono text-[10px] tracking-wide ${c.color}`}
          style={c.style}
          animate={{ y: [0, -10, 0] }}
          transition={{ duration: 4.5, repeat: Infinity, ease: "easeInOut", delay: c.delay }}
        >
          {c.label}
        </motion.div>
      ))}

      <Reveal variant="scale" delay={900} className="relative z-20 overflow-hidden rounded-2xl border border-line bg-surface2 shadow-2xl">
        <div className="flex items-center gap-1.5 border-b border-line px-4 py-3">
          <span className="h-2.5 w-2.5 rounded-full bg-coral/40" />
          <span className="h-2.5 w-2.5 rounded-full bg-amber/40" />
          <span className="h-2.5 w-2.5 rounded-full bg-teal/40" />
          <span className="ml-3 font-mono text-[11px] text-muted">factlens.app/dashboard</span>
        </div>
        <div className="bg-surface p-5">
          <div className="mb-4 flex items-center gap-2 rounded-lg border border-line bg-ink px-3 py-2.5">
            <Link2 size={13} className="text-teal" />
            <span className="truncate font-mono text-[11.5px] text-muted">youtube.com/watch?v=ddkZO6QaNeU</span>
          </div>
          <div className="grid grid-cols-3 gap-2.5">
            {[["76", "Sentences"], ["39", "Claims"], ["84%", "Reliability"]].map(([v, l]) => (
              <div key={l} className="rounded-lg border border-line bg-ink p-3">
                <div className="font-mono text-[16px] font-bold">{v}</div>
                <div className="text-[10px] text-muted">{l}</div>
              </div>
            ))}
          </div>
          <div className="mt-3 flex items-center gap-3 rounded-lg border border-line bg-ink p-3">
            <RingGauge value={0.94} size={36} stroke={4} color={T.teal} labelSize={9} />
            <div className="min-w-0 flex-1">
              <VerdictBadge verdict="true" />
              <div className="mt-1 truncate text-[11.5px] text-muted">Welcome to the Global News podcast…</div>
            </div>
          </div>
        </div>
      </Reveal>
    </div>
  );
}

export default function Hero() {
  return (
    <section className="relative overflow-hidden px-5 pb-20 pt-20 sm:px-8 sm:pt-28">
      <div className="grid-bg pointer-events-none absolute inset-0" />
      <motion.div
        className="glow pointer-events-none absolute -left-24 top-6 h-72 w-72 rounded-full bg-teal/[0.18]"
        animate={{ opacity: [0.45, 1, 0.45] }}
        transition={{ duration: 3, repeat: Infinity, ease: "easeInOut" }}
      />
      <div className="glow pointer-events-none absolute -right-20 top-52 h-80 w-80 rounded-full bg-amber/[0.11]" />
      <svg className="noise pointer-events-none absolute inset-0 h-full w-full">
        <filter id="n"><feTurbulence baseFrequency="0.9" numOctaves="2" stitchTiles="stitch" /></filter>
        <rect width="100%" height="100%" filter="url(#n)" />
      </svg>

      <div className="relative mx-auto grid max-w-6xl grid-cols-1 items-center gap-16 lg:grid-cols-2">
        <div>
          <Reveal>
            <Badge icon={Sparkles}>Custom classifier · AI verification with fallback</Badge>
          </Reveal>

          <h1 className="mt-6 font-serif text-[46px] font-semibold leading-[1.03] tracking-tight sm:text-[64px]">
            <CharReveal text="FactLens" baseDelay={150} />
          </h1>

          <Reveal delay={620} as="p" className="mt-3 text-[19px] font-medium text-teal">
            Every claim deserves evidence.
          </Reveal>

          <Reveal delay={740}>
            <p className="mt-4 max-w-md text-[15.5px] leading-relaxed text-muted">
              FactLens detects factual claims in any YouTube video with a custom-trained
              classifier, verifies each one against real sources with an AI verification layer
              that automatically falls back to a second provider if the first is
              unavailable, and renders an evidence-backed report you can trust.
            </p>
          </Reveal>

          <Reveal delay={860} className="mt-8 flex flex-wrap items-center gap-3">
            <a href="#demo" onClick={scrollToSection("demo")}>
              <PrimaryButton onClick={() => {}} icon={Play}>Watch Demo</PrimaryButton>
            </a>
            <a href="https://github.com/AyushRawat1718/FactLens" target="_blank" rel="noreferrer">
              <GhostButton icon={Github}>View GitHub</GhostButton>
            </a>
          </Reveal>

          <Reveal delay={920} className="mt-3 text-[12px] text-muted">
            Live demo currently offline due to hosting constraints — see the video walkthrough below.
          </Reveal>

          <Reveal delay={980} className="mt-10">
            <div className="flex gap-8">
              {[["76", "sentences"], ["39", "claims found"], ["84%", "reliability"]].map(([n, l]) => (
                <div key={l}>
                  <div className="font-mono text-[21px] font-semibold">{n}</div>
                  <div className="text-[11.5px] text-muted">{l}</div>
                </div>
              ))}
            </div>
            <p className="mt-2 text-[10.5px] text-muted">
              From the example report shown here — not an aggregate stat. See the classifier's real
              evaluation results below.
            </p>
          </Reveal>
        </div>

        <DashboardPreviewMock />
      </div>
    </section>
  );
}
