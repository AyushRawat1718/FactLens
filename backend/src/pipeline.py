# src/pipeline.py

import json

from src.segmenter import get_video_sentences
from src.model_loader import load_claim_classifier
from src.triage import classify_sentences
from src.fact_checker import verify_claims
from src.config import BATCH_SIZE


def process_claims(claims):
    """
    Processes claims in batches using the AI providers.
    Returns the verified claim list while preserving the original report format.
    """

    verified = []

    for i in range(0, len(claims), BATCH_SIZE):

        batch = claims[i:i + BATCH_SIZE]

        batch_sentences = [item["sentence"] for item in batch]

        print(
            f"\nFact-checking batch {i // BATCH_SIZE + 1} "
            f"({len(batch_sentences)} claims)"
        )

        result = verify_claims(batch_sentences)

        if result["success"]:

            responses = result["results"]

            for original, llm_result in zip(batch, responses):

                verified.append({
                    "sentence": original["sentence"],
                    "model_score": original["score"],
                    "fact_check": llm_result
                })

        else:

            # If both providers fail, keep the error for every claim
            for original in batch:

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
    # 4. Verify claims
    # -----------------------------------
    factual_checked = process_claims(trusted)

    disputed_checked = process_claims(disputed)

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

        "disputed_claims_verified": disputed_checked

    }

    return report


if __name__ == "__main__":

    test_id = "Ks-_Mh1QhMc"

    result = run_pipeline(test_id)

    print("\n=== FINAL REPORT ===")

    print(json.dumps(result, indent=4))