// Talks to the FastAPI backend (see backend/src/app.py).
// Base URL comes from VITE_API_URL — see .env.example.

const API_URL = import.meta.env.VITE_API_URL || "http://localhost:8000";

// Backend verdicts ("TRUE" / "FALSE" / "PARTIALLY TRUE" / "UNVERIFIABLE")
// -> the lowercase keys ClaimCard/VERDICTS expects.
function normalizeVerdict(verdict) {
  const v = (verdict || "").toUpperCase();
  if (v === "TRUE") return "true";
  if (v === "FALSE") return "false";
  if (v.startsWith("PARTIAL")) return "partial";
  return "unverifiable";
}

// One verified item from the backend looks like:
//   { sentence, model_score, fact_check: { claim, verdict, confidence, reasoning, sources } }
// (or fact_check is an error object if both AI providers failed on that batch)
function toClaimCard(item, index) {
  const fc = item.fact_check || {};
  const hasVerdict = typeof fc.verdict === "string";

  return {
    id: `c${index}`,
    verdict: hasVerdict ? normalizeVerdict(fc.verdict) : "unverifiable",
    confidence: typeof fc.confidence === "number" ? fc.confidence : item.model_score ?? 0,
    text: fc.claim || item.sentence,
    reasoning: fc.reasoning || fc.message || "No explanation returned for this claim.",
    sources: Array.isArray(fc.sources)
      ? fc.sources
          .filter((s) => s && (s.title || s.url))
          .map((s) => ({
            label: s.title || s.description || "Source",
            url: s.url || null,
            description: s.description || null,
          }))
      : [],
  };
}

// Transforms the raw /check response into { stats, claims } for the Dashboard UI.
export function transformReport(report) {
  const verified = [
    ...(report.factual_claims_verified || []),
    ...(report.disputed_claims_verified || []),
  ];

  const claims = verified.map(toClaimCard);

  const confidences = claims.map((c) => c.confidence).filter((n) => typeof n === "number");
  const avgConfidence = confidences.length
    ? Math.round((confidences.reduce((a, b) => a + b, 0) / confidences.length) * 100)
    : 0;

  const counts = report.counts || {};
  const verifiedCount = claims.filter((c) => c.verdict !== "unverifiable").length;

  const stats = [
    ["Total Sentences", String(report.total_sentences ?? 0)],
    ["Claims Detected", String(claims.length)],
    ["Verified", String(verifiedCount)],
    ["Ignored", String(counts.ignored ?? 0)],
    ["Avg. Confidence", `${avgConfidence}%`],
  ];

  return {
    stats,
    claims,
    verifiedCount,
    // True once every AI provider was disabled server-side for this video.
    // Dashboard.jsx uses it to pick full-screen notice vs. dismissible banner.
    providersExhausted: report.providers_exhausted === true,
  };
}

// POSTs a YouTube URL to the backend and returns the parsed, UI-ready result.
// Throws an Error with `.quota = true` when the AI providers are out of capacity.
export async function checkVideo(url) {
  let res;

  try {
    res = await fetch(`${API_URL}/check`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ url }),
    });
  } catch (err) {
    throw new Error("Could not reach the FactLens backend. Is it running?");
  }

  if (!res.ok) {
    let detail;
    try {
      detail = (await res.json()).detail;
    } catch {
      // ignore - fall through to generic error below
    }

    if (detail?.code === "AI_QUOTA_EXCEEDED") {
      const err = new Error(detail.message);
      err.quota = true;
      throw err;
    }

    throw new Error(detail?.message || `Request failed (${res.status})`);
  }

  const data = await res.json();
  return transformReport(data.report);
}
