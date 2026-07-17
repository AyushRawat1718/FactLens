import { CheckCircle2, XCircle, AlertTriangle, HelpCircle } from "lucide-react";
import { T } from "../lib/tokens.js";

// Verdict styling map. Class strings are written literally so Tailwind's
// content scanner can find them even though they're accessed dynamically.
export const VERDICTS = {
  true: {
    label: "True",
    color: T.teal,
    Icon: CheckCircle2,
    badgeClass: "text-teal bg-teal/10 border-teal/40",
  },
  false: {
    label: "False",
    color: T.coral,
    Icon: XCircle,
    badgeClass: "text-coral bg-coral/10 border-coral/40",
  },
  partial: {
    label: "Partial",
    color: T.amber,
    Icon: AlertTriangle,
    badgeClass: "text-amber bg-amber/10 border-amber/40",
  },
  unverifiable: {
    label: "Unverifiable",
    color: T.slate,
    Icon: HelpCircle,
    badgeClass: "text-slate bg-slate/10 border-slate/40",
  },
};

// Mock claims — mirrors the shape your FastAPI /verify endpoint should
// return. Swap this out for a real fetch() in pages/Dashboard.jsx.
export const CLAIMS_DATA = [
  {
    id: "c1",
    verdict: "true",
    confidence: 0.94,
    text: "Welcome to the Global News podcast on YouTube, where we go behind the headlines of a story and tell you why it really matters.",
    reasoning:
      "Self-referential claim about the show's own format — matches the channel's published description and upload history.",
    sources: [{ label: "Channel about page" }, { label: "Upload metadata" }],
  },
  {
    id: "c2",
    verdict: "partial",
    confidence: 0.81,
    text: "One woman's detention in Shanghai has fueled a diplomatic row between Beijing and Delhi.",
    reasoning:
      "Wire reports confirm a detention and resulting friction, but outlets differ on the sequence of events and who escalated first.",
    sources: [{ label: "Wire coverage" }, { label: "Ministry statement" }],
  },
  {
    id: "c3",
    verdict: "partial",
    confidence: 0.88,
    text: "China disputes India's claim over the region and considers it its own territory, calling it South Tibet.",
    reasoning:
      "Both governments' official positions are documented and match this description, though the underlying claim is contested.",
    sources: [{ label: "Foreign ministry archive" }],
  },
  {
    id: "c4",
    verdict: "unverifiable",
    confidence: 0.62,
    text: "This is something India firmly rejects.",
    reasoning:
      "The rejection is on the public record, but no source ties a specific statement to this exact framing.",
    sources: [],
  },
  {
    id: "c5",
    verdict: "false",
    confidence: 0.9,
    text: "The region has had no prior history of border negotiations between the two countries.",
    reasoning:
      "Multiple bilateral talks and boundary-commission meetings are documented over the past three decades, contradicting this.",
    sources: [{ label: "Boundary commission records" }],
  },
];
