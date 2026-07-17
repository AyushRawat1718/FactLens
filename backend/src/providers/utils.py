# src/providers/utils.py

import json
import re


def extract_json(text: str) -> dict | list | None:
    """
    Extracts the first valid JSON object or array from an LLM response.

    Handles responses like:

    ```json
    {...}
    ```

    or

    Sure! Here's the result:

    {
        ...
    }

    Returns:
        dict | list | None
    """

    if not text:
        return None

    # Remove markdown code fences if present
    text = re.sub(r"```(?:json)?", "", text)
    text = text.replace("```", "").strip()

    # Try direct parsing first
    try:
        return json.loads(text)
    except json.JSONDecodeError:
        pass

    # Search for JSON object
    match = re.search(r"\{.*\}", text, re.DOTALL)

    if match:
        try:
            return json.loads(match.group())
        except json.JSONDecodeError:
            pass

    # Search for JSON array
    match = re.search(r"\[.*\]", text, re.DOTALL)

    if match:
        try:
            return json.loads(match.group())
        except json.JSONDecodeError:
            pass

    return None


def extract_json_array(text: str) -> list | None:
    """
    Same as extract_json, but specifically for responses that are expected
    to be a JSON array (batch verification responses). Tries the array
    pattern FIRST so a stray/partial object inside the array text can't be
    matched instead of the whole array.

    Returns:
        list | None
    """

    if not text:
        return None

    cleaned = re.sub(r"```(?:json)?", "", text)
    cleaned = cleaned.replace("```", "").strip()

    try:
        parsed = json.loads(cleaned)
        if isinstance(parsed, list):
            return parsed
        # Model returned a single object instead of an array — wrap it.
        if isinstance(parsed, dict):
            return [parsed]
    except json.JSONDecodeError:
        pass

    match = re.search(r"\[.*\]", cleaned, re.DOTALL)

    if match:
        try:
            parsed = json.loads(match.group())
            if isinstance(parsed, list):
                return parsed
        except json.JSONDecodeError:
            pass

    # Fall back to the general extractor as a last resort.
    parsed = extract_json(text)

    if isinstance(parsed, list):
        return parsed

    if isinstance(parsed, dict):
        return [parsed]

    return None

def reconcile_batch_results(claims: list[str], raw_results) -> list[dict]:
    """
    Matches the model's raw batch results back to `claims`, in order.

    The model is asked to tag each result with "claim_index", but LLMs
    occasionally drop it, reorder things, or return the wrong count — this
    makes sure the caller always gets back exactly len(claims) results in
    the right order, regardless of what the model actually returned.

    Matching strategy, per result item:
      1. Use "claim_index" if present and in range.
      2. Otherwise, try matching by exact claim text.
      3. If NEITHER index nor text-matching found anything for the whole
         batch, but the counts line up, fall back to positional order.
      4. Any claim still unmatched gets a safe UNVERIFIABLE placeholder
         instead of crashing or silently dropping it from the report.
    """

    reconciled: list = [None] * len(claims)

    if isinstance(raw_results, list):

        for item in raw_results:

            if not isinstance(item, dict):
                continue

            idx = item.get("claim_index")

            if isinstance(idx, int) and 0 <= idx < len(claims) and reconciled[idx] is None:
                reconciled[idx] = item
                continue

            claim_text = str(item.get("claim") or "").strip()

            if claim_text:
                for i, c in enumerate(claims):
                    if reconciled[i] is None and claim_text == c.strip():
                        reconciled[i] = item
                        break

        # Nothing matched by index or text, but the count lines up exactly
        # — most likely the model returned them in the original order and
        # simply omitted "claim_index". Fall back to positional matching.
        if all(r is None for r in reconciled) and len(raw_results) == len(claims):
            reconciled = list(raw_results)

    for i, claim in enumerate(claims):
        if not isinstance(reconciled[i], dict):
            reconciled[i] = {
                "claim": claim,
                "verdict": "UNVERIFIABLE",
                "confidence": 0,
                "reasoning": (
                    "FactLens could not match a model result to this "
                    "claim in the batch response."
                ),
                "sources": [],
            }

    return reconciled
