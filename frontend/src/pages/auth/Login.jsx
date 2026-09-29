import { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import {
  RiBrainLine,
  RiMailLine,
  RiLockPasswordLine,
  RiEyeLine,
  RiEyeOffLine,
  RiArrowRightLine,
  RiCheckboxCircleLine,
  RiCustomerService2Line,
} from 'react-icons/ri';
import useAuth from '../hooks/useAuth';
import Button from '../../components/common/Button';
import './Auth.css';

const features = [
  'Attendance Management',
  'Academic Performance Tracking',
  'AI Career Guidance',
  'Parent & Teacher Collaboration',
  'Counseling & Student Wellbeing',
];

const Login = () => {
  const { login } = useAuth();
  const navigate = useNavigate();

  const [form, setForm] = useState({ email: '', password: '' });
  const [showPassword, setShowPassword] = useState(false);
  const [rememberMe, setRememberMe] = useState(true);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  useEffect(() => {
    const message = sessionStorage.getItem('edupath_auth_message');
    if (message) {
      setError(message);
      sessionStorage.removeItem('edupath_auth_message');
    }
  }, []);

  const handleChange = (e) => {
    setForm((prev) => ({ ...prev, [e.target.name]: e.target.value }));
    if (error) setError('');
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    // Friendly validation
    if (!form.email || !form.email.trim()) {
      setError('Please enter your email address.');
      return;
    }
    if (!/\S+@\S+\.\S+/.test(form.email.trim())) {
      setError('Please enter a valid email address.');
      return;
    }
    if (!form.password) {
      setError('Please enter your password.');
      return;
    }

    try {
      setLoading(true);
      setError('');

      // Call AuthContext login which posts /api/auth/login with { email, password }
      const res = await login(form.email.trim(), form.password);
      
      const roleStr = (res.role || res.user?.role || localStorage.getItem('edupath_role') || '')
        .toString()
        .toUpperCase()
        .replace('ROLE_', '')
        .trim();

      if (!rememberMe) {
        sessionStorage.setItem('edupath_session_active', 'true');
      }

      // Automatic Role Redirection
      if (roleStr === 'ADMIN') {
        navigate('/admin/dashboard', { replace: true });
      } else if (roleStr === 'TEACHER') {
        navigate('/teacher/dashboard', { replace: true });
      } else if (roleStr === 'STUDENT') {
        navigate('/student/dashboard', { replace: true });
      } else if (roleStr === 'PARENT') {
        navigate('/parent/dashboard', { replace: true });
      } else if (roleStr === 'COUNSELOR') {
        navigate('/counselor/dashboard', { replace: true });
      } else {
        navigate('/student/dashboard', { replace: true });
      }
    } catch (err) {
      if (err?.message?.includes('Failed to fetch') || err?.message?.includes('NetworkError')) {
        setError('Network error. Please check your connection and try again.');
      } else {
        setError(err?.message || 'Incorrect email or password. Please try again.');
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="auth-page">
      {/* Background ambient lighting */}
      <div className="auth-bg">
        <div className="auth-orb auth-orb-1" />
        <div className="auth-orb auth-orb-2" />
        <div className="auth-grid" />
      </div>

      <div className="auth-container">
        {/* LEFT SECTION */}
        <div className="auth-left">
          <Link to="/" className="auth-brand">
            <div className="auth-logo"><RiBrainLine /></div>
            <span>EduPath <strong>AI</strong></span>
          </Link>

          <div className="auth-left-content">
            <h2>AI-Powered School Management System</h2>
            <p>
              Manage attendance, academic performance, AI career guidance, counseling,
              and school communication through one intelligent platform.
            </p>

            <div className="auth-benefits">
              {features.map((feat) => (
                <div key={feat} className="auth-benefit-item">
                  <RiCheckboxCircleLine className="auth-benefit-check-icon" style={{ color: 'var(--secondary)', fontSize: '1.2rem' }} />
                  <span>{feat}</span>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* RIGHT SECTION */}
        <div className="auth-right">
          <div className="auth-card">
            <div className="auth-card-header">
              <h3>👋 Welcome Back</h3>
              <p>Sign in to continue</p>
            </div>

            {error && (
              <div className="auth-error" role="alert">
                ⚠️ {error}
              </div>
            )}

            <form className="auth-form" onSubmit={handleSubmit} noValidate>
              {/* Email Address */}
              <div className="form-group">
                <label className="form-label" htmlFor="login-email">Email Address</label>
                <div className="input-wrapper">
                  <RiMailLine className="input-icon" />
                  <input
                    id="login-email"
                    type="email"
                    name="email"
                    value={form.email}
                    onChange={handleChange}
                    placeholder="name@school.edu"
                    className="form-input input-with-icon"
                    autoComplete="email"
                    disabled={loading}
                    required
                  />
                </div>
              </div>

              {/* Password */}
              <div className="form-group">
                <label className="form-label" htmlFor="login-password">Password</label>
                <div className="input-wrapper">
                  <RiLockPasswordLine className="input-icon" />
                  <input
                    id="login-password"
                    type={showPassword ? 'text' : 'password'}
                    name="password"
                    value={form.password}
                    onChange={handleChange}
                    placeholder="Enter your password"
                    className="form-input input-with-icon input-with-trail"
                    autoComplete="current-password"
                    disabled={loading}
                    required
                  />
                  <button
                    type="button"
                    className="input-trail-btn"
                    onClick={() => setShowPassword((s) => !s)}
                    aria-label={showPassword ? 'Hide password' : 'Show password'}
                    disabled={loading}
                  >
                    {showPassword ? <RiEyeOffLine /> : <RiEyeLine />}
                  </button>
                </div>
              </div>

              {/* Remember Me & Forgot Password */}
              <div className="auth-remember-row">
                <label className="auth-checkbox-label" htmlFor="remember-me">
                  <input
                    id="remember-me"
                    type="checkbox"
                    checked={rememberMe}
                    onChange={(e) => setRememberMe(e.target.checked)}
                    disabled={loading}
                  />
                  <span>Remember Me</span>
                </label>
                <Link to="/forgot-password" className="auth-forgot-link">Forgot Password?</Link>
              </div>

              {/* Primary Sign In Button */}
              <Button
                type="submit"
                variant="primary"
                size="lg"
                fullWidth
                loading={loading}
                disabled={loading}
                icon={<RiArrowRightLine />}
                id="login-submit-btn"
              >
                {loading ? 'Signing In...' : 'Sign In'}
              </Button>
            </form>

            <div className="auth-divider" style={{ margin: '20px 0 16px 0', borderTop: '1px solid var(--border-card)' }} />

            <p className="auth-switch" style={{ textAlign: 'center', fontSize: '0.9rem', margin: '4px 0 12px 0' }}>
              Don't have an account?{' '}
              <Link to="/register" className="auth-switch-link" id="create-account-link">
                Create Account
              </Link>
            </p>

            {/* Need Help Footer */}
            <div className="auth-help-footer" style={{ textAlign: 'center', fontSize: '0.85rem', color: 'var(--text-secondary)', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '6px' }}>
              <RiCustomerService2Line style={{ color: 'var(--primary)' }} />
              <span>Need help? Please contact your <strong>School Administrator</strong>.</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Login;