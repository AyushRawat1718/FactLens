from textwrap import dedent


def _format_evidence(evidence_bundle) -> str:
    """
    Renders one claim's retrieved evidence as plain text for the prompt.
    """

    if not evidence_bundle or not evidence_bundle.evidence:
        return "(No evidence was found for this claim.)"

    evidence_text = ""

    for idx, item in enumerate(evidence_bundle.evidence, start=1):

        content = (item.content or "").strip()

        if len(content) > 1000:
            content = content[:1000] + "..."

        evidence_text += f"""
  Source {idx}
  Title: {item.title}
  URL: {item.url}
  Content:
  {content}
"""

    return evidence_text


def build_batch_fact_check_prompt(claims: list[str], evidence_bundles: list) -> str:
    """
    Builds a SINGLE prompt that asks the model to verify every claim in the
    batch at once, so one batch = one LLM request instead of one per claim.

    Each claim is tagged with a "claim_index" (its position in `claims`,
    0-based) and the model is asked to echo that index back on every result
    so the response can be matched back to the right claim regardless of
    ordering.
    """

    claims_block = ""

    for i, (claim, bundle) in enumerate(zip(claims, evidence_bundles)):
        claims_block += f"""
---
Claim {i}:

{claim}

Retrieved Evidence for Claim {i}:
{_format_evidence(bundle)}
"""

    return dedent(f"""
You are FactLens, an AI fact-verification assistant.

You will verify MULTIPLE claims in a single pass. Each claim has its own
retrieved evidence below — use ONLY that claim's evidence to judge it, do
not mix evidence between claims.

IMPORTANT RULES

1. Use ONLY the evidence supplied for each specific claim.
2. Never invent facts.
3. Never fabricate sources.
4. If a claim's evidence is insufficient, return UNVERIFIABLE for it.
5. Keep each reasoning concise (2-4 sentences).
6. Return ONLY a valid JSON array — no prose before or after it.
7. Return exactly one result object per claim, in any order, each tagged
   with the correct "claim_index" so it can be matched back.

Verdicts:

- TRUE
- FALSE
- PARTIALLY TRUE
- UNVERIFIABLE

Claims and evidence:
{claims_block}

Return ONLY a JSON array in this exact shape:

[
  {{
    "claim_index": 0,
    "claim": "<the claim text>",
    "verdict": "TRUE | FALSE | PARTIALLY TRUE | UNVERIFIABLE",
    "confidence": 0.0,
    "reasoning": "",
    "sources": [
      {{
        "title": "",
        "description": "",
        "url": ""
      }}
    ]
  }}
]

The array must contain exactly {len(claims)} objects, one for each claim
above (claim_index 0 through {len(claims) - 1}).
""")


# Kept for reference / standalone single-claim use (e.g. quick scripts,
# manual testing) — the live pipeline now always calls the batch prompt
# above so a full batch is verified in one request.
def build_fact_check_prompt(claim: str, evidence_text: str) -> str:
    """
    Builds a prompt for verifying a single claim using retrieved evidence.
    """

    return dedent(f"""
You are FactLens, an AI fact-verification assistant.

Your task is to verify the supplied claim ONLY using the retrieved evidence.

IMPORTANT RULES

1. Use ONLY the supplied evidence.
2. Never invent facts.
3. Never fabricate sources.
4. If the evidence is insufficient, return UNVERIFIABLE.
5. Keep reasoning concise (2-4 sentences).
6. Return ONLY valid JSON.

Verdicts:

- TRUE
- FALSE
- PARTIALLY TRUE
- UNVERIFIABLE

Claim:

{claim}

Retrieved Evidence:

{evidence_text}

Return ONLY this JSON object:

{{
    "claim": "{claim}",
    "verdict": "TRUE | FALSE | PARTIALLY TRUE | UNVERIFIABLE",
    "confidence": 0.0,
    "reasoning": "",
    "sources": [
        {{
            "title": "",
            "description": "",
            "url": ""
        }}
    ]
}}
""")
