from pathlib import Path

import joblib
import pandas as pd


MODEL_PATH = (
    Path(__file__).resolve().parents[2]
    / "model"
    / "edupath_dropout_risk_random_forest.pkl"
)


class DropoutRiskService:

    def __init__(self):
        if not MODEL_PATH.exists():
            raise FileNotFoundError(
                f"Random Forest model not found: {MODEL_PATH}"
            )

        print(f"Loading Random Forest model from: {MODEL_PATH}")

        self.model = joblib.load(MODEL_PATH)

        print("Random Forest model loaded successfully.")

    def predict(self, data: dict):

        df = pd.DataFrame([data])

        prediction = self.model.predict(df)[0]

        probabilities = self.model.predict_proba(df)[0]

        confidence = float(probabilities.max() * 100)

        return {
            "dropout_risk": str(prediction),
            "confidence": round(confidence, 2)
        }


dropout_risk_service = DropoutRiskService()