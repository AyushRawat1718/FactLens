import React, { useState } from "react";
import { Link, useLocation } from "react-router-dom";
import { Github, Sun } from "lucide-react";
import LensMark from "./ui/Logo.jsx";
import { PrimaryButton } from "./ui/Buttons.jsx";

function ThemeToggleStub() {
  const [note, setNote] = useState(false);
  return (
    <div className="relative">
      <button
        onClick={() => {
          setNote(true);
          setTimeout(() => setNote(false), 1600);
        }}
        className="fl-focus flex h-9 w-9 items-center justify-center rounded-lg border border-line text-muted transition-colors"
        aria-label="Theme toggle — coming soon"
      >
        <Sun size={15} />
      </button>
      {note && (
        <div className="absolute right-0 top-11 whitespace-nowrap rounded-lg border border-line bg-surface px-3 py-1.5 font-mono text-[11px] text-muted">
          light theme — coming soon
        </div>
      )}
    </div>
  );
}

export default function Navbar() {
  const { pathname } = useLocation();
  const isDashboard = pathname === "/dashboard";

  return (
    <header className="sticky top-0 z-40 border-b border-line bg-ink/80 backdrop-blur-md">
      <div className="mx-auto flex max-w-6xl items-center justify-between px-5 py-4 sm:px-8">
        <Link to="/" className="fl-focus flex items-center gap-2.5">
          <LensMark />
          <span className="font-serif text-[18px] font-semibold tracking-tight">FactLens</span>
        </Link>

        {!isDashboard ? (
          <div className="flex items-center gap-2 sm:gap-5">
            <a href="#how" className="hidden text-[13.5px] text-muted transition-colors hover:text-cream sm:block">
              How it works
            </a>
            <a href="#trust" className="hidden text-[13.5px] text-muted transition-colors hover:text-cream sm:block">
              Trust
            </a>
            <a
              href="https://github.com"
              target="_blank"
              rel="noreferrer"
              className="fl-focus hidden items-center gap-1.5 text-[13.5px] text-muted sm:flex"
            >
              <Github size={15} /> GitHub
            </a>
            <Link to="/dashboard">
              <PrimaryButton onClick={() => {}}>Launch FactLens</PrimaryButton>
            </Link>
          </div>
        ) : (
          <div className="flex items-center gap-3">
            <a
              href="https://github.com"
              target="_blank"
              rel="noreferrer"
              className="fl-focus flex items-center gap-1.5 text-[13.5px] text-muted"
            >
              <Github size={15} /> GitHub
            </a>
            <ThemeToggleStub />
          </div>
        )}
      </div>
    </header>
  );
}
