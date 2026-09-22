# EduPath AI Microservice (`ai-service`)

A lightweight **FastAPI** Python microservice for EduPath AI providing real AI-powered career guidance using the official **Google GenAI Python SDK (`google-genai`)**.

---

## 📁 Directory Structure

```text
ai-service/
│
├── app/
│   ├── __init__.py
│   ├── main.py
│   ├── routes/
│   │   ├── __init__.py
│   │   └── career.py
│   ├── schemas/
│   │   ├── __init__.py
│   │   └── career.py
│   └── services/
│       ├── __init__.py
│       └── ai_service.py
│
├── requirements.txt
├── .env
├── .gitignore
└── README.md
```

---

## ⚙️ Environment Configuration (`.env`)

- **Service Port**: `8084`
- **CORS Allowed Origins**: `http://localhost:5173,http://127.0.0.1:5173`
- **Gemini API Key**: `GEMINI_API_KEY=YOUR_GEMINI_API_KEY`
- **Gemini Model**: `GEMINI_MODEL=gemini-2.5-flash`

---

## 🚀 How to Run in PowerShell

### 1. Open PowerShell and Navigate to `ai-service`
```powershell
cd c:\Users\Gokulnath\Downloads\EduPathAI\ai-service
```

### 2. Install Dependencies
```powershell
pip install -r requirements.txt
```

### 3. Start the FastAPI Server
```powershell
C:\Users\Gokulnath\AppData\Local\Programs\Python\Python313\Scripts\uvicorn.exe app.main:app --port 8084 --reload
```
or:
```powershell
uvicorn app.main:app --port 8084 --reload
```

---

## 🧪 API Verification & Sample Requests

### 1. Health Check Endpoint
- **URL**: `GET http://localhost:8084/actuator/health`
- **Response**:
```json
{
  "status": "UP"
}
```

### 2. Real Gemini AI Career Recommendation Endpoint
- **URL**: `POST http://localhost:8084/api/ai/career-recommendation`
- **Headers**: `Content-Type: application/json`
- **Sample Request Body**:
```json
{
  "interests": [
    "Mathematics",
    "Computer Science",
    "Problem Solving"
  ],
  "computerSkills": "Advanced",
  "mathematicsSkills": "Good",
  "communicationSkills": "Good",
  "preferredWorkStyle": "Individual",
  "overallPercentage": 85,
  "careerGoal": "I want to become an AI Engineer",
  "extraCurricularActivities": "Hackathons and coding competitions"
}
```

- **Structured AI Response Body**:
```json
{
  "summary": "The student exhibits strong analytical and technical aptitudes with an interest in computer science and mathematics.",
  "topCareerRecommendations": [
    {
      "career": "AI / Machine Learning Engineer",
      "matchPercentage": 92,
      "reason": "Strong alignment with mathematics, computer science interests, and coding competition experience.",
      "requiredSkills": [
        "Python",
        "Machine Learning",
        "Linear Algebra",
        "PyTorch / TensorFlow"
      ]
    },
    {
      "career": "Data Scientist",
      "matchPercentage": 87,
      "reason": "Good analytical and mathematical skill base suitable for data analysis and predictive modeling.",
      "requiredSkills": [
        "Python",
        "Statistics",
        "SQL",
        "Data Visualization"
      ]
    }
  ],
  "recommendedSkillsToLearn": [
    "Python",
    "Machine Learning",
    "SQL"
  ],
  "learningRoadmap": [
    {
      "step": 1,
      "title": "Master Python Programming",
      "description": "Build strong software engineering fundamentals using Python data structures and libraries."
    },
    {
      "step": 2,
      "title": "Mathematics & Statistics Foundations",
      "description": "Study linear algebra, calculus, and probability concepts essential for AI algorithms."
    },
    {
      "step": 3,
      "title": "Applied Machine Learning & Projects",
      "description": "Build end-to-end machine learning models and participate in hackathons."
    }
  ],
  "finalAdvice": "Focus on building real-world open-source projects and maintaining your strong mathematical skills."
}
```
