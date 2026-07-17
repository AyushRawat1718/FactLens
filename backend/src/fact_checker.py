from src.providers.provider_manager import ProviderManager

provider = ProviderManager()


def reset_providers():
    """
    Reset provider availability before
    processing a new video.
    """
    provider.reset_providers()


def providers_exhausted() -> bool:
    """
    True if every configured AI provider has been disabled for the
    current video (both Groq and OpenRouter failed with a disabling
    error — quota, auth, or a retired/paid-only model).
    """
    return provider.all_exhausted()


def verify_claims(claims: list[str]):
    """
    Verify a batch of claims using the configured AI providers.
    """
    return provider.verify_claims(claims)