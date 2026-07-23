import React, { useState, useMemo } from "react";
import { Link } from "react-router-dom";
import { Youtube, ChevronRight, Search, FileOutput, Clock, CheckCircle2, Zap, ServerOff } from "lucide-react";
import Reveal from "../components/ui/Reveal.jsx";
import LensMark from "../components/ui/Logo.jsx";
import RingGauge from "../components/ui/RingGauge.jsx";
import { PrimaryButton, GhostButton } from "../components/ui/Buttons.jsx";
import ClaimCard from "../components/ClaimCard.jsx";
import { T } from "../lib/tokens.js";
import { checkVideo } from "../lib/api.js";
import { scrollToSection } from "../lib/scrollTo.js";

// Set VITE_LIVE_DEMO=true once the backend has a stable host. Until then
// this stays false so the page is honest about being frontend-only
// instead of letting people hit a backend that isn't running.
const LIVE_DEMO_ENABLED = import.meta.env.VITE_LIVE_DEMO === "true";

// analyze() calls the backend via lib/api.js (POST /check). No live
// per-stage progress from the API, so the pipeline UI just animates
// while the request is in flight. If providersExhausted comes back true
// with zero verified claims, we show the quota screen; if some claims
// verified before the outage, we show a dismissible banner instead.

function StatCard({ label, value, delay = 0 }) {
  return (
    <Reveal delay={delay} className="lift rounded-2xl border border-line p-4">
      <div className="font-mono text-[10.5px] uppercase tracking-wide text-muted">{label}</div>
      <div className="mt-2 font-mono text-[24px] font-bold">{value}</div>
    </Reveal>
  );
}

function ProcessingPipeline({ activeIndex }) {
  const stages = [
    "Transcript Extraction",
    "Sentence Segmentation",
    "Claim Classification",
    "AI Verification",
    "Report Generation",
  ];
  return (
    <div className="flex flex-col gap-2.5">
      {stages.map((s, i) => {
        const state = i < activeIndex ? "done" : i === activeIndex ? "active" : "pending";
        return (
          <div
            key={s}
            className={`flex items-center gap-3 rounded-xl border px-4 py-3 transition-colors ${
              state === "active" ? "border-teal bg-teal/[0.08]" : "border-line bg-surface"
            } ${state === "pending" ? "opacity-50" : "opacity-100"}`}
          >
            {state === "done" ? (
              <CheckCircle2 size={16} className="text-teal" />
            ) : state === "active" ? (
              <LensMark size={16} spin />
            ) : (
              <span className="block h-4 w-4 rounded-full border-2 border-line" />
            )}
            <span className="text-[13.5px] font-medium">{s}</span>
            {state === "active" && (
              <span className="ml-auto h-1.5 w-10 animate-pulse rounded-full bg-teal/60" />
            )}
          </div>
        );
      })}
    </div>
  );
}

function OfflineNotice() {
  return (
    <Reveal className="mx-auto mt-8 max-w-xl rounded-2xl border border-line bg-surface px-6 py-8 text-center">
      <div className="mx-auto flex h-11 w-11 items-center justify-center rounded-xl border border-line bg-ink">
        <ServerOff size={18} className="text-muted" />
      </div>
      <h3 className="mt-4 font-serif text-[17px] font-semibold">Live demo temporarily unavailable</h3>
      <p className="mx-auto mt-2 max-w-sm text-[13px] leading-relaxed text-muted">
        The verification backend runs a fine-tuned model plus an NLP pipeline, which needs more
        memory than free-tier hosting reliably provides — so it isn't consistently live right now.
        In the meantime, watch a full run on a real video instead.
      </p>
      <Link
        to="/"
        onClick={(e) => {
          e.preventDefault();
          window.location.hash = "/";
          setTimeout(() => document.getElementById("demo")?.scrollIntoView({ behavior: "smooth" }), 150);
        }}
        className="fl-focus mt-5 inline-flex items-center gap-1.5 font-mono text-[12px] text-teal"
      >
        Watch the demo video
      </Link>
    </Reveal>
  );
}

