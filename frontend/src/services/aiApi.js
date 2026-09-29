import { aiService } from '../pages/services/aiService';

export const aiApi = {
  getCareerRecommendation: (data) => aiService.getCareerRecommendation(data),
  submitAssessment: (data) => aiService.submitAssessment(data),
};

export default aiApi;
