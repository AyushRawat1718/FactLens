import React, { Fragment } from "react";
import { Layers, Server, Brain, Sparkles, Zap, FileCheck2 } from "lucide-react";
import Reveal from "../components/ui/Reveal.jsx";

const nodes = [
  { label: "React", Icon: Layers },
  { label: "FastAPI", Icon: Server },
  { label: "RoBERTa", Icon: Brain },
  { label: "Gemini", Icon: Sparkles },
  { label: "Groq", Icon: Zap },
  { label: "Reports", Icon: FileCheck2 },
];

export default function Architecture() {
  return (
    <section className="mx-auto max-w-xl px-5 py-20 sm:px-8">
      <Reveal className="mb-12 text-center">
        <h2 className="font-serif text-[30px] font-semibold sm:text-[36px]">Architecture</h2>
      </Reveal>
      <div className="relative flex flex-col items-center">
        {nodes.map((n, i) => (
          <Fragment key={n.label}>
            <Reveal delay={i * 90} variant="scale" className="lift flex items-center gap-3 rounded-xl border border-line px-5 py-3">
              <n.Icon size={16} className="text-teal" />
              <span className="text-[14px] font-semibold">{n.label}</span>
            </Reveal>
            {i < nodes.length - 1 && (
              <div className="relative h-8 w-px bg-line">
                <span
                  className="absolute -left-[3px] top-0 h-1.5 w-1.5 animate-flow rounded-full bg-teal"
                  style={{ animationDelay: `${i * 0.3}s` }}
                />
              </div>
            )}
          </Fragment>
        ))}
      </div>
    </section>
  );
}
