# src/evaluate_classifier.py

from src.model_loader import load_claim_classifier
from src.config import HF_MODEL_ID
import json
import os
from datetime import datetime, timezone

from sklearn.metrics import confusion_matrix, classification_report

# ------------------------------
# 40 Benchmark Test Sentences
# ------------------------------

TEST_DATA = [
    ("Water boils at 100 degrees Celsius at sea level.", "FACTUAL_CLAIM"),
    ("The human body has 206 bones.", "FACTUAL_CLAIM"),
    ("Mount Everest is the tallest mountain on Earth above sea level.", "FACTUAL_CLAIM"),
    ("The Pacific Ocean is the largest ocean on Earth.", "FACTUAL_CLAIM"),
    ("Light travels at approximately 300,000 kilometers per second.", "FACTUAL_CLAIM"),
    ("The capital of France is Paris.", "FACTUAL_CLAIM"),
    ("Bananas contain potassium.", "FACTUAL_CLAIM"),
    ("The Earth revolves around the Sun.", "FACTUAL_CLAIM"),
    ("Brazil is the largest country in South America.", "FACTUAL_CLAIM"),
    ("Sharks have existed longer than trees.", "FACTUAL_CLAIM"),

    ("Vaccines contain microchips.", "DISPUTED_CLAIM"),
    ("The Earth is flat.", "DISPUTED_CLAIM"),
    ("5G towers cause COVID-19.", "DISPUTED_CLAIM"),
    ("Humans use only 10% of their brains.", "DISPUTED_CLAIM"),
    ("Climate change is a hoax.", "DISPUTED_CLAIM"),
    ("The moon landing was faked.", "DISPUTED_CLAIM"),
    ("Eating carrots improves night vision dramatically.", "DISPUTED_CLAIM"),
    ("You can neutralize snake venom by drinking alcohol.", "DISPUTED_CLAIM"),
    ("Airplanes spray chemicals to control the population.", "DISPUTED_CLAIM"),
    ("Einstein failed math as a child.", "DISPUTED_CLAIM"),

    ("I think this video is amazing.", "NOT_A_CLAIM"),
    ("This is the best day of my life.", "NOT_A_CLAIM"),
    ("Cats are better than dogs.", "NOT_A_CLAIM"),
    ("I feel like the weather is strange today.", "NOT_A_CLAIM"),
    ("That movie was terrible.", "NOT_A_CLAIM"),
    ("I love how he explains things.", "NOT_A_CLAIM"),
    ("This sounds unbelievable.", "NOT_A_CLAIM"),
    ("Honestly, I don't know what to think anymore.", "NOT_A_CLAIM"),

    ("People say the pyramids were built by aliens.", "DISPUTED_CLAIM"),
    ("Some believe drinking hot water can cure cancer.", "DISPUTED_CLAIM"),
    ("They claim chocolate improves memory, but I'm not sure.", "DISPUTED_CLAIM"),
    ("Research suggests meditation might reduce stress.", "FACTUAL_CLAIM"),
    ("Scientists are still debating the exact cause of autism.", "NOT_A_CLAIM"),
    ("It appears that pollution affects air quality.", "FACTUAL_CLAIM"),

    ("According to NASA, Mars has two moons.", "FACTUAL_CLAIM"),
    ("People often argue that money buys happiness.", "NOT_A_CLAIM"),
    ("There is evidence that dinosaurs had feathers.", "FACTUAL_CLAIM"),
    ("Some say aliens visit Earth regularly.", "DISPUTED_CLAIM"),
    ("The study showed no link between gaming and violence.", "FACTUAL_CLAIM"),
    ("This experiment changed everything for me.", "NOT_A_CLAIM"),

    ("The International Space Station completes an orbit around Earth roughly every 90 minutes.", "FACTUAL_CLAIM"),
    ("India's Chandrayaan-3 mission successfully landed near the Moon's south pole.", "FACTUAL_CLAIM"),
    ("Photosynthesis converts sunlight into chemical energy inside plants.", "FACTUAL_CLAIM"),
    ("The human heart contains four chambers.", "FACTUAL_CLAIM"),
    ("Mount Kilimanjaro is located in Tanzania.", "FACTUAL_CLAIM"),
    ("Saturn is the second-largest planet in our solar system.", "FACTUAL_CLAIM"),
    ("Artificial intelligence systems learn patterns from training data.", "FACTUAL_CLAIM"),
    ("The Great Wall of China stretches for thousands of kilometers.", "FACTUAL_CLAIM"),
    ("Water expands when it freezes.", "FACTUAL_CLAIM"),
    ("Lightning travels faster than the speed of sound.", "FACTUAL_CLAIM"),

    ("Vaccines permanently alter human DNA.", "DISPUTED_CLAIM"),
    ("Drinking bleach can eliminate viruses from the body.", "DISPUTED_CLAIM"),
    ("5G mobile towers spread dangerous diseases.", "DISPUTED_CLAIM"),
    ("The Moon landing was filmed inside a movie studio.", "DISPUTED_CLAIM"),
    ("Climate change is completely fabricated by scientists.", "DISPUTED_CLAIM"),
    ("Humans can survive indefinitely without sleep.", "DISPUTED_CLAIM"),
    ("Wi-Fi signals permanently damage the human brain.", "DISPUTED_CLAIM"),
    ("The Earth is protected by an invisible dome.", "DISPUTED_CLAIM"),
    ("Eating only garlic can cure every infection.", "DISPUTED_CLAIM"),
    ("Dinosaurs still live in hidden underground caves.", "DISPUTED_CLAIM"),

    ("Thanks for joining today's video.", "NOT_A_CLAIM"),
    ("Let me know your thoughts in the comments below.", "NOT_A_CLAIM"),
    ("I couldn't believe what happened next.", "NOT_A_CLAIM"),
    ("We'll talk about that in a moment.", "NOT_A_CLAIM"),
    ("This was probably my favorite part.", "NOT_A_CLAIM"),
    ("Don't forget to subscribe for more videos.", "NOT_A_CLAIM"),
    ("I honestly wasn't expecting that.", "NOT_A_CLAIM"),
    ("Let's move on to the next example.", "NOT_A_CLAIM"),
    ("That was really interesting to watch.", "NOT_A_CLAIM"),
    ("We'll come back to this topic later.", "NOT_A_CLAIM"),

    ("The Amazon River is one of the longest rivers in the world.", "FACTUAL_CLAIM"),
    ("The human brain contains billions of neurons.", "FACTUAL_CLAIM"),
    ("Mercury is the closest planet to the Sun.", "FACTUAL_CLAIM"),
    ("The Eiffel Tower is located in Paris, France.", "FACTUAL_CLAIM"),
    ("The Pacific Ocean covers more area than all Earth's land combined.", "FACTUAL_CLAIM"),
    ("DNA carries the genetic information used for growth and reproduction.", "FACTUAL_CLAIM"),
    ("A standard football match lasts 90 minutes excluding extra time.", "FACTUAL_CLAIM"),
    ("Earth's atmosphere is composed primarily of nitrogen and oxygen.", "FACTUAL_CLAIM"),
    ("Polar bears are native to the Arctic region.", "FACTUAL_CLAIM"),
    ("The Nobel Prize was established by Alfred Nobel.", "FACTUAL_CLAIM"),


    ("Sharks never get cancer.", "DISPUTED_CLAIM"),
    ("You only use ten percent of your brain throughout your life.", "DISPUTED_CLAIM"),
    ("Microwave ovens make food radioactive.", "DISPUTED_CLAIM"),
    ("Goldfish can remember things for only three seconds.", "DISPUTED_CLAIM"),
    ("Eating carrots gives humans perfect night vision.", "DISPUTED_CLAIM"),
    ("Electric vehicles are always more harmful to the environment than gasoline cars.", "DISPUTED_CLAIM"),
    ("Artificial sweeteners directly cause cancer in everyone.", "DISPUTED_CLAIM"),
    ("Hair and fingernails continue growing after death.", "DISPUTED_CLAIM"),
    ("Vaccinated people can automatically transmit vaccine ingredients to others.", "DISPUTED_CLAIM"),
    ("The Bermuda Triangle is responsible for every missing aircraft in the Atlantic.", "DISPUTED_CLAIM"),

    ("What do you think about this?", "NOT_A_CLAIM"),
    ("Personally, I found this really fascinating.", "NOT_A_CLAIM"),
    ("Let's quickly recap what we've covered.", "NOT_A_CLAIM"),
    ("This completely changed my perspective.", "NOT_A_CLAIM"),
    ("I wasn't expecting the results to look like this.", "NOT_A_CLAIM"),
    ("Before we continue, make sure you've watched the previous video.", "NOT_A_CLAIM"),
    ("Now things start getting interesting.", "NOT_A_CLAIM"),
    ("We'll explain everything step by step.", "NOT_A_CLAIM"),
    ("Honestly, this surprised even me.", "NOT_A_CLAIM"),
    ("Stick around until the end because there's something important coming up.", "NOT_A_CLAIM"),

    ("According to NASA, Mars has two natural moons named Phobos and Deimos.", "FACTUAL_CLAIM"),
    ("Research has shown that regular physical activity can improve cardiovascular health.", "FACTUAL_CLAIM"),
    ("The Earth's magnetic field helps protect the planet from solar radiation.", "FACTUAL_CLAIM"),
    ("Most smartphones use lithium-ion batteries.", "FACTUAL_CLAIM"),
    ("Honey naturally contains antimicrobial properties.", "FACTUAL_CLAIM"),
    ("The Olympic Games are held every four years.", "FACTUAL_CLAIM"),
    ("Antarctica is the coldest continent on Earth.", "FACTUAL_CLAIM"),
    ("The decimal number system uses ten digits from zero to nine.", "FACTUAL_CLAIM"),
    ("The Internet is a global network connecting millions of devices.", "FACTUAL_CLAIM"),
    ("The liver is one of the largest internal organs in the human body.", "FACTUAL_CLAIM"),

    ("Drinking alkaline water prevents all forms of cancer.", "DISPUTED_CLAIM"),
    ("Artificial intelligence has already become conscious.", "DISPUTED_CLAIM"),
    ("Bitcoin is secretly controlled by NASA.", "DISPUTED_CLAIM"),
    ("The pyramids were built entirely by aliens.", "DISPUTED_CLAIM"),
    ("Cell phone towers can directly control human thoughts.", "DISPUTED_CLAIM"),
    ("Vitamin C completely prevents people from catching the flu.", "DISPUTED_CLAIM"),
    ("Chocolate is scientifically proven to double human intelligence.", "DISPUTED_CLAIM"),
    ("The Sun revolves around the Earth once every day.", "DISPUTED_CLAIM"),
    ("Dinosaurs never actually existed.", "DISPUTED_CLAIM"),
    ("Every natural remedy is safer than modern medicine.", "DISPUTED_CLAIM"),


    ("Let's take a closer look at what happens next.", "NOT_A_CLAIM"),
    ("I wasn't really convinced at first.", "NOT_A_CLAIM"),
    ("This clip has over a million views already.", "NOT_A_CLAIM"),
    ("We'll revisit this idea later in the video.", "NOT_A_CLAIM"),
    ("That's probably one of the coolest things I've seen.", "NOT_A_CLAIM"),
    ("I really hope you enjoyed today's discussion.", "NOT_A_CLAIM"),
    ("If you've made it this far, thank you for watching.", "NOT_A_CLAIM"),
    ("That ending caught me completely off guard.", "NOT_A_CLAIM"),
    ("Let's move on before this gets too technical.", "NOT_A_CLAIM"),
    ("I'm curious to hear your opinion about this topic.", "NOT_A_CLAIM"),

    ("According to the World Health Organization, malaria is transmitted through infected mosquito bites.", "FACTUAL_CLAIM"),
    ("Researchers have discovered thousands of exoplanets outside our solar system.", "FACTUAL_CLAIM"),
    ("Carbon dioxide is one of the primary greenhouse gases in Earth's atmosphere.", "FACTUAL_CLAIM"),
    ("The human body continuously produces new blood cells inside the bone marrow.", "FACTUAL_CLAIM"),
    ("Machine learning is a branch of artificial intelligence.", "FACTUAL_CLAIM"),
    ("The Himalayas were formed by the collision of the Indian and Eurasian tectonic plates.", "FACTUAL_CLAIM"),
    ("A standard keyboard contains function keys labeled F1 through F12.", "FACTUAL_CLAIM"),
    ("The ozone layer absorbs most of the Sun's harmful ultraviolet radiation.", "FACTUAL_CLAIM"),
    ("Penguins are flightless birds primarily found in the Southern Hemisphere.", "FACTUAL_CLAIM"),
    ("Renewable energy sources include solar, wind, hydroelectric, and geothermal power.", "FACTUAL_CLAIM"),

    ("Scientists have confirmed that ghosts can be detected using mobile phone cameras.", "DISPUTED_CLAIM"),
    ("Every cryptocurrency investment is guaranteed to generate profits.", "DISPUTED_CLAIM"),
    ("Artificial intelligence will completely replace every human job within the next five years.", "DISPUTED_CLAIM"),
    ("Sleeping with magnets under your pillow permanently improves intelligence.", "DISPUTED_CLAIM"),
    ("The Earth stopped rotating for several minutes without anyone noticing.", "DISPUTED_CLAIM"),


    ("We'll leave that question for another video.", "NOT_A_CLAIM"),
    ("I think that's enough for today's discussion.", "NOT_A_CLAIM"),
    ("This part always makes me laugh.", "NOT_A_CLAIM"),
    ("Let's wrap things up here.", "NOT_A_CLAIM"),
    ("Thanks again for spending your time with me today.", "NOT_A_CLAIM"),
]

