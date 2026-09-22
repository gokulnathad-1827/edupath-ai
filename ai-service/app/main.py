import os
import uvicorn
from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from dotenv import load_dotenv

from app.routes.career import router as career_router
from app.routes.dropout import router as dropout_router

load_dotenv()

app = FastAPI(
    title="EduPath AI Service",
    description="FastAPI Microservice for AI Career Guidance and Student Support",
    version="1.0.0"
)

# Configure CORS for Frontend (http://localhost:5173)
cors_origins_str = os.getenv("CORS_ORIGINS", "http://localhost:5173,http://127.0.0.1:5173")
origins = [origin.strip() for origin in cors_origins_str.split(",")]

app.add_middleware(
    CORSMiddleware,
    allow_origins=origins,
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Health endpoint matching Spring Boot Actuator convention
@app.get("/actuator/health")
def health_check():
    return {"status": "UP"}

# Include AI routes
app.include_router(career_router)
app.include_router(dropout_router)

if __name__ == "__main__":
    port = int(os.getenv("PORT", 8084))
    host = os.getenv("HOST", "0.0.0.0")
    uvicorn.run("app.main:app", host=host, port=port, reload=True)
