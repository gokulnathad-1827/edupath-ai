import React from 'react';
import { Link } from 'react-router-dom';
import {
  FaUserShield,
  FaUserGraduate,
  FaUsers,
  FaRobot,
  FaUserCheck,
  FaArrowRight,
} from 'react-icons/fa';
import { RiBrainLine } from 'react-icons/ri';
import './Auth.css';

const portals = [
  {
    id: 'admin',
    title: 'Administrator Portal',
    role: 'Admin',
    path: '/admin/login',
    icon: <FaUserShield />,
    description: 'Manage institution-wide configurations, academic rosters, and global analytics.',
    colorClass: 'portal-accent-admin',
  },
  {
    id: 'teacher',
    title: 'Teacher Portal',
    role: 'Teacher',
    path: '/teacher/login',
    icon: <FaUserCheck />,
    description: 'Log attendance, register marks, track subject performance, and send class alerts.',
    colorClass: 'portal-accent-teacher',
  },
  {
    id: 'student',
    title: 'Student Portal',
    role: 'Student',
    path: '/student/login',
    icon: <FaUserGraduate />,
    description: 'View academic progress, attendance records, notifications, and AI career guidance.',
    colorClass: 'portal-accent-student',
  },
  {
    id: 'parent',
    title: 'Parent Portal',
    role: 'Parent',
    path: '/parent/login',
    icon: <FaUsers />,
    description: "Monitor child's attendance safety margins, exam scores, and school communication.",
    colorClass: 'portal-accent-parent',
  },
  {
    id: 'counselor',
    title: 'Counselor Portal',
    role: 'Counselor',
    path: '/counselor/login',
    icon: <FaRobot />,
    description: 'Review prioritized at-risk student lists, schedule sessions, and log guidance notes.',
    colorClass: 'portal-accent-counselor',
  },
];

const PortalSelection = () => {
  return (
    <div className="portal-selection-page">
      {/* Dynamic Ambient Background */}
      <div className="auth-bg">
        <div className="auth-orb auth-orb-1" />
        <div className="auth-orb auth-orb-2" />
        <div className="auth-grid" />
      </div>

      <div className="portal-selection-container">
        {/* Header Branding */}
        <header className="portal-header">
          <Link to="/" className="auth-brand">
            <div className="auth-logo"><RiBrainLine /></div>
            <span>EduPath <strong>AI</strong></span>
          </Link>
          <h1 className="portal-title">Select Your Portal</h1>
          <p className="portal-subtitle">
            Choose your assigned role to log in to your dedicated EduPath AI workspace.
          </p>
        </header>

        {/* Portals Grid */}
        <div className="portals-grid">
          {portals.map((portal) => (
            <Link key={portal.id} to={portal.path} className={`portal-card ${portal.colorClass}`}>
              <div className="portal-card-badge">{portal.role}</div>
              <div className="portal-icon-wrapper">
                {portal.icon}
              </div>
              <h3 className="portal-card-title">{portal.title}</h3>
              <p className="portal-card-desc">{portal.description}</p>
              <div className="portal-card-footer">
                <span>Continue</span>
                <FaArrowRight className="portal-arrow" />
              </div>
            </Link>
          ))}
        </div>

        {/* Footer Note */}
        <footer className="portal-footer">
          <p>Need help logging in? Contact your institution system administrator.</p>
        </footer>
      </div>
    </div>
  );
};

export default PortalSelection;
