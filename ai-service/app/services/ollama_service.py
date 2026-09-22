import os
import json
import re
import logging
import httpx
from dotenv import load_dotenv

from app.schemas.dropout_explanation import (
    DropoutExplanationRequest,
    DropoutExplanationResponse,
    RoleRecommendations,
)

load_dotenv()

logger = logging.getLogger("ollama_service")

SYSTEM_INSTRUCTION = """You are EduPath AI, an academic support assistant for school students.

The dropout risk and confidence are produced by a Random Forest machine-learning model.

You MUST NOT change, reinterpret, or recalculate the predicted dropout risk or confidence.

Your responsibility is only to explain the prediction and provide practical academic support recommendations.

Use only the student information supplied to you.

Avoid making medical diagnoses.

Use supportive, professional and age-appropriate language."""


class OllamaService:
    def __init__(self):
        self.base_url = os.getenv("OLLAMA_BASE_URL", "http://localhost:11434").rstrip("/")
        self.model_name = os.getenv("OLLAMA_MODEL", "llama3.2:3b")

    def check_availability(self) -> bool:
        """Check if local Ollama server is running and accessible."""
        try:
            with httpx.Client(timeout=3.0) as client:
                res = client.get(f"{self.base_url}/api/tags")
                return res.status_code == 200
        except Exception:
            return False

    def explain_dropout_risk(self, request: DropoutExplanationRequest) -> DropoutExplanationResponse:
        """
        Generates explanation and recommendations using local Ollama model (llama3.2:3b).
        Preserves original Random Forest dropout_risk and confidence.
        Includes fallback when Ollama is unavailable.
        """
        student = request.student

        user_prompt = f"""Random Forest Prediction:
Risk: {request.dropout_risk}
Confidence: {request.confidence}%

Student information:
- Age: {student.age}, Gender: {student.gender}, Grade: {student.grade}
- Attendance: {student.attendance_percentage}%
- Academic Performance: Previous {student.previous_percentage}%, Current {student.current_percentage}% (Trend: {student.academic_trend})
- Subject Scores: Math {student.mathematics_score}, Science {student.science_score}, English {student.english_score}, Computer {student.computer_score}
- Engagement: Assignment Completion {student.assignment_completion_rate}%, Study Hours {student.study_hours_per_day} hrs/day
- Behavioral: Score {student.behavior_score}, Parental Support {student.parental_support}, Failures {student.previous_failures}

Provide a concise JSON response with these exact keys:
{{
  "explanation": "Concise 2-sentence explanation of why the model predicted {request.dropout_risk} dropout risk.",
  "key_factors": [
    "Key risk factor 1",
    "Key risk factor 2",
    "Key risk factor 3"
  ],
  "recommendations": {{
    "student": ["Action item for student 1", "Action item for student 2"],
    "teacher": ["Strategy for teacher 1", "Strategy for teacher 2"],
    "parent": ["Support advice for parent 1", "Support advice for parent 2"],
    "counselor": ["Intervention for counselor 1", "Intervention for counselor 2"]
  }}
}}"""

        payload = {
            "model": self.model_name,
            "system": SYSTEM_INSTRUCTION,
            "prompt": user_prompt,
            "format": "json",
            "stream": False,
            "options": {
                "num_predict": 500,
                "temperature": 0.3
            }
        }



        try:
            logger.info(f"Connecting to Ollama at {self.base_url} using model {self.model_name}")
            with httpx.Client(timeout=300.0) as client:
                res = client.post(f"{self.base_url}/api/generate", json=payload)



                res.raise_for_status()
                response_data = res.json()
                raw_response = response_data.get("response", "")

            parsed_data = self._parse_json_response(raw_response)

            # Build RoleRecommendations object
            recs_raw = parsed_data.get("recommendations", {})
            if not isinstance(recs_raw, dict):
                recs_raw = {}

            role_recs = RoleRecommendations(
                student=self._ensure_string_list(recs_raw.get("student")),
                teacher=self._ensure_string_list(recs_raw.get("teacher")),
                parent=self._ensure_string_list(recs_raw.get("parent")),
                counselor=self._ensure_string_list(recs_raw.get("counselor")),
            )

            explanation_text = parsed_data.get(
                "explanation",
                f"The Random Forest model predicted a {request.dropout_risk} dropout risk with {request.confidence}% confidence based on student academic and behavioral metrics."
            )
            key_factors_list = self._ensure_string_list(parsed_data.get("key_factors"))

            return DropoutExplanationResponse(
                dropout_risk=request.dropout_risk,
                confidence=request.confidence,
                explanation=explanation_text,
                key_factors=key_factors_list,
                recommendations=role_recs,
                ai_provider="ollama",
                model=self.model_name,
                ollama_available=True,
            )

        except Exception as err:
            logger.warning(f"Ollama integration error: {err}. Returning fallback response.")
            return self._build_fallback_response(request)

    def _parse_json_response(self, text: str) -> dict:
        """Helper to parse JSON out of response string, cleaning code blocks if present."""
        cleaned = text.strip()
        # Remove markdown fence if present
        if cleaned.startswith("```"):
            cleaned = re.sub(r"^```(?:json)?\n?", "", cleaned, flags=re.IGNORECASE)
            cleaned = re.sub(r"\n?```$", "", cleaned)
            cleaned = cleaned.strip()

        try:
            return json.loads(cleaned)
        except json.JSONDecodeError:
            # Attempt to locate JSON block using regex if parsing directly failed
            match = re.search(r"\{.*\}", cleaned, re.DOTALL)
            if match:
                try:
                    return json.loads(match.group(0))
                except json.JSONDecodeError:
                    pass
            logger.error(f"Failed to parse JSON from Ollama output: {text[:200]}")
            return {}

    def _ensure_string_list(self, val) -> list[str]:
        """Ensures input value is converted to a list of strings."""
        if isinstance(val, list):
            return [str(item) for item in val if item]
        elif isinstance(val, str) and val.strip():
            return [val.strip()]
        return []

    def _build_fallback_response(self, request: DropoutExplanationRequest) -> DropoutExplanationResponse:
        """Returns required graceful fallback response when Ollama is unavailable."""
        return DropoutExplanationResponse(
            dropout_risk=request.dropout_risk,
            confidence=request.confidence,
            explanation="AI explanation service is temporarily unavailable.",
            key_factors=[],
            recommendations=RoleRecommendations(
                student=[],
                teacher=[],
                parent=[],
                counselor=[],
            ),
            ai_provider="ollama",
            model=self.model_name,
            ollama_available=False,
        )


ollama_service = OllamaService()
