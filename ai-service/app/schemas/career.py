from typing import List, Optional
from pydantic import BaseModel, Field


# ── Request Schema ───────────────────────────────────────────────────────────
class CareerAssessmentRequest(BaseModel):
    interests: List[str] = Field(..., description="List of student interests")
    computerSkills: Optional[str] = Field(None, description="Computer skills level")
    mathematicsSkills: Optional[str] = Field(None, description="Mathematics skills level")
    communicationSkills: Optional[str] = Field(None, description="Communication skills level")
    preferredWorkStyle: Optional[str] = Field(None, description="Preferred work style")
    overallPercentage: Optional[float] = Field(None, description="Overall academic percentage")
    careerGoal: Optional[str] = Field(None, description="Target career goal")
    extraCurricularActivities: Optional[str] = Field(None, description="Extracurricular activities")


# ── Response Schemas for AI Recommendations ──────────────────────────────────
class CareerRecommendationItem(BaseModel):
    career: str = Field(..., description="Name of recommended career path")
    matchPercentage: int = Field(..., description="Compatibility percentage (0-100)")
    reason: str = Field(..., description="Justification based on student profile")
    requiredSkills: List[str] = Field(..., description="Key skills required for this career")


class LearningRoadmapStep(BaseModel):
    step: int = Field(..., description="Step number in the learning roadmap")
    title: str = Field(..., description="Title of the step")
    description: str = Field(..., description="Actionable guidance for this step")


class CareerRecommendationResponse(BaseModel):
    summary: str = Field(..., description="Short analysis of the student's profile")
    topCareerRecommendations: List[CareerRecommendationItem] = Field(..., description="Top recommended career paths")
    recommendedSkillsToLearn: List[str] = Field(..., description="Key skills the student should learn")
    learningRoadmap: List[LearningRoadmapStep] = Field(..., description="Step-by-step learning roadmap")
    finalAdvice: str = Field(..., description="Encouraging final advice for the student")
