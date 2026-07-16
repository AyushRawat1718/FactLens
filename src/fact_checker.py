# src/fact_checker.py

from src.providers.provider_manager import ProviderManager

provider = ProviderManager()


def verify_claims(claims: list[str]):
    """
    Verify a batch of claims using the configured AI providers.
    """
    return provider.verify_claims(claims)