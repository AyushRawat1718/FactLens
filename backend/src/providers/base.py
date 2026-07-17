from abc import ABC, abstractmethod


class AIProvider(ABC):
    """
    Base interface for every AI provider.
    """

    @abstractmethod
    def verify_batch(self, claims: list[str], evidence_bundles: list) -> dict:
        """
        Verify an entire batch of claims in ONE request.

        Parameters
        ----------
        claims : list[str]
            Claims to verify, in order.

        evidence_bundles : list[EvidenceBundle]
            Evidence for each claim, same length and order as `claims`.

        Returns
        -------
        dict
            Standardized provider response:

            On success:
                {
                    "success": True,
                    "provider": "<name>",
                    "results": [ {...one result per claim, in `claims` order...} ]
                }

            On failure:
                {
                    "success": False,
                    "provider": "<name>",
                    "disable_provider": bool,
                    "error": {"code": "...", "message": "..."}
                }
        """
        raise NotImplementedError
