from fastapi import APIRouter, HTTPException, status
from app.schemas.career import CareerAssessmentRequest, CareerRecommendationResponse
from app.services.ai_service import ai_service_instance

router = APIRouter(prefix="/api/ai", tags=["Career AI"])


@router.post("/career-recommendation", response_model=CareerRecommendationResponse)
def get_career_recommendation(request: CareerAssessmentRequest):
    """
    POST /api/ai/career-recommendation
    Analyzes student assessment input using Gemini AI and returns structured guidance.
    """
    try:
        return ai_service_instance.process_career_assessment(request)
    except ValueError as val_err:
        # API Key missing or configuration error
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail=str(val_err)
        )
    except Exception as exc:
        # Log backend error details without exposing sensitive info to frontend
        print(f"[AI Service Error]: {exc}")
        raise HTTPException(
            status_code=status.HTTP_503_SERVICE_UNAVAILABLE,
            detail="AI service is temporarily unavailable"
        )
