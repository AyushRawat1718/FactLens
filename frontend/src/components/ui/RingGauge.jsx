import React from "react";
import { T } from "../../lib/tokens.js";

// Radial confidence gauge used on every claim card and dashboard stat.
// The ring fill literally is the score — the one recurring "lens" motif.
export default function RingGauge({ value = 0, size = 56, stroke = 5, color = T.teal, labelSize }) {
  const r = (size - stroke) / 2;
  const c = 2 * Math.PI * r;
  const dash = Math.max(0.02, value) * c;

  return (
    <svg width={size} height={size} viewBox={`0 0 ${size} ${size}`}>
      <circle cx={size / 2} cy={size / 2} r={r} stroke={T.border} strokeWidth={stroke} fill="none" />
      <circle
        cx={size / 2}
        cy={size / 2}
        r={r}
        stroke={color}
        strokeWidth={stroke}
        fill="none"
        strokeLinecap="round"
        strokeDasharray={`${dash} ${c}`}
        transform={`rotate(-90 ${size / 2} ${size / 2})`}
        style={{ transition: "stroke-dasharray 1s cubic-bezier(.2,.7,.3,1)" }}
      />
      <text
        x="50%"
        y="52%"
        textAnchor="middle"
        dominantBaseline="middle"
        className="font-mono"
        fill={T.text}
        fontSize={labelSize || size * 0.24}
        fontWeight="700"
      >
        {Math.round(value * 100)}%
      </text>
    </svg>
  );
}
