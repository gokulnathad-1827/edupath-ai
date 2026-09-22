from typing import List
from pydantic import BaseModel, Field
from app.schemas.dropout import DropoutRiskRequest


class RoleRecommendations(BaseModel):
    student: List[str] = Field(default_factory=list, description="Personalized recommendations for the student")
    teacher: List[str] = Field(default_factory=list, description="Actionable guidance for the teacher")
    parent: List[str] = Field(default_factory=list, description="Supportive advice for parents")
    counselor: List[str] = Field(default_factory=list, description="Intervention strategies for school counselor")


class DropoutExplanationRequest(BaseModel):
    dropout_risk: str = Field(..., description="Dropout risk predicted by Random Forest (e.g. High, Medium, Low)")
    confidence: float = Field(..., description="Confidence percentage predicted by Random Forest")
    student: DropoutRiskRequest = Field(..., description="Student performance and demographic features")


class DropoutExplanationResponse(BaseModel):
    dropout_risk: str = Field(..., description="Preserved dropout risk level")
    confidence: float = Field(..., description="Preserved confidence score")
    explanation: str = Field(..., description="Detailed explanation of the predicted dropout risk")
    key_factors: List[str] = Field(default_factory=list, description="Key contributing factors identified by AI")
    recommendations: RoleRecommendations = Field(..., description="Targeted recommendations for each stakeholder role")
    ai_provider: str = Field("ollama", description="AI provider used for explanation generation")
    model: str = Field("llama3.2:3b", description="AI model name")
    ollama_available: bool = Field(True, description="Indicates whether local Ollama service was available")