function QuotaNotice({ onDismiss }) {
  return (
    <Reveal className="rounded-2xl border border-line px-6 py-10 text-center">
      <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-2xl border border-amber/40 bg-amber/10">
        <Zap size={20} className="text-amber" />
      </div>
      <h3 className="mt-4 font-serif text-[19px] font-semibold">AI Capacity Reached</h3>
      <p className="mx-auto mt-2 max-w-sm text-[13.5px] leading-relaxed text-muted">
        Our free AI providers have temporarily reached their request limits. We've automatically
        notified the administrator to refresh the API keys. You'll be able to continue using
        FactLens once capacity is restored. Thank you for your patience.
      </p>
      <button onClick={onDismiss} className="fl-focus mt-5 text-[13px] font-medium text-teal">
        Try again
      </button>
    </Reveal>
  );
}

// Partial-outage version of QuotaNotice — some results exist, so it's a dismissible banner, not a full-screen block.
function PartialOutageBanner({ onDismiss }) {
  return (
    <Reveal className="mb-6 flex items-start gap-3 rounded-xl border border-amber/40 bg-amber/[0.07] px-4 py-3.5">
      <Zap size={16} className="mt-0.5 shrink-0 text-amber" />
      <div className="min-w-0 flex-1 text-[13px] leading-relaxed text-muted">
        <span className="font-medium text-amber">AI capacity was reached partway through this video.</span>{" "}
        Claims below marked "Unverifiable — providers unavailable" couldn't be checked. Results that
        finished before that point are unaffected.
      </div>
      <button onClick={onDismiss} className="fl-focus shrink-0 text-[12px] text-muted hover:text-cream">
        Dismiss
      </button>
    </Reveal>
  );
}

