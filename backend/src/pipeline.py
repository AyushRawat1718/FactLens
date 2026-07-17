import json

from src.segmenter import get_video_sentences
from src.model_loader import load_claim_classifier
from src.triage import classify_sentences

from src.fact_checker import (
    verify_claims,
    reset_providers,
    providers_exhausted,
)

from src.config import BATCH_SIZE


def process_claims(claims, stage_label="Claims"):
    """
    Processes claims in batches using the AI providers.
    Returns the verified claim list while preserving the original report format.

    `stage_label` is printed with each batch (e.g. "Factual", "Disputed").
    process_claims() is called once per claim type, so each call has its
    own independent 1..N batch counter — without a label, two calls in a
    row (e.g. "batch 1/7" then "batch 1/5") look like the counter reset
    or a bug, when it's actually just the next stage starting.
    """

    verified = []

    total_batches = (
        len(claims) + BATCH_SIZE - 1
    ) // BATCH_SIZE

    for i in range(0, len(claims), BATCH_SIZE):

        batch = claims[i:i + BATCH_SIZE]

        batch_sentences = [
            item["sentence"]
            for item in batch
        ]

        print(
            f"\nFact-checking {stage_label} batch "
            f"{i // BATCH_SIZE + 1}/{total_batches} "
            f"({len(batch_sentences)} claims)"
        )

        result = verify_claims(batch_sentences)

        # ProviderManager now always returns exactly one well-formed
        # result per claim in `results` — whether the batch succeeded,
        # partially succeeded, or every provider failed (in which case
        # each entry is a proper UNVERIFIABLE placeholder, not a generic
        # error blob). So we can always zip against it directly instead
        # of branching on `result["success"]` and falling back to
        # attaching the raw manager response as fact_check.
        responses = result.get("results") or []

        for original, llm_result in zip(batch, responses):

            verified.append({
                "sentence": original["sentence"],
                "model_score": original["score"],
                "fact_check": llm_result
            })

        # Extremely defensive fallback: only hit if a provider response
        # was somehow missing `results` entirely (shouldn't happen).
        if len(responses) < len(batch):

            for original in batch[len(responses):]:

                verified.append({
                    "sentence": original["sentence"],
                    "model_score": original["score"],
                    "fact_check": result
                })

    return verified


def run_pipeline(video_id: str):

    print(f"\n=== FACT CHECKING VIDEO: {video_id} ===\n")

    # -----------------------------------
    # 1. Load claim classifier
    # -----------------------------------

    classifier = load_claim_classifier()

    # -----------------------------------
    # 2. Extract transcript
    # -----------------------------------

    sentences = get_video_sentences(video_id)

    print(f"Extracted {len(sentences)} sentences")

    # -----------------------------------
    # 3. Claim classification
    # -----------------------------------

    triage_result = classify_sentences(
        sentences,
        classifier
    )

    trusted = triage_result["trusted"]
    disputed = triage_result["disputed"]
    ignored = triage_result["ignored"]

    print(
        f"\nTrusted: {len(trusted)} | "
        f"Disputed: {len(disputed)} | "
        f"Ignored: {ignored}\n"
    )

    # -----------------------------------
    # Reset providers ONCE for this video
    # -----------------------------------

    reset_providers()

    # -----------------------------------
    # 4. Verify claims
    # -----------------------------------

    factual_checked = process_claims(trusted, stage_label="Factual")

    disputed_checked = process_claims(disputed, stage_label="Disputed")

    # -----------------------------------
    # 5. Final report
    # -----------------------------------

    report = {

        "video_id": video_id,

        "total_sentences": len(sentences),

        "counts": {

            "factual_claims": len(trusted),

            "disputed_claims": len(disputed),

            "ignored": ignored

        },

        "factual_claims_verified": factual_checked,

        "disputed_claims_verified": disputed_checked,

        # True once every configured AI provider has been disabled for
        # this video (see ProviderManager.all_exhausted / reset each new
        # video). Lets the frontend distinguish "genuinely nothing could
        # be verified because both providers are down" from "these
        # specific claims happened to come back UNVERIFIABLE" — the two
        # look identical per-claim otherwise.
        "providers_exhausted": providers_exhausted(),

    }

    return report


if __name__ == "__main__":

    test_id = "Ks-_Mh1QhMc"

    result = run_pipeline(test_id)

    print("\n=== FINAL REPORT ===")

    print(json.dumps(result, indent=4))