LABELS = ["FACTUAL_CLAIM", "DISPUTED_CLAIM", "NOT_A_CLAIM"]

OUTPUT_PATH = os.path.join(
    os.path.dirname(__file__), "..", "reports", "model_evaluation.json"
)


# ------------------------------
# Run Evaluation
# ------------------------------

def evaluate():
    print("Loading classifier...\n")
    classifier = load_claim_classifier()

    y_true = []
    y_pred = []

    print("\n=== BEGIN EVALUATION ===\n")

    for text, expected in TEST_DATA:
        predicted, score = classifier.predict(text)

        pass_fail = "PASS" if predicted == expected else "FAIL"

        print(f"Text: {text}")
        print(f"Expected: {expected}")
        print(f"Predicted: {predicted} (score={score:.4f})  →  {pass_fail}")
        print("-" * 60)

        y_true.append(expected)
        y_pred.append(predicted)

    total = len(TEST_DATA)
    correct = sum(1 for t, p in zip(y_true, y_pred) if t == p)
    accuracy = correct / total

    # Full 3x3 confusion matrix — rows = actual label, columns = predicted
    # label, in LABELS order. This is what a "confusion matrix" actually
    # means (every actual-vs-predicted combination), not just a per-class
    # correct/wrong tally.
    matrix = confusion_matrix(y_true, y_pred, labels=LABELS).tolist()

    report = classification_report(
        y_true, y_pred, labels=LABELS, output_dict=True, zero_division=0
    )

    print("\n=== FINAL SUMMARY ===")
    print(f"Total Sentences: {total}")
    print(f"Correct: {correct}")
    print(f"Accuracy: {accuracy * 100:.2f}%\n")

    print("=== CONFUSION MATRIX (rows=actual, cols=predicted) ===")
    print(f"{'':>16}" + "".join(f"{l:>16}" for l in LABELS))
    for label, row in zip(LABELS, matrix):
        print(f"{label:>16}" + "".join(f"{v:>16}" for v in row))

    output = {
        "model_id": HF_MODEL_ID,
        "generated_at": datetime.now(timezone.utc).isoformat(),
        "sample_size": total,
        "labels": LABELS,
        "accuracy": round(accuracy, 4),
        "confusion_matrix": matrix,
        "per_class": {
            label: {
                "precision": round(report[label]["precision"], 4),
                "recall": round(report[label]["recall"], 4),
                "f1": round(report[label]["f1-score"], 4),
                "support": int(report[label]["support"]),
            }
            for label in LABELS
        },
    }

    os.makedirs(os.path.dirname(OUTPUT_PATH), exist_ok=True)
    with open(OUTPUT_PATH, "w", encoding="utf-8") as f:
        json.dump(output, f, indent=2)

    print(f"\nSaved structured results to {os.path.abspath(OUTPUT_PATH)}")
    print("Send this file back so it can be wired into the site's confusion-matrix section.")

    return output


if __name__ == "__main__":
    evaluate()

