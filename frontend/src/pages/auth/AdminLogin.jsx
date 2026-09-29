import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import {
  RiBrainLine,
  RiLockPasswordLine,
  RiEyeLine,
  RiEyeOffLine,
  RiArrowLeftLine,
  RiShieldLine,
  RiUserLine,
} from 'react-icons/ri';
import useAuth from '../hooks/useAuth';
import Button from '../../components/common/Button';
import './Auth.css';

const AdminLogin = () => {
  const { login } = useAuth();
  const navigate = useNavigate();

  const [form, setForm] = useState({ username: '', password: '' });
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handleChange = (e) => {
    setForm((prev) => ({ ...prev, [e.target.name]: e.target.value }));
    if (error) setError('');
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!form.username || !form.password) {
      setError('Please fill in all fields.');
      return;
    }
    try {
      setLoading(true);
      // Pass 'admin' role explicitly to hook and demo mock fallback
      await login(form.username, form.password, 'admin');
      navigate('/admin/dashboard');
    } catch (err) {
      setError(err?.message || 'Security verification failed. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="auth-page auth-page-centered">
      {/* Background */}
      <div className="auth-bg">
        <div className="auth-orb auth-orb-1" style={{ opacity: 0.3, background: 'radial-gradient(circle, #75070C, transparent)' }} />
        <div className="auth-orb auth-orb-2" style={{ opacity: 0.15, background: 'radial-gradient(circle, #FFEDAB, transparent)' }} />
        <div className="auth-grid" />
      </div>

      <div className="auth-single-card" style={{ borderColor: 'var(--primary-light)', boxShadow: '0 8px 30px var(--primary-glow)' }}>
        {/* Secure Brand Header */}
        <Link to="/" className="auth-brand auth-brand-centered">
          <div className="auth-logo" style={{ background: 'var(--gradient-primary)' }}>
            <RiShieldLine style={{ color: 'var(--secondary)' }} />
          </div>
          <span>EduPath <strong>AI</strong></span>
        </Link>

        <div className="auth-card-header" style={{ textAlign: 'center' }}>
          <h3 style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '8px' }}>
            Administrator Login
          </h3>
          <p>Secure access for the School Administrator only.</p>
        </div>

        {error && (
          <div className="auth-error" role="alert" style={{ textAlign: 'center' }}>
            ⚠️ {error}
          </div>
        )}

        <form className="auth-form" onSubmit={handleSubmit} noValidate>
          <div className="form-group">
            <label className="form-label" htmlFor="username">Username</label>
            <div className="input-wrapper">
              <RiUserLine className="input-icon" />
              <input
                id="username"
                type="text"
                name="username"
                value={form.username}
                onChange={handleChange}
                placeholder="Administrator username"
                className="form-input input-with-icon"
                autoComplete="username"
                required
              />
            </div>
          </div>

          <div className="form-group">
            <label className="form-label" htmlFor="password">Password</label>
            <div className="input-wrapper">
              <RiLockPasswordLine className="input-icon" />
              <input
                id="password"
                type={showPassword ? 'text' : 'password'}
                name="password"
                value={form.password}
                onChange={handleChange}
                placeholder="Secure password"
                className="form-input input-with-icon input-with-trail"
                autoComplete="current-password"
                required
              />
              <button
                type="button"
                className="input-trail-btn"
                onClick={() => setShowPassword((s) => !s)}
                aria-label="Toggle password visibility"
              >
                {showPassword ? <RiEyeOffLine /> : <RiEyeLine />}
              </button>
            </div>
          </div>

          <Button
            type="submit"
            variant="primary"
            size="lg"
            fullWidth
            loading={loading}
            icon={<RiShieldLine />}
            id="admin-login-submit-btn"
            style={{ background: 'var(--gradient-primary)', border: 'none' }}
          >
            {loading ? 'Verifying Security...' : 'Secure Login'}
          </Button>
        </form>

        <Link to="/login" className="auth-back-to-user-link">
          <RiArrowLeftLine /> Back to User Login
        </Link>
      </div>
    </div>
  );
};

export default AdminLogin;
