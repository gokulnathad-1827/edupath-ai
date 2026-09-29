import { aiApiClient, edupathApiClient } from '../../config/apiConfig';
import { careerApi } from '../../services/careerApi';
import { courseApi } from '../../services/courseApi';

export const aiService = {
  /**
   * Submit student assessment to Python FastAPI ai-service running on port 8084.
   * Endpoint: POST /api/ai/career-recommendation
   */
  getCareerRecommendation: async (assessmentData) => {
    const payload = {
      interests: Array.isArray(assessmentData.interests) ? assessmentData.interests : [],
      computerSkills: assessmentData.computerSkills || assessmentData.programmingSkill || '',
      mathematicsSkills: assessmentData.mathematicsSkills || assessmentData.mathSkill || '',
      communicationSkills: assessmentData.communicationSkills || assessmentData.communicationSkill || '',
      preferredWorkStyle: assessmentData.preferredWorkStyle || '',
      overallPercentage: parseFloat(assessmentData.overallPercentage || assessmentData.cgpa || 0),
      careerGoal: assessmentData.careerGoal || '',
      extraCurricularActivities: assessmentData.extraCurricularActivities || assessmentData.extraCurricular || '',
    };

    const res = await aiApiClient.post('/api/ai/career-recommendation', payload);
    return res.data;
  },

  submitAssessment: async (assessmentData) => {
    return await aiService.getCareerRecommendation(assessmentData);
  },

  getCareerRecommendations: async () => {
    try {
      const stored = sessionStorage.getItem('career_ai_result');
      if (stored) {
        return JSON.parse(stored);
      }
    } catch {}
    return null;
  },

  getDropoutRisk: async () => {
    try {
      const res = await edupathApiClient.get('/ai/dropout-risk');
      return res.data;
    } catch {
      return { risk: 18, label: 'Low', advice: 'Keep up the great work!' };
    }
  },

  getAllCareersFromService: async () => {
    return await careerApi.getAllCareers();
  },

  getAllCoursesFromService: async () => {
    return await courseApi.getAllCourses();
  },
};

export default aiService;