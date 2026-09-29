import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import {
  RiLightbulbFlashLine,
  RiSparklingLine,
  RiCheckboxCircleLine,
  RiCompassDiscoverLine,
  RiRoadMapLine,
  RiAwardLine,
  RiArrowRightLine,
  RiInformationLine,
} from 'react-icons/ri';
import './StudentPage.css';

const CareerRecommendation = () => {
  const [aiResult, setAiResult] = useState(null);
  const [selectedCareerIndex, setSelectedCareerIndex] = useState(0);

  useEffect(() => {
    try {
      const stored = sessionStorage.getItem('career_ai_result');
      if (stored) {
        setAiResult(JSON.parse(stored));
      }
    } catch (e) {
      console.error('Failed to parse AI result from sessionStorage:', e);
    }
  }, []);

  // Empty State / Direct Page Navigation Handling
  if (!aiResult || !aiResult.topCareerRecommendations) {
    return (
      <div className="student-page animate-fade-in">
        <div className="page-header">
          <div className="page-header-icon" style={{ background: 'var(--gradient-primary)' }}>
            <RiLightbulbFlashLine />
          </div>
          <div>
            <h2 className="page-title">Career Recommendations</h2>
            <p className="page-subtitle">AI-generated career paths ranked by compatibility with your profile.</p>
          </div>
        </div>

        <div className="page-card" style={{ textAlign: 'center', padding: '48px 24px' }}>
          <RiInformationLine style={{ fontSize: '3rem', color: 'var(--primary)', marginBottom: '16px' }} />
          <h3 style={{ fontSize: '1.4rem', color: 'var(--text-primary)', marginBottom: '8px' }}>
            No Career Assessment Found
          </h3>
          <p style={{ color: 'var(--text-secondary)', maxWdith: '480px', margin: '0 auto 24px' }}>
            Please complete the Career Assessment form so EduPath AI can analyze your interests and generate personalized career guidance.
          </p>
          <Link to="/student/career-assessment" className="btn btn-primary btn-lg" style={{ display: 'inline-flex', alignItems: 'center', gap: '8px' }}>
            <RiCompassDiscoverLine /> Start Career Assessment
          </Link>
        </div>
      </div>
    );
  }

  const {
    summary,
    topCareerRecommendations = [],
    recommendedSkillsToLearn = [],
    learningRoadmap = [],
    finalAdvice,
  } = aiResult;

  const topCareer = topCareerRecommendations[selectedCareerIndex] || topCareerRecommendations[0];

  return (
    <div className="student-page animate-fade-in">
      {/* Page Header */}
      <div className="page-header">
        <div className="page-header-icon" style={{ background: 'var(--gradient-primary)' }}>
          <RiLightbulbFlashLine />
        </div>
        <div>
          <h2 className="page-title">AI Career Guidance & Recommendations</h2>
          <p className="page-subtitle">Personalized analysis powered by Google Gemini AI</p>
        </div>
      </div>

      {/* A. SUMMARY PANEL */}
      {summary && (
        <div className="info-strip" style={{ marginBottom: '24px', background: 'var(--bg-card)', border: '1.5px solid var(--border-card)', padding: '20px' }}>
          <RiSparklingLine className="info-strip-icon" style={{ fontSize: '1.5rem', color: 'var(--primary)' }} />
          <div>
            <h4 style={{ color: 'var(--text-primary)', margin: '0 0 6px 0', fontSize: '1.05rem', fontWeight: 700 }}>
              AI Profile Summary
            </h4>
            <p style={{ color: 'var(--text-secondary)', margin: 0, lineHeight: 1.6, fontSize: '0.95rem' }}>
              {summary}
            </p>
          </div>
        </div>
      )}

      {/* B. TOP CAREER RECOMMENDATION HIGHLIGHT */}
      {topCareer && (
        <div className="career-highlight" style={{ marginBottom: '28px' }}>
          <div className="career-highlight-left">
            <div className="career-match-ring">
              <svg viewBox="0 0 100 100">
                <circle cx="50" cy="50" r="40" fill="none" stroke="rgba(108,99,255,0.15)" strokeWidth="8" />
                <circle
                  cx="50" cy="50" r="40" fill="none"
                  stroke="url(#ringGrad)" strokeWidth="8"
                  strokeLinecap="round"
                  strokeDasharray={`${2 * Math.PI * 40 * (topCareer.matchPercentage || 80) / 100} ${2 * Math.PI * 40 * (1 - (topCareer.matchPercentage || 80) / 100)}`}
                  strokeDashoffset={Math.PI * 40 * 0.5}
                  style={{ transition: 'stroke-dasharray 1s ease' }}
                />
                <defs>
                  <linearGradient id="ringGrad" x1="0%" y1="0%" x2="100%" y2="100%">
                    <stop offset="0%" stopColor="#6c63ff" />
                    <stop offset="100%" stopColor="#a855f7" />
                  </linearGradient>
                </defs>
              </svg>
              <div className="ring-label">
                <span className="ring-pct">{topCareer.matchPercentage}%</span>
                <span className="ring-text">Match</span>
              </div>
            </div>

            <div>
              <p className="career-top-badge">🏆 Recommended Path</p>
              <h2 className="career-top-title">{topCareer.career}</h2>
            </div>
          </div>

          <div className="career-highlight-right">
            <p className="career-explanation-title">
              <RiSparklingLine /> Why this path fits you
            </p>
            <p className="career-explanation">{topCareer.reason}</p>
            
            {topCareer.requiredSkills && topCareer.requiredSkills.length > 0 && (
              <div>
                <p style={{ fontSize: '0.85rem', fontWeight: 600, color: 'var(--text-secondary)', marginBottom: '8px' }}>
                  Required Skills:
                </p>
                <div className="career-skills">
                  {topCareer.requiredSkills.map((skill) => (
                    <span key={skill} className="career-skill-tag">
                      <RiCheckboxCircleLine /> {skill}
                    </span>
                  ))}
                </div>
              </div>
            )}
          </div>
        </div>
      )}

      {/* ALL TOP CAREER RECOMMENDATIONS GRID */}
      <div style={{ marginBottom: '32px' }}>
        <h3 className="section-label" style={{ fontSize: '1.2rem', marginBottom: '16px', color: 'var(--text-primary)', fontWeight: 700 }}>
          Top Career Recommendations ({topCareerRecommendations.length})
        </h3>
        
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: '16px' }}>
          {topCareerRecommendations.map((rec, i) => (
            <div
              key={rec.career + i}
              className={`page-card ${i === selectedCareerIndex ? 'page-card-active' : ''}`}
              style={{
                cursor: 'pointer',
                border: i === selectedCareerIndex ? '2px solid var(--primary)' : '1.5px solid var(--border-card)',
                background: i === selectedCareerIndex ? 'var(--primary-glow)' : 'var(--bg-card)',
                transition: 'all 0.2s ease',
              }}
              onClick={() => setSelectedCareerIndex(i)}
            >
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '12px' }}>
                <span className="badge badge-primary">Rank #{i + 1}</span>
                <span style={{ fontWeight: 800, color: 'var(--primary)', fontSize: '1.1rem' }}>
                  {rec.matchPercentage}% Match
                </span>
              </div>
              <h4 style={{ fontSize: '1.15rem', color: 'var(--text-primary)', marginBottom: '8px', fontWeight: 700 }}>
                {rec.career}
              </h4>
              <p style={{ fontSize: '0.875rem', color: 'var(--text-secondary)', lineHeight: 1.5, marginBottom: '12px' }}>
                {rec.reason}
              </p>
              <div style={{ display: 'flex', flexWrap: 'wrap', gap: '6px' }}>
                {rec.requiredSkills?.slice(0, 3).map((s) => (
                  <span key={s} style={{ fontSize: '0.75rem', padding: '3px 8px', borderRadius: '12px', background: 'var(--bg-card-hover)', color: 'var(--text-secondary)' }}>
                    {s}
                  </span>
                ))}
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* C. RECOMMENDED SKILLS TO LEARN */}
      {recommendedSkillsToLearn && recommendedSkillsToLearn.length > 0 && (
        <div className="page-card" style={{ marginBottom: '32px' }}>
          <h3 style={{ fontSize: '1.15rem', fontWeight: 700, color: 'var(--text-primary)', marginBottom: '16px', display: 'flex', alignItems: 'center', gap: '8px' }}>
            <RiAwardLine style={{ color: 'var(--primary)' }} /> Recommended Skills to Learn
          </h3>
          <div style={{ display: 'flex', flexWrap: 'wrap', gap: '10px' }}>
            {recommendedSkillsToLearn.map((skill) => (
              <div
                key={skill}
                style={{
                  display: 'inline-flex',
                  alignItems: 'center',
                  gap: '8px',
                  padding: '10px 18px',
                  borderRadius: 'var(--radius-lg)',
                  background: 'var(--primary-glow)',
                  border: '1px solid var(--border-card)',
                  color: 'var(--text-primary)',
                  fontWeight: 600,
                  fontSize: '0.95rem',
                }}
              >
                <RiCheckboxCircleLine style={{ color: 'var(--primary)' }} />
                <span>{skill}</span>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* D. LEARNING ROADMAP */}
      {learningRoadmap && learningRoadmap.length > 0 && (
        <div className="page-card" style={{ marginBottom: '32px' }}>
          <h3 style={{ fontSize: '1.15rem', fontWeight: 700, color: 'var(--text-primary)', marginBottom: '20px', display: 'flex', alignItems: 'center', gap: '8px' }}>
            <RiRoadMapLine style={{ color: 'var(--primary)' }} /> Actionable Learning Roadmap
          </h3>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
            {learningRoadmap.map((item, index) => (
              <div
                key={item.step || index}
                style={{
                  display: 'flex',
                  gap: '16px',
                  alignItems: 'flex-start',
                  padding: '16px',
                  borderRadius: 'var(--radius-md)',
                  background: 'var(--bg-card-hover)',
                  borderLeft: '4px solid var(--primary)',
                }}
              >
                <div
                  style={{
                    width: '36px',
                    height: '36px',
                    borderRadius: '50%',
                    background: 'var(--gradient-primary)',
                    color: '#ffffff',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    fontWeight: 800,
                    fontSize: '1rem',
                    flexShrink: 0,
                  }}
                >
                  {item.step || index + 1}
                </div>
                <div>
                  <h4 style={{ fontSize: '1.05rem', color: 'var(--text-primary)', fontWeight: 700, marginBottom: '4px' }}>
                    {item.title}
                  </h4>
                  <p style={{ fontSize: '0.9rem', color: 'var(--text-secondary)', margin: 0, lineHeight: 1.6 }}>
                    {item.description}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* E. FINAL ADVICE */}
      {finalAdvice && (
        <div
          className="page-card"
          style={{
            background: 'linear-gradient(135deg, rgba(108,99,255,0.08) 0%, rgba(168,85,247,0.08) 100%)',
            border: '1.5px solid var(--primary)',
            marginBottom: '32px',
          }}
        >
          <h4 style={{ color: 'var(--primary)', fontSize: '1.1rem', fontWeight: 700, marginBottom: '8px', display: 'flex', alignItems: 'center', gap: '8px' }}>
            💡 Final AI Guidance
          </h4>
          <p style={{ color: 'var(--text-primary)', fontSize: '0.95rem', lineHeight: 1.6, margin: 0 }}>
            {finalAdvice}
          </p>
        </div>
      )}

      {/* RETAKE ASSESSMENT BUTTON */}
      <div style={{ textAlign: 'center', marginTop: '16px' }}>
        <Link to="/student/career-assessment" className="btn btn-secondary" style={{ display: 'inline-flex', alignItems: 'center', gap: '8px' }}>
          <RiCompassDiscoverLine /> Retake Assessment
        </Link>
      </div>
    </div>
  );
};

export default CareerRecommendation;