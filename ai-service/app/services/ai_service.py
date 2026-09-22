import json
import os
from dotenv import load_dotenv
from google import genai
from google.genai import types
from app.schemas.career import CareerAssessmentRequest, CareerRecommendationResponse

load_dotenv()


class AIService:
    def __init__(self):
        # Persona and rules instruction for EduPath AI
        self.system_instruction = (
            "You are EduPath AI, an educational career guidance assistant.\n\n"
            "Your task is to analyze a student's interests, academic performance, skills, work style, career goals and extracurricular activities.\n\n"
            "Recommend suitable career paths based on the student's information.\n\n"
            "Do not guarantee that a career is suitable.\n"
            "Give educational guidance only.\n\n"
            "Avoid making decisions based on sensitive personal characteristics.\n\n"
            "Give practical reasoning for every recommendation."
        )

    def get_gemini_client(self) -> genai.Client:
        """
        Retrieves the Gemini API Key from environment variables and initializes the official GenAI Client.
        """
        api_key = os.getenv("GEMINI_API_KEY")
        if not api_key or api_key.strip() == "YOUR_GEMINI_API_KEY":
            raise ValueError("GEMINI_API_KEY is not configured in .env file.")
        
        # Initialize Google GenAI client
        return genai.Client(api_key=api_key.strip())

    def process_career_assessment(self, request: CareerAssessmentRequest) -> CareerRecommendationResponse:
        """
        Formats student details, sends prompt to Gemini AI, and parses response into Pydantic model.
        """
        client = self.get_gemini_client()
        model_name = os.getenv("GEMINI_MODEL", "gemini-2.5-flash").strip()

        # Build prompt from student assessment input
        user_prompt = f"""
Please analyze this student's profile and provide structured career guidance recommendations:

- Interests: {', '.join(request.interests) if request.interests else 'Not specified'}
- Computer Skills: {request.computerSkills or 'Not specified'}
- Mathematics Skills: {request.mathematicsSkills or 'Not specified'}
- Communication Skills: {request.communicationSkills or 'Not specified'}
- Preferred Work Style: {request.preferredWorkStyle or 'Not specified'}
- Overall Academic Percentage: {request.overallPercentage if request.overallPercentage is not None else 'Not specified'}%
- Target Career Goal: {request.careerGoal or 'Not specified'}
- Extracurricular Activities: {request.extraCurricularActivities or 'Not specified'}
"""

        # Call Gemini API using google-genai SDK with JSON schema enforcement
        response = client.models.generate_content(
            model=model_name,
            contents=user_prompt,
            config=types.GenerateContentConfig(
                system_instruction=self.system_instruction,
                response_mime_type="application/json",
                response_schema=CareerRecommendationResponse,
                temperature=0.7,
            ),
        )

        # Parse and validate the response text against Pydantic schema
        if response.text:
            return CareerRecommendationResponse.model_validate_json(response.text)
        elif hasattr(response, "parsed") and response.parsed:
            return response.parsed
        else:
            raise RuntimeError("Gemini AI returned an empty response.")


ai_service_instance = AIService()
