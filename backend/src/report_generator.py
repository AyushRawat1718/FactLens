# src/report_generator.py

import os
import re
import json
from typing import Dict
from datetime import datetime


# ---------------------------------------
# SAFELY SANITIZE FILENAMES FOR WINDOWS
# ---------------------------------------
def make_safe_filename(name: str) -> str:
    """
    Removes illegal characters from filenames.
    Supports YouTube URLs, paths, and arbitrary strings.
    """
    name = name.strip()

    # Replace URL-specific chars
    name = name.replace("https://", "").replace("http://", "")

    # Replace all illegal Windows filesystem characters
    name = re.sub(r'[\\/:*?"<>|]+', "_", name)

    # Limit filename length
    if len(name) > 200:
        name = name[:200]

    return name


def _verdict_class(verdict: str) -> str:
    verdict = (verdict or "").upper()
    if verdict == "TRUE":
        return "true"
    if verdict == "FALSE":
        return "false"
    if "PARTIAL" in verdict:
        return "partial"
    return "unv"


def _render_claim_card(item: Dict) -> str:
    """
    Renders one verified claim as an HTML card.

    NOTE: `fact_check` now comes from ProviderManager / the LLM providers
    in this shape (see providers/prompts.py and providers/utils.py):
        { claim, verdict, confidence, reasoning, sources: [{title,description,url}] }
    This used to read `explanation` and `evidence` (with `source`/
    `description` keys) — those fields no longer exist on the response,
    so every report rendered blank Explanation/Evidence sections. Fixed
    below to match the real schema.
    """

    fc = item.get("fact_check") or {}
    verdict = fc.get("verdict", "UNVERIFIABLE")
    css = _verdict_class(verdict)

    confidence = fc.get("confidence")
    confidence_html = (
        f"<p><strong>Confidence:</strong> {round(confidence * 100)}%</p>"
        if isinstance(confidence, (int, float))
        else ""
    )

    reasoning = fc.get("reasoning") or "No reasoning provided."

    sources = fc.get("sources") or []
    if sources:
        source_items = "".join(
            f"""<li>
                <strong>{src.get('title') or 'Source'}</strong>
                {f" — {src.get('description')}" if src.get('description') else ""}
                {f'<br/><a href="{src.get("url")}" target="_blank" rel="noreferrer">{src.get("url")}</a>' if src.get('url') else ""}
            </li>"""
            for src in sources
            if isinstance(src, dict)
        )
        sources_html = f"<p><strong>Sources:</strong></p><ul>{source_items}</ul>"
    else:
        sources_html = "<p class=\"muted\"><em>No sources returned for this claim.</em></p>"

    provider = fc.get("provider")
    provider_html = f'<span class="pill">{provider}</span>' if provider else ""

    return f"""
    <div class="card {css}">
      <div class="card-head">
        <span class="badge {css}">{verdict}</span>
        {provider_html}
      </div>
      <p class="sentence">{item.get('sentence')}</p>
      {confidence_html}
      <p><strong>Reasoning:</strong> {reasoning}</p>
      {sources_html}
    </div>
    """


