// Design tokens — single source of truth for colors used in SVG
// strokes/fills and dynamic per-verdict styling that can't be expressed
// as static Tailwind classes. For backgrounds/text/borders elsewhere,
// prefer the Tailwind classes in tailwind.config.js (bg-teal, text-muted,
// border-line, etc) — keeps styling greppable and purge-safe.
export const T = {
  ink: "#0B0E14",
  surface: "#12161F",
  surface2: "#171C27",
  border: "#1E2430",
  text: "#F3F1EA",
  muted: "#8B93A3",
  teal: "#4FD1C5",
  coral: "#E0645A",
  amber: "#E3A23C",
  slate: "#6C8CB0",
  grey: "#4A5162",
};
