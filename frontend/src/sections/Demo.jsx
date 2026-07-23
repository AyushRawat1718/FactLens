import React, { useState } from "react";
import { Play } from "lucide-react";
import Reveal from "../components/ui/Reveal.jsx";
import { Badge } from "../components/ui/Buttons.jsx";

const YOUTUBE_ID = import.meta.env.VITE_DEMO_YOUTUBE_ID?.trim();
const VIDEO_URL = import.meta.env.VITE_DEMO_VIDEO_URL?.trim();

function VideoFrame() {
  const [playing, setPlaying] = useState(false);
  const [notice, setNotice] = useState(false);

  if (YOUTUBE_ID) {
    return playing ? (
      <iframe
        className="absolute inset-0 h-full w-full rounded-xl"
        src={`https://www.youtube.com/embed/${YOUTUBE_ID}?autoplay=1&rel=0&modestbranding=1`}
        title="FactLens Demo"
        loading="lazy"
        allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
        referrerPolicy="strict-origin-when-cross-origin"
        allowFullScreen
      />
    ) : (
      <button
        onClick={() => setPlaying(true)}
        className="fl-focus lift relative z-10 flex h-16 w-16 items-center justify-center rounded-full bg-teal shadow-xl"
        aria-label="Play demo video"
      >
        <Play size={22} fill="#0B0E14" color="#0B0E14" />
      </button>
    );
  }

  if (VIDEO_URL) {
    return (
      <video
        className="absolute inset-0 h-full w-full rounded-xl object-cover"
        src={VIDEO_URL}
        controls
        preload="metadata"
      />
    );
  }

  return (
    <>
      <button
        onClick={() => {
          setNotice(true);
          setTimeout(() => setNotice(false), 2600);
        }}
        className="fl-focus lift relative z-10 flex h-16 w-16 items-center justify-center rounded-full bg-teal shadow-xl"
        aria-label="Play demo video"
      >
        <Play size={22} fill="#0B0E14" color="#0B0E14" />
      </button>

      {notice && (
        <span className="absolute bottom-4 rounded-full border border-line bg-surface px-3 py-1.5 font-mono text-[11px] text-muted">
          Demo video coming soon
        </span>
      )}
    </>
  );
}

export default function Demo() {
  return (
    <section id="demo" className="mx-auto max-w-4xl px-5 py-20 sm:px-8">
      <Reveal className="text-center">
        <Badge icon={Play}>Product Demo</Badge>

        <h2 className="mt-4 font-serif text-[30px] font-semibold sm:text-[36px]">
          Watch FactLens verify a real video
        </h2>

        <p className="mx-auto mt-3 max-w-md text-[14.5px] text-muted">
          A short walkthrough of a video going from raw transcript to a fully sourced report.
        </p>
      </Reveal>

      <Reveal
        delay={150}
        variant="scale"
        className="mx-auto mt-10 max-w-3xl"
      >
        <div className="rounded-2xl border border-[#232a38] bg-[#161b25] p-3 shadow-2xl">
          <div className="relative aspect-video overflow-hidden rounded-xl bg-black flex items-center justify-center">
            <VideoFrame />
          </div>
        </div>
      </Reveal>
    </section>
  );
}