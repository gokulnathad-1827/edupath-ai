from pydantic import BaseModel, Field


class DropoutRiskRequest(BaseModel):
    age: int
    gender: str
    grade: int

    attendance_percentage: float
    previous_percentage: float
    current_percentage: float

    mathematics_score: float
    science_score: float
    english_score: float
    computer_score: float

    assignment_completion_rate: float
    study_hours_per_day: float

    behavior_score: float
    parental_support: str
    previous_failures: int
    academic_trend: str


class DropoutRiskResponse(BaseModel):
    dropout_risk: str
    confidence: float