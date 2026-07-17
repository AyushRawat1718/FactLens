import React from "react";
import { motion } from "framer-motion";

const letter = {
  hidden: { opacity: 0, y: 12, filter: "blur(8px)" },
  show: { opacity: 1, y: 0, filter: "blur(0px)" },
};

// Character-by-character reveal for the hero headline.
export default function CharReveal({ text, className = "", baseDelay = 0 }) {
  return (
    <motion.span
      className={className}
      initial="hidden"
      animate="show"
      aria-label={text}
    >
      {Array.from(text).map((ch, i) => (
        <motion.span
          key={i}
          className="inline-block"
          variants={letter}
          transition={{ duration: 0.5, delay: (baseDelay + i * 32) / 1000, ease: [0.2, 0.65, 0.3, 1] }}
        >
          {ch === " " ? "\u00A0" : ch}
        </motion.span>
      ))}
    </motion.span>
  );
}
