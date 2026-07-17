import React from "react";
import { Play } from "lucide-react";
import Reveal from "../components/ui/Reveal.jsx";
import { Badge } from "../components/ui/Buttons.jsx";

export default function Demo() {
  return (
    <section className="mx-auto max-w-4xl px-5 py-20 sm:px-8">
      <Reveal className="text-center">
        <Badge icon={Play}>Product demo</Badge>
        <h2 className="mt-4 font-serif text-[30px] font-semibold sm:text-[36px]">
          Watch FactLens verify a real video
        </h2>
        <p className="mx-auto mt-3 max-w-md text-[14.5px] text-muted">
          A short walkthrough of a video going from raw transcript to a fully sourced report.
        </p>
      </Reveal>

      <Reveal delay={150} variant="scale" className="mx-auto mt-10 max-w-3xl">
        {/* MacBook-style mockup — swap the placeholder for a real <video> or embed */}
        <div className="rounded-t-2xl border-x border-t border-[#232a38] bg-[#161b25] p-2.5">
          <div className="grid-bg relative flex aspect-video items-center justify-center overflow-hidden rounded-lg bg-gradient-to-br from-surface to-ink">
            <button
              className="fl-focus lift relative z-10 flex h-16 w-16 items-center justify-center rounded-full bg-teal"
              aria-label="Play demo video"
            >
              <Play size={22} fill="#0B0E14" color="#0B0E14" />
            </button>
          </div>
        </div>
        <div className="mx-auto h-3 w-full rounded-b-2xl bg-gradient-to-b from-[#232a38] to-[#0d1017]" />
        <div className="mx-auto -mt-1 h-1.5 w-28 rounded-b-xl bg-[#0d1017]" />
      </Reveal>
    </section>
  );
}
