import React, { useState, useEffect, useContext } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import {
  RiBrainLine as BrainIcon,
  RiMailLine as MailIcon,
  RiLockPasswordLine as LockIcon,
  RiEyeLine as EyeIcon,
  RiEyeOffLine as EyeOffIcon,
  RiArrowRightLine as ArrowRightIcon,
  RiArrowLeftLine as ArrowLeftIcon,
} from 'react-icons/ri';
import {
  FaUserShield,
  FaUserGraduate,
  FaUsers,
  FaRobot,
  FaUserCheck,
} from 'react-icons/fa';
import { AuthContext } from '../context/AuthContext';
import { authService } from '../services/authService';
import Button from '../../components/common/Button';
import './Auth.css';

const ROLE_CONFIGS = {
  student: {
    key: 'student',
    expectedRole: 'ROLE_STUDENT',
    title: 'Student Portal',
    subtitle: 'Sign in to access your attendance, academic grades, and AI career insights.',
    icon: <FaUserGraduate />,
    badgeText: 'STUDENT LOGIN',
    placeholderEmail: 'student@edupath.com',
    redirectPath: '/student/dashboard',
    accentClass: 'portal-accent-student',
  },
  teacher: {
    key: 'teacher',
    expectedRole: 'ROLE_TEACHER',
    title: 'Teacher Portal',
    subtitle: 'Sign in to log attendance, enter student marks, and manage subject analytics.',
    icon: <FaUserCheck />,
    badgeText: 'TEACHER LOGIN',
    placeholderEmail: 'teacher@edupath.com',
    redirectPath: '/teacher/dashboard',
    accentClass: 'portal-accent-teacher',
  },
  parent: {
    key: 'parent',
    expectedRole: 'ROLE_PARENT',
    title: 'Parent Portal',
    subtitle: "Sign in to track your child's attendance safety margin and academic progress.",
    icon: <FaUsers />,
    badgeText: 'PARENT LOGIN',
    placeholderEmail: 'parent@edupath.com',
    redirectPath: '/parent/dashboard',
    accentClass: 'portal-accent-parent',
  },
  counselor: {
    key: 'counselor',
    expectedRole: 'ROLE_COUNSELOR',
    title: 'Counselor Portal',
    subtitle: 'Sign in to review prioritized at-risk students and schedule guidance sessions.',
    icon: <FaRobot />,
    badgeText: 'COUNSELOR LOGIN',
    placeholderEmail: 'counselor@edupath.com',
    redirectPath: '/counselor/dashboard',
    accentClass: 'portal-accent-counselor',
  },
  admin: {
    key: 'admin',
    expectedRole: 'ROLE_ADMIN',
    title: 'Administrator Portal',
    subtitle: 'Sign in for system-wide configuration, course paths, and active rosters.',
    icon: <FaUserShield />,
    badgeText: 'ADMIN LOGIN',
    placeholderEmail: 'admin@edupath.com',
    redirectPath: '/admin/dashboard',
    accentClass: 'portal-accent-admin',
  },
};

