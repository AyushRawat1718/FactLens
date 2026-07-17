import concurrent.futures

from src.providers.groq import GroqProvider
from src.providers.openrouter import OpenRouterProvider

from src.retrieval.tavily import TavilyRetriever
from src.retrieval.models import EvidenceBundle


class ProviderManager:

    def __init__(self):

        self.retriever = TavilyRetriever()

        self.providers = [
            GroqProvider(),
            OpenRouterProvider(),
        ]

        # Providers available for the current video request
        self.available_providers = self.providers.copy()

        # Makes sure the "providers exhausted" message is printed once per
        # video instead of repeating (ambiguously) for every remaining batch.
        self._exhausted_logged = False

    def reset_providers(self):
        """
        Reset available providers before processing a new video.
        """
        self.available_providers = self.providers.copy()
        self._exhausted_logged = False

    def all_exhausted(self) -> bool:
        """
        True once every provider has been disabled for the current video.
        """
        return not self.available_providers

    # -----------------------------------------------------------
    # Evidence retrieval — one Tavily search per claim, but all
    # searches in the batch run concurrently instead of one after
    # another, since they're independent network calls.
    # -----------------------------------------------------------
    def _gather_evidence(self, claims: list[str]) -> list[EvidenceBundle]:

        evidence_bundles: list = [None] * len(claims)

        max_workers = min(len(claims), 5) or 1

        with concurrent.futures.ThreadPoolExecutor(max_workers=max_workers) as pool:

            future_to_index = {
                pool.submit(self.retriever.search, claim): i
                for i, claim in enumerate(claims)
            }

            for future in concurrent.futures.as_completed(future_to_index):

                i = future_to_index[future]

                try:
                    evidence_bundles[i] = future.result()

                except Exception as e:
                    print(f"⚠️  Evidence retrieval failed for claim {i + 1}: {e}")
                    evidence_bundles[i] = EvidenceBundle(claim=claims[i], evidence=[])

        return evidence_bundles

    # -----------------------------------------------------------
    # Verifies an ENTIRE batch of claims with a single LLM request
    # per provider attempt (real batching — this used to make one
    # LLM call PER CLAIM, so a batch of 5 meant 5 provider calls;
    # now it's exactly 1 call per provider per batch).
    # -----------------------------------------------------------
    def verify_claims(self, claims: list[str]) -> dict:

        if not claims:
            return {"success": True, "provider": "manager", "results": []}

        if not self.available_providers:
            self._log_exhausted_once()

            return {
                "success": False,
                "provider": "manager",
                "results": [
                    self._unverifiable_result(c, "no AI providers are available")
                    for c in claims
                ],
            }

        evidence_bundles = self._gather_evidence(claims)

        while self.available_providers:

            provider = self.available_providers[0]
            name = provider.__class__.__name__

            result = None

            # One retry on a transient (non-disabling) failure — e.g. the
            # model returned malformed JSON once. Quota/auth failures are
            # NOT retried here; those set disable_provider=True and are
            # handled below by moving on to the next provider entirely.
            for attempt in range(2):

                suffix = " (retry)" if attempt == 1 else ""

                print(
                    f"\nUsing Provider: {name}{suffix} "
                    f"— verifying {len(claims)} claim(s) in ONE request"
                )

                result = provider.verify_batch(claims, evidence_bundles)

                if result["success"]:
                    break

                # Always surface WHY this attempt failed — this used to
                # only print when disable_provider was False, which
                # silently swallowed the reason in exactly the case you
                # most need to see it (a provider getting disabled for
                # the rest of the video). That's why the old logs jumped
                # straight from "Using Provider: X" to "X is unavailable"
                # with no explanation in between.
                print(f"{name} failed for this batch.")
                print(f"Reason: {result['error']['message']}")

                if result.get("disable_provider", False):
                    break

            if result["success"]:

                results = result["results"]

                # Tag each claim's result with which provider actually
                # produced it — small, cheap addition that makes reports
                # and logs clearer without changing the report's shape.
                for r in results:
                    if isinstance(r, dict):
                        r.setdefault("provider", result.get("provider", name))

                return {
                    "success": True,
                    "provider": result.get("provider", name),
                    "results": results,
                }

            if result.get("disable_provider", False):

                print(
                    f"{name} is unavailable for the rest of this video "
                    f"(reason: {result['error']['message']})."
                )

                self.available_providers.pop(0)

                if self.available_providers:
                    print(
                        f"Switching to "
                        f"{self.available_providers[0].__class__.__name__}"
                    )

                continue

            # Provider is healthy but this batch's request failed twice —
            # stop retrying it now (avoid hammering it) and let the NEXT
            # batch try it again fresh. This batch is marked UNVERIFIABLE.
            break

        # Either every provider was disabled, or the last healthy provider
        # gave up on this batch — either way, nothing verified this batch.
        self._log_exhausted_once()

        return {
            "success": False,
            "provider": "manager",
            "results": [
                self._unverifiable_result(
                    c, "all configured AI providers were unavailable"
                )
                for c in claims
            ],
        }

    def _log_exhausted_once(self):
        """
        Prints ONE clear message when there are no providers left to try,
        instead of the ambiguous silent/repeated output this used to
        produce once every provider had failed.
        """

        if not self.available_providers and not self._exhausted_logged:

            print(
                "\n⚠️  ALL AI PROVIDERS EXHAUSTED FOR THIS VIDEO — "
                "every remaining claim will be marked UNVERIFIABLE. "
                "Provider availability resets on the next video.\n"
            )

            self._exhausted_logged = True

    @staticmethod
    def _unverifiable_result(claim: str, reason: str) -> dict:
        return {
            "claim": claim,
            "verdict": "UNVERIFIABLE",
            "confidence": 0,
            "reasoning": f"FactLens could not verify this claim because {reason}.",
            "sources": [],
            "provider": None,
        }
