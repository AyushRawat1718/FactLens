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