# ---------------------------------------
# HTML RENDERING
# ---------------------------------------
def render_html_report(report: Dict) -> str:
    """
    Returns HTML string of the report.
    """

    video_id = report.get("video_id", "unknown")
    total = report.get("total_sentences", 0)
    counts = report.get("counts", {})
    factual = report.get("factual_claims_verified", [])
    disputed = report.get("disputed_claims_verified", [])

    html = f"""
    <html>
    <head>
      <meta charset="utf-8"/>
      <title>FactLens Report — {video_id}</title>
      <style>
        :root {{
          --ink: #0B0E14; --surface: #12161F; --border: #1E2430;
          --text: #F3F1EA; --muted: #8B93A3;
          --teal: #4FD1C5; --coral: #E0645A; --amber: #E3A23C; --slate: #6C8CB0;
        }}
        * {{ box-sizing: border-box; }}
        body {{
          font-family: -apple-system, "Segoe UI", Inter, Arial, sans-serif;
          background: var(--ink); color: var(--text);
          margin: 0; padding: 32px; line-height: 1.55;
        }}
        h1 {{ font-size: 26px; margin-bottom: 4px; }}
        h2 {{ font-size: 18px; margin-top: 32px; border-bottom: 1px solid var(--border); padding-bottom: 8px; }}
        .meta {{ color: var(--muted); font-size: 13px; margin-bottom: 24px; }}
        .summary {{
          display: grid; grid-template-columns: repeat(4, 1fr); gap: 12px;
          margin-bottom: 24px;
        }}
        .stat {{
          background: var(--surface); border: 1px solid var(--border);
          border-radius: 12px; padding: 14px;
        }}
        .stat .n {{ font-size: 22px; font-weight: 700; }}
        .stat .l {{ font-size: 11px; color: var(--muted); text-transform: uppercase; letter-spacing: .03em; }}
        .card {{
          background: var(--surface); border: 1px solid var(--border);
          border-left-width: 4px; border-radius: 10px;
          padding: 16px; margin-bottom: 14px;
        }}
        .card.true {{ border-left-color: var(--teal); }}
        .card.false {{ border-left-color: var(--coral); }}
        .card.partial {{ border-left-color: var(--amber); }}
        .card.unv {{ border-left-color: var(--slate); }}
        .card-head {{ display: flex; align-items: center; gap: 8px; margin-bottom: 8px; }}
        .badge {{
          font-size: 11px; font-weight: 700; text-transform: uppercase;
          letter-spacing: .03em; padding: 3px 9px; border-radius: 999px;
          border: 1px solid var(--border);
        }}
        .badge.true {{ color: var(--teal); border-color: var(--teal); }}
        .badge.false {{ color: var(--coral); border-color: var(--coral); }}
        .badge.partial {{ color: var(--amber); border-color: var(--amber); }}
        .badge.unv {{ color: var(--slate); border-color: var(--slate); }}
        .pill {{ font-size: 10.5px; color: var(--muted); border: 1px solid var(--border); border-radius: 999px; padding: 2px 8px; }}
        .sentence {{ font-size: 15px; margin: 0 0 8px; }}
        .muted {{ color: var(--muted); }}
        a {{ color: var(--teal); }}
        ul {{ margin: 4px 0 0; padding-left: 18px; }}
      </style>
    </head>
    <body>
      <h1>FactLens Report</h1>
      <div class="meta">{video_id}</div>

      <div class="summary">
        <div class="stat"><div class="n">{total}</div><div class="l">Sentences</div></div>
        <div class="stat"><div class="n">{counts.get('factual_claims', 0)}</div><div class="l">Factual claims</div></div>
        <div class="stat"><div class="n">{counts.get('disputed_claims', 0)}</div><div class="l">Disputed claims</div></div>
        <div class="stat"><div class="n">{counts.get('ignored', 0)}</div><div class="l">Ignored</div></div>
      </div>
    """

    html += "<h2>Factual claims (verified)</h2>\n"
    html += "".join(_render_claim_card(item) for item in factual) or "<p class='muted'>No factual claims found.</p>"

    html += "<h2>Disputed claims (verified)</h2>\n"
    html += "".join(_render_claim_card(item) for item in disputed) or "<p class='muted'>No disputed claims found.</p>"

    html += "</body></html>"
    return html


# -------------------------------------------------
# SAVE HTML FILE WITH SAFE FILENAME
# -------------------------------------------------
def save_html_report(report: Dict, out_path: str):
    safe_path = make_safe_filename(out_path)

    html = render_html_report(report)
    with open(safe_path, "w", encoding="utf-8") as f:
        f.write(html)

    return safe_path


# -------------------------------------------------
# SAVE PDF REPORT (optional)
# -------------------------------------------------
def save_pdf_report(report: Dict, out_path: str):
    try:
        import pdfkit
    except ImportError:
        raise RuntimeError(
            "pdfkit is not installed. Run: pip install pdfkit + install wkhtmltopdf system binary."
        )

    safe_path = make_safe_filename(out_path)

    tmp_html = safe_path + ".tmp.html"
    save_html_report(report, tmp_html)

    # PDF export
    pdfkit.from_file(tmp_html, safe_path)
    os.remove(tmp_html)

    return safe_path