export default function Dashboard() {
  const [url, setUrl] = useState("");
  const [status, setStatus] = useState("idle"); // idle | processing | done | quota | error
  const [activeStage, setActiveStage] = useState(0);
  const [filter, setFilter] = useState("all");
  const [query, setQuery] = useState("");
  const [claims, setClaims] = useState([]);
  const [stats, setStats] = useState([]);
  const [errorMessage, setErrorMessage] = useState("");
  const [showOutageBanner, setShowOutageBanner] = useState(false);
  const [reportNoticeVisible, setReportNoticeVisible] = useState(false);

  // Backend responds in one shot — this just animates the stages while it's in flight.
  const analyze = () => {
    if (!url.trim() || status === "processing") return;

    setStatus("processing");
    setActiveStage(0);
    setErrorMessage("");
    setShowOutageBanner(false);

    const iv = setInterval(() => {
      setActiveStage((i) => (i < 4 ? i + 1 : i));
    }, 900);

    checkVideo(url.trim())
      .then(({ stats, claims, verifiedCount, providersExhausted }) => {
        clearInterval(iv);

        // Total outage — nothing verified, show the full-screen notice.
        if (providersExhausted && verifiedCount === 0) {
          setStatus("quota");
          return;
        }

        // Partial outage — show real results plus a dismissible banner.
        setShowOutageBanner(providersExhausted);
        setStats(stats);
        setClaims(claims);
        setStatus("done");
      })
      .catch((err) => {
        clearInterval(iv);
        if (err.quota) {
          setStatus("quota");
        } else {
          setErrorMessage(err.message || "Something went wrong. Please try again.");
          setStatus("error");
        }
      });
  };

  const filtered = useMemo(
    () =>
      claims
        .filter((c) => (filter === "all" ? true : c.verdict === filter))
        .filter((c) => c.text.toLowerCase().includes(query.toLowerCase())),
    [claims, filter, query]
  );

  // Share of verified claims that came back true or partially-true.
  const reliability = useMemo(() => {
    if (claims.length === 0) return 0;
    const positive = claims.filter((c) => c.verdict === "true" || c.verdict === "partial").length;
    return positive / claims.length;
  }, [claims]);

  return (
    <div className="mx-auto max-w-3xl px-5 py-14 sm:px-8">
      <Reveal className="text-center">
        <h1 className="font-serif text-[30px] font-semibold sm:text-[36px]">Paste a YouTube URL</h1>
        <p className="mt-2 text-[14.5px] text-muted">
          FactLens will extract, classify, and verify every factual claim.
        </p>
      </Reveal>

      <Reveal delay={100} className="mx-auto mt-8 flex max-w-xl flex-col gap-3 sm:flex-row">
        <div className="flex flex-1 items-center gap-2.5 rounded-xl border border-line bg-surface px-4 py-3.5 opacity-60">
          <Youtube size={17} className="shrink-0 text-teal" />
          <input
            value={url}
            onChange={(e) => setUrl(e.target.value)}
            placeholder={LIVE_DEMO_ENABLED ? "Paste YouTube URL" : "Live demo unavailable — see below"}
            disabled={!LIVE_DEMO_ENABLED}
            className="fl-focus w-full cursor-not-allowed bg-transparent font-mono text-[13.5px] outline-none"
          />
        </div>
        <PrimaryButton
          onClick={LIVE_DEMO_ENABLED ? analyze : () => {}}
          icon={ChevronRight}
          className={`justify-center ${LIVE_DEMO_ENABLED ? "" : "cursor-not-allowed opacity-50"}`}
        >
          Analyze
        </PrimaryButton>
      </Reveal>

      {!LIVE_DEMO_ENABLED && <OfflineNotice />}

      <Reveal delay={160} className="mx-auto mt-3 max-w-xl text-center text-[12px] leading-relaxed text-muted">
        Works with YouTube Shorts (fastest) and longer videos up to about 10–15 minutes for now —
        anything beyond that isn't supported yet. English-language videos only at the moment.
      </Reveal>

      {LIVE_DEMO_ENABLED && status === "processing" && (
        <div className="mx-auto mt-10 max-w-md">
          <ProcessingPipeline activeIndex={activeStage} />
        </div>
      )}

      {status === "error" && (
        <div className="mx-auto mt-10 max-w-md text-center">
          <p className="text-[13.5px] text-coral">{errorMessage}</p>
          <button
            onClick={() => setStatus("idle")}
            className="fl-focus mt-3 font-mono text-[13px] font-medium text-teal"
          >
            Try again
          </button>
        </div>
      )}

      {status === "quota" && (
        <div className="mx-auto mt-10 max-w-md">
          <QuotaNotice onDismiss={() => setStatus("idle")} />
        </div>
      )}

      {status === "done" && (
        <>
          {showOutageBanner && (
            <PartialOutageBanner onDismiss={() => setShowOutageBanner(false)} />
          )}

          <div className="mt-12 grid grid-cols-2 gap-3 sm:grid-cols-5">
            {stats.map(([label, value], i) => (
              <StatCard key={label} label={label} value={value} delay={i * 70} />
            ))}
          </div>

          <Reveal
            delay={200}
            className="lift mt-6 flex flex-col items-center gap-4 rounded-2xl border border-line p-6 sm:flex-row sm:justify-between"
          >
            <div>
              <div className="font-mono text-[10.5px] uppercase tracking-wide text-muted">
                Overall reliability
              </div>
              <p className="mt-1 max-w-xs text-[12.5px] text-muted">
                Calculated from verified claims. Not AI-generated.
              </p>
            </div>
            <RingGauge value={reliability} size={92} stroke={8} color={T.teal} labelSize={19} />
          </Reveal>

          <div className="mt-10 flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
            <div className="flex flex-wrap gap-2">
              {["all", "true", "false", "partial", "unverifiable"].map((f) => (
                <button
                  key={f}
                  onClick={() => setFilter(f)}
                  className={`fl-focus rounded-full border px-3 py-1.5 font-mono text-[11px] uppercase tracking-wide transition-colors ${
                    filter === f ? "border-teal text-teal" : "border-line text-muted"
                  }`}
                >
                  {f}
                </button>
              ))}
            </div>
            <div className="flex items-center gap-2 rounded-xl border border-line bg-surface px-3 py-2 sm:w-56">
              <Search size={14} className="text-muted" />
              <input
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                placeholder="Search claims"
                className="fl-focus w-full bg-transparent text-[13px] outline-none"
              />
            </div>
          </div>

          <div className="mt-5 flex flex-col gap-4">
            {filtered.map((c, i) => (
              <ClaimCard key={c.id} claim={c} delay={i * 70} />
            ))}
            {filtered.length === 0 && (
              <p className="text-center text-[13.5px] text-muted">No claims match this search.</p>
            )}
          </div>

          <div className="mt-8 flex flex-col items-center gap-2.5">
            <GhostButton
              icon={reportNoticeVisible ? Clock : FileOutput}
              onClick={() => {
                setReportNoticeVisible(true);
                setTimeout(() => setReportNoticeVisible(false), 3200);
              }}
            >
              Generate Report
            </GhostButton>
            {reportNoticeVisible && (
              <Reveal className="font-mono text-[11.5px] text-muted">
                Stay tuned — report export is coming in an updated version.
              </Reveal>
            )}
          </div>
        </>
      )}
    </div>
  );
}
