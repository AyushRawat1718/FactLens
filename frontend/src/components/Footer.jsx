import React from "react";
import { Github, Linkedin, Mail } from "lucide-react";
import LensMark from "./ui/Logo.jsx";

export default function Footer() {
  return (
    <footer className="border-t border-line px-5 py-10 sm:px-8">
      <div className="mx-auto flex max-w-6xl flex-col items-center justify-between gap-5 sm:flex-row">
        <div className="flex items-center gap-2">
          <LensMark size={20} />
          <span className="font-serif text-[14.5px] font-semibold">FactLens</span>
        </div>
        <div className="flex items-center gap-5 text-muted">
          <a href="https://github.com" target="_blank" rel="noreferrer" className="fl-focus hover:text-cream" aria-label="GitHub">
            <Github size={17} />
          </a>
          <a href="https://linkedin.com" target="_blank" rel="noreferrer" className="fl-focus hover:text-cream" aria-label="LinkedIn">
            <Linkedin size={17} />
          </a>
          <a href="mailto:hello@factlens.app" className="fl-focus hover:text-cream" aria-label="Email">
            <Mail size={17} />
          </a>
        </div>
      </div>
    </footer>
  );
}