const RoleLogin = ({ role = 'student' }) => {
  const navigate = useNavigate();
  const authCtx = useContext(AuthContext);

  const config = ROLE_CONFIGS[role.toLowerCase()] || ROLE_CONFIGS.student;

  const [form, setForm] = useState({ email: '', password: '' });
  const [showPassword, setShowPassword] = useState(false);
  const [rememberMe, setRememberMe] = useState(false);
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

  const verifyAndLogin = async (e) => {
    e.preventDefault();
    if (!form.email || !form.password) {
      setError('Please fill in all fields.');
      return;
    }

    try {
      setLoading(true);
      setError('');

      // Call backend POST /api/auth/login with { email, password }
      const res = await authService.login(form.email, form.password);

      // Determine returned role from backend response
      const returnedRoleStr = (res.role || res.user?.role || '').toString().trim();

      // Normalize role comparison
      const normReturned = returnedRoleStr.toUpperCase().replace('ROLE_', '');
      const normExpected = config.expectedRole.toUpperCase().replace('ROLE_', '');

      if (!returnedRoleStr || normReturned !== normExpected) {
        // Strict requirement: Wrong role rejection
        setError('This account does not belong to this portal.');
        setLoading(false);
        return;
      }

      // Successful login -> store in localStorage
      const userObj = res.user || {
        id: res.id,
        email: res.email,
        fullName: res.fullName,
        role: returnedRoleStr,
      };

      localStorage.setItem('edupath_token', res.token || 'demo_token');
      localStorage.setItem('edupath_user', JSON.stringify(userObj));
      localStorage.setItem('edupath_role', returnedRoleStr);

      // Optionally refresh context state
      if (authCtx?.updateUser) {
        authCtx.updateUser(userObj);
      }

      // Automatically redirect to role dashboard
      navigate(config.redirectPath, { replace: true });
    } catch (err) {
      setError(err?.message || 'Invalid credentials or login failure.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className={`auth-page ${config.accentClass}`}>
      {/* Background */}
      <div className="auth-bg">
        <div className="auth-orb auth-orb-1" />
        <div className="auth-orb auth-orb-2" />
        <div className="auth-grid" />
      </div>

      <div className="auth-container">
        {/* Left branding panel */}
        <div className="auth-left">
          <Link to="/" className="auth-brand">
            <div className="auth-logo"><BrainIcon /></div>
            <span>EduPath <strong>AI</strong></span>
          </Link>
          <div className="auth-left-content">
            <div className="role-portal-badge">
              <span className="role-portal-icon">{config.icon}</span>
              <span>{config.badgeText}</span>
            </div>
            <h2>{config.title}</h2>
            <p>{config.subtitle}</p>
            <div className="auth-benefits">
              {['Attendance Tracking', 'Academic Performance', 'AI-Driven Alerts', 'Role Authorization'].map((b) => (
                <div key={b} className="auth-benefit-item">
                  <span className="auth-benefit-dot" />
                  {b}
                </div>
              ))}
            </div>
          </div>
          <div className="auth-back-portal">
            <Link to="/login" className="auth-back-link">
              <ArrowLeftIcon /> Choose another portal
            </Link>
          </div>
        </div>

        {/* Right panel: form */}
        <div className="auth-right">
          <div className="auth-card">
            <div className="auth-card-header">
              <div className="role-avatar-icon">{config.icon}</div>
              <h3>Sign In to {config.title}</h3>
              <p>Enter your account credentials to continue</p>
            </div>

            {error && (
              <div className="auth-error" role="alert">
                ⚠️ {error}
              </div>
            )}

            <form className="auth-form" onSubmit={verifyAndLogin} noValidate>
              <div className="form-group">
                <label className="form-label" htmlFor="email">Email Address</label>
                <div className="input-wrapper">
                  <MailIcon className="input-icon" />
                  <input
                    id="email"
                    type="email"
                    name="email"
                    value={form.email}
                    onChange={handleChange}
                    placeholder={config.placeholderEmail}
                    className="form-input input-with-icon"
                    autoComplete="email"
                    required
                  />
                </div>
              </div>

              <div className="form-group">
                <label className="form-label" htmlFor="password">Password</label>
                <div className="input-wrapper">
                  <LockIcon className="input-icon" />
                  <input
                    id="password"
                    type={showPassword ? 'text' : 'password'}
                    name="password"
                    value={form.password}
                    onChange={handleChange}
                    placeholder="Enter your password"
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
                    {showPassword ? <EyeOffIcon /> : <EyeIcon />}
                  </button>
                </div>
              </div>

              <div className="auth-remember-row">
                <label className="auth-checkbox-label" htmlFor="remember-me">
                  <input
                    id="remember-me"
                    type="checkbox"
                    checked={rememberMe}
                    onChange={(e) => setRememberMe(e.target.checked)}
                  />
                  <span>Remember Me</span>
                </label>
                <Link to="/forgot-password" className="auth-forgot-link">Forgot Password?</Link>
              </div>

              <Button
                type="submit"
                variant="primary"
                size="lg"
                fullWidth
                loading={loading}
                icon={<ArrowRightIcon />}
                id="role-login-submit-btn"
              >
                {loading ? 'Authenticating...' : `Sign In as ${config.badgeText.split(' ')[0]}`}
              </Button>
            </form>

            <p className="auth-switch" style={{ marginTop: '16px' }}>
              New to EduPath AI?{' '}
              <Link to="/register" className="auth-switch-link">Create your account</Link>
            </p>

            <div className="auth-switch-portal-footer">
              <span>Wrong portal? </span>
              <Link to="/login" className="auth-switch-link">Select different portal</Link>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default RoleLogin;
