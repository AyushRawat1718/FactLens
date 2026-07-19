import React, { useState } from "react";
import { Play } from "lucide-react";
import Reveal from "../components/ui/Reveal.jsx";
import { Badge } from "../components/ui/Buttons.jsx";

// Set ONE of these in .env once the demo is recorded — see README.
//   VITE_DEMO_YOUTUBE_ID=xxxxxxxxxxx   (recommended: upload as Unlisted, not Private)
//   VITE_DEMO_VIDEO_URL=/demo.mp4      (file placed in frontend/public/)
const YOUTUBE_ID = import.meta.env.VITE_DEMO_YOUTUBE_ID;
const VIDEO_URL = import.meta.env.VITE_DEMO_VIDEO_URL;

function VideoFrame() {
  const [playing, setPlaying] = useState(false);
  const [notice, setNotice] = useState(false);

  if (YOUTUBE_ID) {
    return playing ? (
      <iframe
        className="aspect-video w-full rounded-lg"
        src={`https://www.youtube-nocookie.com/embed/${YOUTUBE_ID}?autoplay=1`}
        title="FactLens demo"
        allow="accelerate-encryption; autoplay; encrypted-media; picture-in-picture"
        allowFullScreen
      />
    ) : (
      <button
        onClick={() => setPlaying(true)}
        className="fl-focus lift relative z-10 flex h-16 w-16 items-center justify-center rounded-full bg-teal"
        aria-label="Play demo video"
      >
        <Play size={22} fill="#0B0E14" color="#0B0E14" />
      </button>
    );
  }

  if (VIDEO_URL) {
    return (
      <video
        className="aspect-video w-full rounded-lg"
        src={VIDEO_URL}
        controls
        preload="metadata"
      />
    );
  }

  // No video configured yet — honest placeholder instead of a dead button.
  return (
    <>
      <button
        onClick={() => {
          setNotice(true);
          setTimeout(() => setNotice(false), 2600);
        }}
        className="fl-focus lift relative z-10 flex h-16 w-16 items-center justify-center rounded-full bg-teal"
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
        <div className="rounded-t-2xl border-x border-t border-[#232a38] bg-[#161b25] p-2.5">
          <div className="grid-bg relative flex aspect-video items-center justify-center overflow-hidden rounded-lg bg-gradient-to-br from-surface to-ink">
            <VideoFrame />
          </div>
        </div>
        <div className="mx-auto h-3 w-full rounded-b-2xl bg-gradient-to-b from-[#232a38] to-[#0d1017]" />
        <div className="mx-auto -mt-1 h-1.5 w-28 rounded-b-xl bg-[#0d1017]" />
      </Reveal>
    </section>
  );
}
