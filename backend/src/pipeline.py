import json

from src.segmenter import get_video_sentences
from src.model_loader import load_claim_classifier
from src.triage import classify_sentences

from src.fact_checker import (
    verify_claims,
    reset_providers,
    providers_exhausted,
)

from src.providers.provider_manager import ProviderManager
from src.config import BATCH_SIZE


def process_claims(claims, stage_label="Claims"):

    verified = []

    total_batches = (
        len(claims) + BATCH_SIZE - 1
    ) // BATCH_SIZE

    exhausted_notice_printed = False

    for i in range(0, len(claims), BATCH_SIZE):

        batch = claims[i:i + BATCH_SIZE]

        batch_sentences = [
            item["sentence"]
            for item in batch
        ]

        
        if providers_exhausted():

            if not exhausted_notice_printed:
                remaining = total_batches - (i // BATCH_SIZE)
                print(
                    f"\nSkipping remaining {remaining} {stage_label} "
                    f"batch(es) — all AI providers are exhausted for "
                    f"this video. Marking as UNVERIFIABLE with no "
                    f"further provider calls."
                )
                exhausted_notice_printed = True

            for original in batch:
                verified.append({
                    "sentence": original["sentence"],
                    "model_score": original["score"],
                    "fact_check": ProviderManager._unverifiable_result(
                        original["sentence"],
                        "all configured AI providers were unavailable",
                    ),
                })

            continue

        print(
            f"\nFact-checking {stage_label} batch "
            f"{i // BATCH_SIZE + 1}/{total_batches} "
            f"({len(batch_sentences)} claims)"
        )

        result = verify_claims(batch_sentences)

        
        responses = result.get("results") or []

        for original, llm_result in zip(batch, responses):

            verified.append({
                "sentence": original["sentence"],
                "model_score": original["score"],
                "fact_check": llm_result
            })

        
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

        
        "providers_exhausted": providers_exhausted(),

    }

    return report


if __name__ == "__main__":

    test_id = "Ks-_Mh1QhMc"

    result = run_pipeline(test_id)

    print("\n=== FINAL REPORT ===")

    print(json.dumps(result, indent=4))