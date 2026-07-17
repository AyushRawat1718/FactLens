import React from "react";
import { motion } from "framer-motion";
import { T } from "../../lib/tokens.js";

// The aperture/lens mark — FactLens's signature shape. Reused as the
// logo, the hero centerpiece, and the "processing" indicator in the
// dashboard (see sections/Hero.jsx and pages/Dashboard.jsx).
export default function LensMark({ size = 26, spin = false }) {
  const ticks = Array.from({ length: 8 }).map((_, i) => {
    const a = (i * 360) / 8;
    const r = (a * Math.PI) / 180;
    return {
      x1: 20 + 15 * Math.cos(r),
      y1: 20 + 15 * Math.sin(r),
      x2: 20 + 18.5 * Math.cos(r),
      y2: 20 + 18.5 * Math.sin(r),
    };
  });

  const svg = (
    <svg width={size} height={size} viewBox="0 0 40 40" fill="none">
      <circle cx="20" cy="20" r="18" stroke={T.teal} strokeWidth="1.4" opacity="0.45" />
      <circle cx="20" cy="20" r="12" stroke={T.teal} strokeWidth="1.4" opacity="0.85" />
      {ticks.map((t, i) => (
        <line key={i} x1={t.x1} y1={t.y1} x2={t.x2} y2={t.y2} stroke={T.teal} strokeWidth="1.4" />
      ))}
      <circle cx="20" cy="20" r="4" fill={T.teal} />
    </svg>
  );

  if (!spin) return svg;

  return (
    <motion.div
      animate={{ rotate: 360 }}
      transition={{ duration: 1.1, repeat: Infinity, ease: "linear" }}
      style={{ width: size, height: size }}
    >
      {svg}
    </motion.div>
  );
}
