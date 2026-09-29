import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { RiCompassDiscoverLine, RiSparklingLine, RiErrorWarningLine } from 'react-icons/ri';
import CareerAssessmentForm from '../../components/forms/CareerAssessmentForm';
import { aiService } from '../services/aiService';
import './StudentPage.css';

const CareerAssessment = () => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const navigate = useNavigate();

  const handleSubmit = async (formData) => {
    if (loading) return; // Prevent duplicate submissions

    try {
      setLoading(true);
      setError('');

      // Send to FastAPI ai-service running on port 8084
      const result = await aiService.getCareerRecommendation(formData);

      // Store real AI response in sessionStorage
      sessionStorage.setItem('career_ai_result', JSON.stringify(result));

      // Navigate to Career Recommendation page
      navigate('/student/career-recommendation');
    } catch (err) {
      console.error('[AI Assessment Error] Failed to generate career recommendation:', err);
      setError('Unable to generate your career recommendation right now. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="student-page animate-fade-in">
      {/* Page Header */}
      <div className="page-header">
        <div className="page-header-icon" style={{ background: 'var(--gradient-primary)' }}>
          <RiCompassDiscoverLine />
        </div>
        <div>
          <h2 className="page-title">Student Career Assessment</h2>
          <p className="page-subtitle">
            Answer a few simple questions about your interests, skills, and goals. EduPath AI will generate a personalized career recommendation powered by Gemini AI.
          </p>
        </div>
      </div>

      {/* Info Strip */}
      <div className="info-strip">
        <RiSparklingLine className="info-strip-icon" />
        <p>
          <strong>AI-Powered Analysis:</strong> EduPath AI uses Google Gemini to analyze your interests, skills, academic performance, and work style to recommend tailored career paths and learning roadmaps.
        </p>
      </div>

      {/* Error Notice */}
      {error && (
        <div className="auth-error" style={{ marginBottom: '16px', display: 'flex', alignItems: 'center', gap: '8px' }} role="alert">
          <RiErrorWarningLine style={{ fontSize: '1.2rem' }} />
          <span>{error}</span>
        </div>
      )}

      {/* Form Card or Loading State */}
      <div className="page-card">
        {loading ? (
          <div className="assessment-done" style={{ padding: '48px 24px', textAlign: 'center' }}>
            <div className="spinner" style={{ margin: '0 auto 20px', width: '48px', height: '48px' }} />
            <h3 style={{ fontSize: '1.4rem', color: 'var(--text-primary)', marginBottom: '8px' }}>
              Analyzing your profile...
            </h3>
            <p style={{ color: 'var(--text-secondary)', fontSize: '0.95rem', maxWidth: '480px', margin: '0 auto' }}>
              Generating personalized career recommendations, required skills, and learning roadmap with Gemini AI...
            </p>
          </div>
        ) : (
          <CareerAssessmentForm onSubmit={handleSubmit} loading={loading} />
        )}
      </div>
    </div>
  );
};

export default CareerAssessment;