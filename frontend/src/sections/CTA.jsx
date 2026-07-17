import React from "react";
import { Link } from "react-router-dom";
import Reveal from "../components/ui/Reveal.jsx";
import LensMark from "../components/ui/Logo.jsx";
import { PrimaryButton } from "../components/ui/Buttons.jsx";

export default function CTA() {
  return (
    <section className="mx-auto max-w-5xl px-5 pb-24 sm:px-8">
      <Reveal className="relative overflow-hidden rounded-3xl border border-line bg-surface px-8 py-16 text-center">
        <div className="glow pointer-events-none absolute left-1/2 top-0 h-64 w-64 -translate-x-1/2 rounded-full bg-teal/[0.18]" />
        <div className="relative">
          <LensMark size={36} spin />
          <h2 className="mt-4 font-serif text-[28px] font-semibold sm:text-[34px]">
            Ready to verify your next video?
          </h2>
          <div className="mt-7 flex justify-center">
            <Link to="/dashboard">
              <PrimaryButton onClick={() => {}}>Launch FactLens</PrimaryButton>
            </Link>
          </div>
        </div>
      </Reveal>
    </section>
  );
}
