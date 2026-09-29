import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import {
  RiBrainLine,
  RiUserLine,
  RiMailLine,
  RiLockPasswordLine,
  RiEyeLine,
  RiEyeOffLine,
  RiArrowRightLine,
  RiPhoneLine,
  RiUserSharedLine,
  RiCheckboxCircleLine,
} from 'react-icons/ri';
import { authApi } from '../../services/authApi';
import Button from '../../components/common/Button';
import './Auth.css';

const ROLE_OPTIONS = [
  { label: 'Student', value: 'ROLE_STUDENT' },
  { label: 'Teacher', value: 'ROLE_TEACHER' },
  { label: 'Parent', value: 'ROLE_PARENT' },
  { label: 'Counselor', value: 'ROLE_COUNSELOR' },
];

const Register = () => {
  const navigate = useNavigate();

  const [form, setForm] = useState({
    fullName: '',
    email: '',
    phoneNumber: '',
    password: '',
    confirmPassword: '',
    roleName: 'ROLE_STUDENT',
  });

  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');

  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm((prev) => ({ ...prev, [name]: value }));
    if (error) setError('');
    if (success) setSuccess('');
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    // Client-side Validation
    if (!form.fullName || !form.fullName.trim()) {
      setError('Please enter your full name.');
      return;
    }
    if (!form.email || !form.email.trim()) {
      setError('Please enter your email address.');
      return;
    }
    if (!/\S+@\S+\.\S+/.test(form.email.trim())) {
      setError('Please enter a valid email address.');
      return;
    }
    if (!form.phoneNumber || !form.phoneNumber.trim()) {
      setError('Please enter your phone number.');
      return;
    }
    if (!form.password) {
      setError('Please enter a password.');
      return;
    }
    if (form.password.length < 6) {
      setError('Password must be at least 6 characters long.');
      return;
    }
    if (form.password !== form.confirmPassword) {
      setError('Password and Confirm Password must match.');
      return;
    }
    if (!form.roleName) {
      setError('Please select a role.');
      return;
    }

    try {
      setLoading(true);
      setError('');

      // Send POST http://localhost:8081/auth/register via authApi
      await authApi.register({
        fullName: form.fullName.trim(),
        email: form.email.trim(),
        password: form.password,
        phoneNumber: form.phoneNumber.trim(),
        roleName: form.roleName,
      });

      setSuccess('Account created successfully');

      // Redirect to /login after 1.5s so user can read the success notice
      setTimeout(() => {
        navigate('/login', { replace: true });
      }, 1500);
    } catch (err) {
      const apiErrorMsg =
        err?.message ||
        err?.response?.data?.message ||
        'Registration failed. Please try again.';
      setError(apiErrorMsg);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="auth-page">
      <div className="auth-bg">
        <div className="auth-orb auth-orb-1" />
        <div className="auth-orb auth-orb-2" />
        <div className="auth-grid" />
      </div>

      <div className="auth-container">
        {/* LEFT BRANDING SECTION */}
        <div className="auth-left">
          <Link to="/" className="auth-brand">
            <div className="auth-logo"><RiBrainLine /></div>
            <span>EduPath <strong>AI</strong></span>
          </Link>

          <div className="auth-left-content">
            <h2>Join EduPath AI Platform 🚀</h2>
            <p>
              Create your account to access personalized AI career recommendations,
              academic analytics, attendance management, and school collaboration tools.
            </p>

            <div className="auth-benefits">
              {[
                'Access personalized role-based dashboard',
                'AI-driven career assessment & growth insights',
                'Real-time academic & attendance tracking',
                'Seamless communication between students, teachers, parents, and counselors',
              ].map((feat) => (
                <div key={feat} className="auth-benefit-item">
                  <RiCheckboxCircleLine className="auth-benefit-check-icon" style={{ color: 'var(--secondary)', fontSize: '1.2rem' }} />
                  <span>{feat}</span>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* RIGHT REGISTRATION FORM SECTION */}
        <div className="auth-right">
          <div className="auth-card" style={{ maxWidth: '440px' }}>
            <div className="auth-card-header">
              <h3>Create Account</h3>
              <p>Sign up to get started with EduPath AI</p>
            </div>

            {error && (
              <div className="auth-error" role="alert">
                ⚠️ {error}
              </div>
            )}

            {success && (
              <div className="auth-success" style={{
                padding: '12px 16px',
                background: 'rgba(22, 163, 74, 0.1)',
                border: '1.5px solid rgba(22, 163, 74, 0.3)',
                borderRadius: 'var(--radius-md)',
                fontSize: '0.875rem',
                color: 'var(--accent-success)',
                fontWeight: 600,
                textAlign: 'center',
              }} role="status">
                ✅ {success}
              </div>
            )}

            <form className="auth-form" onSubmit={handleSubmit} noValidate>
              {/* Full Name */}
              <div className="form-group">
                <label className="form-label" htmlFor="reg-fullname">Full Name *</label>
                <div className="input-wrapper">
                  <RiUserLine className="input-icon" />
                  <input
                    id="reg-fullname"
                    type="text"
                    name="fullName"
                    value={form.fullName}
                    onChange={handleChange}
                    placeholder="Enter your full name"
                    className="form-input input-with-icon"
                    disabled={loading}
                    required
                  />
                </div>
              </div>

              {/* Email Address */}
              <div className="form-group">
                <label className="form-label" htmlFor="reg-email">Email Address *</label>
                <div className="input-wrapper">
                  <RiMailLine className="input-icon" />
                  <input
                    id="reg-email"
                    type="email"
                    name="email"
                    value={form.email}
                    onChange={handleChange}
                    placeholder="name@edupath.com"
                    className="form-input input-with-icon"
                    autoComplete="email"
                    disabled={loading}
                    required
                  />
                </div>
              </div>

              {/* Phone Number */}
              <div className="form-group">
                <label className="form-label" htmlFor="reg-phone">Phone Number *</label>
                <div className="input-wrapper">
                  <RiPhoneLine className="input-icon" />
                  <input
                    id="reg-phone"
                    type="tel"
                    name="phoneNumber"
                    value={form.phoneNumber}
                    onChange={handleChange}
                    placeholder="9876543210"
                    className="form-input input-with-icon"
                    disabled={loading}
                    required
                  />
                </div>
              </div>

              {/* Role Selection Dropdown */}
              <div className="form-group">
                <label className="form-label" htmlFor="reg-role">Role *</label>
                <div className="input-wrapper">
                  <RiUserSharedLine className="input-icon" />
                  <select
                    id="reg-role"
                    name="roleName"
                    value={form.roleName}
                    onChange={handleChange}
                    className="form-input input-with-icon"
                    disabled={loading}
                    style={{ appearance: 'auto', cursor: 'pointer' }}
                    required
                  >
                    {ROLE_OPTIONS.map((opt) => (
                      <option key={opt.value} value={opt.value}>
                        {opt.label}
                      </option>
                    ))}
                  </select>
                </div>
              </div>

              {/* Password */}
              <div className="form-group">
                <label className="form-label" htmlFor="reg-password">Password *</label>
                <div className="input-wrapper">
                  <RiLockPasswordLine className="input-icon" />
                  <input
                    id="reg-password"
                    type={showPassword ? 'text' : 'password'}
                    name="password"
                    value={form.password}
                    onChange={handleChange}
                    placeholder="Min 6 characters"
                    className="form-input input-with-icon input-with-trail"
                    autoComplete="new-password"
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

              {/* Confirm Password */}
              <div className="form-group">
                <label className="form-label" htmlFor="reg-confirm-password">Confirm Password *</label>
                <div className="input-wrapper">
                  <RiLockPasswordLine className="input-icon" />
                  <input
                    id="reg-confirm-password"
                    type="password"
                    name="confirmPassword"
                    value={form.confirmPassword}
                    onChange={handleChange}
                    placeholder="Repeat password"
                    className="form-input input-with-icon"
                    autoComplete="new-password"
                    disabled={loading}
                    required
                  />
                </div>
              </div>

              {/* Submit Button */}
              <Button
                type="submit"
                variant="primary"
                size="lg"
                fullWidth
                loading={loading}
                disabled={loading}
                icon={<RiArrowRightLine />}
                id="register-submit-btn"
              >
                {loading ? 'Creating Account...' : 'Create Account'}
              </Button>
            </form>

            <div className="auth-divider" style={{ margin: '16px 0 12px 0', borderTop: '1px solid var(--border-card)' }} />

            {/* Already Have An Account */}
            <p className="auth-switch" style={{ textAlign: 'center', fontSize: '0.9rem' }}>
              Already have an account?{' '}
              <Link to="/login" className="auth-switch-link" id="login-redirect-link">
                Sign In
              </Link>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Register;