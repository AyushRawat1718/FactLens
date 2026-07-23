# Populating the classifier performance section

`src/sections/ModelEvaluation.jsx` fetches `/model-evaluation.json` from
this folder at runtime. It intentionally shows an honest "not yet
published" state until that file exists — nothing is fabricated.

To generate it for real:

    cd backend
    python -m src.evaluate_classifier

That writes `backend/reports/model_evaluation.json`. Copy it here:

    cp backend/reports/model_evaluation.json frontend/public/model-evaluation.json

Re-run whenever the classifier is retrained so the site reflects current
numbers. Requires `scikit-learn` — add it to backend/requirements.txt if
it isn't already there (`pip install scikit-learn`).
