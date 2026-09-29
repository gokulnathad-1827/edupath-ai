import { useState } from 'react';
import { Link } from 'react-router-dom';
import { RiBrainLine, RiMailLine, RiArrowLeftLine, RiCheckboxCircleLine, RiUserLine } from 'react-icons/ri';
import { authService } from '../services/authService';
import Button from '../../components/common/Button';
import './Auth.css';

const ForgotPassword = () => {
  const [role, setRole] = useState('student');
  const [email, setEmail] = useState('');
  const [loading, setLoading] = useState(false);
  const [sent, setSent] = useState(false);
  const [error, setError] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    if (!email || !/\S+@\S+\.\S+/.test(email)) {
      setError('Please enter a valid email address.');
      return;
    }
    try {
      setLoading(true);
      await authService.forgotPassword(email.trim());
      setSent(true);
    } catch (err) {
      console.error('[ForgotPassword Error]', err);
      const errMsg = err?.response?.data?.message || err?.message || 'Failed to send reset link. Please check your backend connection.';
      setError(errMsg);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="auth-page auth-page-centered">
      <div className="auth-bg">
        <div className="auth-orb auth-orb-1" />
        <div className="auth-orb auth-orb-2" />
        <div className="auth-grid" />
      </div>

      <div className="auth-single-card">
        {/* Logo */}
        <Link to="/" className="auth-brand auth-brand-centered">
          <div className="auth-logo"><RiBrainLine /></div>
          <span>EduPath <strong>AI</strong></span>
        </Link>

        {!sent ? (
          <>
            <div className="auth-card-header">
              <h3>Reset Password</h3>
              <p>Enter your registered email and we'll send you a reset link.</p>
            </div>

            {error && <div className="auth-error" role="alert">⚠️ {error}</div>}

            <form className="auth-form" onSubmit={handleSubmit} noValidate>
              <div className="form-group">
                <label className="form-label" htmlFor="forgot-role">Role</label>
                <div className="input-wrapper">
                  <RiUserLine className="input-icon" />
                  <select
                    id="forgot-role"
                    name="role"
                    value={role}
                    onChange={(e) => setRole(e.target.value)}
                    className="form-input form-select input-with-icon"
                    required
                  >
                    <option value="student">Student</option>
                    <option value="teacher">Teacher</option>
                    <option value="parent">Parent</option>
                    <option value="counselor">Counselor</option>
                  </select>
                </div>
              </div>

              <div className="form-group">
                <label className="form-label" htmlFor="forgot-email">Email Address</label>
                <div className="input-wrapper">
                  <RiMailLine className="input-icon" />
                  <input
                    id="forgot-email"
                    type="email"
                    value={email}
                    onChange={(e) => { setEmail(e.target.value); setError(''); }}
                    placeholder="you@student.edu"
                    className={`form-input input-with-icon ${error ? 'input-error' : ''}`}
                    autoComplete="email"
                    required
                  />
                </div>
              </div>

              <Button
                type="submit"
                variant="primary"
                size="lg"
                fullWidth
                loading={loading}
                id="forgot-submit-btn"
              >
                {loading ? 'Sending...' : 'Send Reset Link'}
              </Button>
            </form>
          </>
        ) : (
          <div className="auth-success-state">
            <div className="auth-success-icon">
              <RiCheckboxCircleLine />
            </div>
            <h3>Check Your Email!</h3>
            <p>
              We've sent a password reset link to <strong>{email}</strong>.
              Check your inbox and follow the instructions.
            </p>
            <p className="auth-note">Didn't receive it? Check your spam folder or try again.</p>
            <Button
              variant="outline"
              size="md"
              onClick={() => setSent(false)}
              fullWidth
            >
              Try Again
            </Button>
          </div>
        )}

        <div className="auth-back-link">
          <Link to="/login">
            <RiArrowLeftLine /> Back to Sign In
          </Link>
        </div>
      </div>
    </div>
  );
};

export default ForgotPassword;