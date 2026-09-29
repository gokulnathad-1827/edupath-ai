import { useState, useEffect } from 'react';
import { Link, useSearchParams } from 'react-router-dom';
import { RiBrainLine, RiLockPasswordLine, RiArrowLeftLine, RiCheckboxCircleLine, RiErrorWarningLine } from 'react-icons/ri';
import { authService } from '../services/authService';
import Button from '../../components/common/Button';
import './Auth.css';

const ResetPassword = () => {
  const [searchParams] = useSearchParams();
  const [token, setToken] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);
  const [error, setError] = useState('');

  useEffect(() => {
    const tokenParam = searchParams.get('token');
    if (tokenParam) {
      setToken(tokenParam);
    } else {
      setError('Invalid or missing password reset token. Please check the link sent to your email.');
    }
  }, [searchParams]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');

    if (!token) {
      setError('Missing password reset token.');
      return;
    }

    if (!newPassword || newPassword.length < 6) {
      setError('Password must be at least 6 characters long.');
      return;
    }

    if (newPassword !== confirmPassword) {
      setError('Passwords do not match.');
      return;
    }

    try {
      setLoading(true);
      await authService.resetPassword(token, newPassword);
      setSuccess(true);
    } catch (err) {
      console.error('[ResetPassword Error]', err);
      const errMsg = err?.response?.data?.message || err?.message || 'Failed to reset password. The link may have expired or already been used.';
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

        {!success ? (
          <>
            <div className="auth-card-header">
              <h3>Create New Password</h3>
              <p>Enter your new password below to secure your account.</p>
            </div>

            {error && <div className="auth-error" role="alert"><RiErrorWarningLine /> {error}</div>}

            <form className="auth-form" onSubmit={handleSubmit} noValidate>
              <div className="form-group">
                <label className="form-label" htmlFor="reset-new-password">New Password</label>
                <div className="input-wrapper">
                  <RiLockPasswordLine className="input-icon" />
                  <input
                    id="reset-new-password"
                    type="password"
                    value={newPassword}
                    onChange={(e) => { setNewPassword(e.target.value); setError(''); }}
                    placeholder="At least 6 characters"
                    className={`form-input input-with-icon ${error ? 'input-error' : ''}`}
                    autoComplete="new-password"
                    disabled={loading || !token}
                    required
                  />
                </div>
              </div>

              <div className="form-group">
                <label className="form-label" htmlFor="reset-confirm-password">Confirm New Password</label>
                <div className="input-wrapper">
                  <RiLockPasswordLine className="input-icon" />
                  <input
                    id="reset-confirm-password"
                    type="password"
                    value={confirmPassword}
                    onChange={(e) => { setConfirmPassword(e.target.value); setError(''); }}
                    placeholder="Re-enter new password"
                    className={`form-input input-with-icon ${error ? 'input-error' : ''}`}
                    autoComplete="new-password"
                    disabled={loading || !token}
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
                disabled={!token || loading}
                id="reset-submit-btn"
              >
                {loading ? 'Resetting Password...' : 'Reset Password'}
              </Button>
            </form>
          </>
        ) : (
          <div className="auth-success-state">
            <div className="auth-success-icon">
              <RiCheckboxCircleLine />
            </div>
            <h3>Password Reset Successful!</h3>
            <p>Your password has been successfully updated. You can now log in with your new credentials.</p>
            <Link to="/login" style={{ width: '100%' }}>
              <Button variant="primary" size="lg" fullWidth>
                Sign In Now
              </Button>
            </Link>
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

export default ResetPassword;
