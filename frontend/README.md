# FactLens

AI-powered YouTube fact verification UI — landing page + dashboard.
Built with React, Vite, Tailwind CSS, Framer Motion, react-router-dom, lucide-react.

## Run it

    npm install
    npm run dev

Build for production:

    npm run build      # outputs to dist/
    npm run preview     # preview the production build locally

## Structure

    src/
      lib/tokens.js         design tokens (colors) used in SVG/dynamic styles
      data/claims.js         mock claim data + verdict styling — swap for real API data
      components/
        ui/                  Reveal, CharReveal, LensMark, RingGauge, Buttons — primitives
        ClaimCard.jsx         verdict badge + claim card, used on landing + dashboard
        Navbar.jsx, Footer.jsx
      sections/               each landing-page section as its own file
      pages/
        Landing.jsx           composes all sections
        Dashboard.jsx         the "Try Now" app — calls the backend via lib/api.js

## Connecting your FastAPI backend

Already wired. `src/lib/api.js` calls `POST {VITE_API_URL}/check` (the
backend's real endpoint — see `backend/src/app.py`) and maps its response
into the `{ verdict, confidence, text, reasoning, sources }` shape
`ClaimCard.jsx` expects. `Dashboard.jsx`'s `analyze()` calls it and
animates the pipeline stages while the request is in flight, since the
backend responds once, in full, rather than streaming per-stage progress.

If Gemini and Groq both fail server-side, the backend returns 503 with
`{ code: "AI_QUOTA_EXCEEDED" }`; `api.js` turns that into an error with
`.quota = true`, which is what triggers `setStatus("quota")`.

Add a `.env` file (see `.env.example`) with:

    VITE_API_URL=http://localhost:8000   # or your deployed backend URL

## Design tokens

Colors, fonts, and custom keyframes live in `tailwind.config.js` and
`src/lib/tokens.js`. The palette:

| token | hex | use |
|---|---|---|
| ink | #0B0E14 | base background |
| surface | #12161F | card surface |
| surface2 | #171C27 | raised surface (nav, browser-chrome mockups) |
| line | #1E2430 | borders |
| cream | #F3F1EA | primary text |
| muted | #8B93A3 | secondary text |
| teal | #4FD1C5 | brand + "true" verdict |
| coral | #E0645A | "false" verdict |
| amber | #E3A23C | "partial / disputed" verdict |
| slate | #6C8CB0 | "unverifiable" verdict |

Fonts: Fraunces (display/serif headlines), Inter (body), JetBrains Mono
(scores, tags, data).

## Notes

- Routing uses `HashRouter` so the build works on any static host without
  extra rewrite rules. Switch to `BrowserRouter` if your host supports
  SPA fallback routing (Vercel/Netlify: add a redirect rule; nginx: add
  `try_files ... /index.html`).
- `Download HTML` / `Download PDF` buttons in the dashboard are still
  UI-only — wire them to a blob download / the backend's report export
  (`POST /check` with `save_report: true` saves an HTML report server-side)
  if you want them functional.
- `src/data/claims.js` now only exports `VERDICTS` (styling map); the mock
  `CLAIMS_DATA` it used to export isn't used anymore now that the
  dashboard pulls real data from the backend via `src/lib/api.js`.
