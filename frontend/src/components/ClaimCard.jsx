import React from "react";
import { Link2 } from "lucide-react";
import Reveal from "./ui/Reveal.jsx";
import RingGauge from "./ui/RingGauge.jsx";
import { VERDICTS } from "../data/claims.js";

export function VerdictBadge({ verdict }) {
  const v = VERDICTS[verdict];
  const Icon = v.Icon;
  return (
    <span
      className={`inline-flex items-center gap-1.5 rounded-full border px-2.5 py-1 text-[11px] font-mono font-medium uppercase tracking-wide ${v.badgeClass}`}
    >
      <Icon size={12} strokeWidth={2.5} />
      {v.label}
    </span>
  );
}

export default function ClaimCard({ claim, delay = 0 }) {
  const v = VERDICTS[claim.verdict];
  return (
    <Reveal delay={delay} className="lift rounded-2xl border border-line bg-surface p-5">
      <div className="flex items-start gap-4">
        <RingGauge value={claim.confidence} color={v.color} />
        <div className="min-w-0 flex-1">
          <div className="mb-2 flex flex-wrap items-center gap-2">
            <VerdictBadge verdict={claim.verdict} />
            <span className="font-mono text-[11px] text-muted">
              confidence {Math.round(claim.confidence * 100)}%
            </span>
          </div>
          <p className="text-[15px] leading-relaxed">{claim.text}</p>
          <div className="mt-3 rounded-xl border border-line bg-ink p-3.5 text-[13.5px] leading-relaxed text-muted">
            {claim.reasoning}
          </div>
          {claim.sources.length > 0 && (
            <div className="mt-3 flex flex-wrap gap-2">
              {claim.sources.map((s) => (
                <span
                  key={s.label}
                  className="inline-flex items-center gap-1 rounded-full border border-line px-2.5 py-1 font-mono text-[11px] text-muted"
                >
                  <Link2 size={10} /> {s.label}
                </span>
              ))}
            </div>
          )}
        </div>
      </div>
    </Reveal>
  );
}
