from fastapi import APIRouter, HTTPException

from app.schemas.dropout import (
    DropoutRiskRequest,
    DropoutRiskResponse
)
from app.schemas.dropout_explanation import (
    DropoutExplanationRequest,
    DropoutExplanationResponse
)

from app.services.dropout_service import dropout_risk_service
from app.services.ollama_service import ollama_service


router = APIRouter(
    prefix="/api/ai",
    tags=["Dropout Risk"]
)


@router.post(
    "/dropout-risk",
    response_model=DropoutRiskResponse
)
def predict_dropout_risk(
    request: DropoutRiskRequest
):

    try:

        result = dropout_risk_service.predict(
            request.model_dump()
        )

        return result

    except Exception as e:

        raise HTTPException(
            status_code=500,
            detail=f"Dropout risk prediction failed: {str(e)}"
        )


@router.post(
    "/dropout-explanation",
    response_model=DropoutExplanationResponse
)
def generate_dropout_explanation(
    request: DropoutExplanationRequest
):
    """
    POST /api/ai/dropout-explanation
    Generates structured AI explanation and recommendations using local Ollama model (llama3.2:3b).
    """
    try:
        return ollama_service.explain_dropout_risk(request)
    except Exception as e:
        raise HTTPException(
            status_code=500,
            detail=f"Dropout explanation generation failed: {str(e)}"
        )