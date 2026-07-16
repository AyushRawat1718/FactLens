from transformers import pipeline
from src.config import HF_MODEL_ID

# Global cached classifier instance
_classifier = None


class ClaimClassifier:
    def __init__(self, model_id=HF_MODEL_ID):

        print(f"Loading claim classifier from Hugging Face...")
        print(f"Model: {model_id}")

        self.model = pipeline(
            task="text-classification",
            model=model_id,
            tokenizer=model_id,
            device=-1,  # CPU (use 0 for GPU)
        )

        print("Claim classifier loaded successfully.")

    def predict(self, sentence: str):

        result = self.model(sentence)[0]

        raw_label = result["label"]
        score = result["score"]

        if raw_label.startswith("LABEL_"):
            label_id = int(raw_label.split("_")[1])
        else:
            label_id = raw_label

        return label_id, score


def load_claim_classifier():
    """
    Loads the classifier only once.
    Subsequent calls reuse the cached instance.
    """

    global _classifier

    if _classifier is None:
        _classifier = ClaimClassifier()

    return _classifier


if __name__ == "__main__":

    clf = load_claim_classifier()

    tests = [
        "The moon landing was faked.",
        "Water boils at 100 degrees Celsius.",
        "I love this video."
    ]

    for sentence in tests:
        print(sentence, "=>", clf.predict(sentence))