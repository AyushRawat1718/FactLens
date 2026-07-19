import React from "react";
import { motion } from "framer-motion";
import { Atom, Server, Brain, ShieldCheck, RefreshCw, Wind, Wand2, ScanText } from "lucide-react";
import Reveal from "../components/ui/Reveal.jsx";
import LensMark from "../components/ui/Logo.jsx";

// Generic capability labels — describes what each piece does, not which vendor.
const stack = [
  { label: "React", Icon: Atom },
  { label: "FastAPI", Icon: Server },
  { label: "Custom Classifier", Icon: Brain },
  { label: "AI Verification", Icon: ShieldCheck },
  { label: "Automatic Fallback", Icon: RefreshCw },
  { label: "NLP Pipeline", Icon: ScanText },
  { label: "Tailwind CSS", Icon: Wind },
  { label: "Framer Motion", Icon: Wand2 },
];

const RADIUS_DESKTOP = 168;
const RADIUS_MOBILE = 118;

function OrbitItem({ item, index, total, radius }) {
  const angle = (index / total) * 360;
  const rad = (angle * Math.PI) / 180;
  const x = radius * Math.cos(rad);
  const y = radius * Math.sin(rad);

  return (
    <div
      className="absolute left-1/2 top-1/2"
      style={{ transform: `translate(${x}px, ${y}px) translate(-50%, -50%)` }}
    >
      {/* Counter-rotate so the label always stays upright while the ring spins */}
      <motion.div
        animate={{ rotate: -360 }}
        transition={{ duration: 34, repeat: Infinity, ease: "linear" }}
        className="lift flex items-center gap-2 whitespace-nowrap rounded-full border border-line bg-surface px-3.5 py-2"
      >
        <item.Icon size={14} className="text-teal" />
        <span className="text-[12px] font-medium">{item.label}</span>
      </motion.div>
    </div>
  );
}

function Orbit({ radius, size }) {
  return (
    <div className="relative mx-auto" style={{ width: size, height: size }}>
      <div className="absolute inset-0 rounded-full border border-dashed border-line" />

      <div className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2">
        <div className="flex h-14 w-14 items-center justify-center rounded-full border border-teal/40 bg-teal/10">
          <LensMark size={26} />
        </div>
      </div>

      {/* The ring itself rotates endlessly; each item counter-rotates
          (see OrbitItem) so only the ring position loops, not the text. */}
      <motion.div
        className="absolute inset-0"
        animate={{ rotate: 360 }}
        transition={{ duration: 34, repeat: Infinity, ease: "linear" }}
      >
        {stack.map((item, i) => (
          <OrbitItem key={item.label} item={item} index={i} total={stack.length} radius={radius} />
        ))}
      </motion.div>
    </div>
  );
}

export default function TechStack() {
  return (
    <section className="mx-auto max-w-4xl px-5 py-20 sm:px-8">
      <Reveal className="mb-14 text-center">
        <h2 className="font-serif text-[30px] font-semibold sm:text-[36px]">Tech stack</h2>
        <p className="mx-auto mt-3 max-w-sm text-[14.5px] text-muted">
          Everything orbits the same core loop — build, classify, verify, report.
        </p>
      </Reveal>

      <div className="hidden sm:block">
        <Orbit radius={RADIUS_DESKTOP} size={RADIUS_DESKTOP * 2 + 140} />
      </div>
      <div className="sm:hidden">
        <Orbit radius={RADIUS_MOBILE} size={RADIUS_MOBILE * 2 + 120} />
      </div>
    </section>
  );
}
