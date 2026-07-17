import React from "react";
import { Layers, Server, Brain, Sparkles, Zap, ScanText, Wand2 } from "lucide-react";
import Reveal from "../components/ui/Reveal.jsx";

const stack = [
  { label: "React", Icon: Layers },
  { label: "FastAPI", Icon: Server },
  { label: "RoBERTa", Icon: Brain },
  { label: "Gemini", Icon: Sparkles },
  { label: "Groq", Icon: Zap },
  { label: "spaCy", Icon: ScanText },
  { label: "Hugging Face", Icon: Sparkles },
  { label: "Tailwind CSS", Icon: Layers },
  { label: "Framer Motion", Icon: Wand2 },
];
const loop = [...stack, ...stack];

export default function TechStack() {
  return (
    <section className="py-20">
      <Reveal className="mb-10 px-5 text-center sm:px-8">
        <h2 className="font-serif text-[30px] font-semibold sm:text-[36px]">Tech stack</h2>
      </Reveal>
      <div className="marquee-mask overflow-hidden">
        <div className="flex w-max animate-marquee gap-4 px-4 hover:[animation-play-state:paused]">
          {loop.map((s, i) => (
            <div key={i} className="lift flex items-center gap-2.5 rounded-2xl border border-line bg-surface px-5 py-4">
              <s.Icon size={17} className="text-teal" />
              <span className="whitespace-nowrap text-[13.5px] font-medium">{s.label}</span>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
