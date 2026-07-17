import React from "react";
import { ArrowRight } from "lucide-react";

export function Badge({ children, icon: Icon }) {
  return (
    <span className="fl-focus inline-flex items-center gap-2 rounded-full border border-line bg-surface/60 px-3.5 py-1.5 text-[11.5px] font-mono uppercase tracking-wide text-teal">
      {Icon && <Icon size={12} />}
      {children}
    </span>
  );
}

export function PrimaryButton({ children, onClick, icon: Icon = ArrowRight, className = "" }) {
  return (
    <button
      onClick={onClick}
      className={`fl-focus group inline-flex items-center gap-2 rounded-full bg-teal px-5 py-3 text-[14.5px] font-semibold text-ink shadow-[0_16px_34px_-16px_rgba(79,209,197,0.6)] transition-transform hover:scale-[1.03] ${className}`}
    >
      {children}
      <Icon size={16} className="transition-transform group-hover:translate-x-0.5" />
    </button>
  );
}

export function GhostButton({ children, onClick, icon: Icon }) {
  return (
    <button
      onClick={onClick}
      className="fl-focus inline-flex items-center gap-2 rounded-full border border-line px-5 py-3 text-[14.5px] font-medium text-cream transition-colors hover:border-slate-500"
    >
      {Icon && <Icon size={15} />}
      {children}
    </button>
  );
}
