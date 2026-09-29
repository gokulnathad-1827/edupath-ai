import { useState, useEffect } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import {
  RiDashboardLine,
  RiUserLine,
  RiBrainLine,
  RiNotification3Line,
  RiMenuLine,
  RiCloseLine,
  RiLogoutBoxLine,
  RiSunLine,
  RiMoonLine,
} from 'react-icons/ri';
import useAuth from '../../pages/hooks/useAuth';
import { useTheme } from '../../pages/context/ThemeContext';
import './Navbar.css';

const Navbar = ({ onToggleSidebar, sidebarOpen }) => {
  const { user, logout, isAuthenticated } = useAuth();
  const { isDark, toggleTheme } = useTheme();
  const navigate = useNavigate();
  const location = useLocation();
  const [scrolled, setScrolled] = useState(false);
  const [notifOpen, setNotifOpen] = useState(false);
  const [profileOpen, setProfileOpen] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);

  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 20);
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  const displayName = user?.fullName || user?.name || 'User';
  const displayInitial = displayName.charAt(0).toUpperCase();
  const firstName = displayName.split(' ')[0];
  const isLandingPage = location.pathname === '/';

  return (
    <nav className={`navbar ${scrolled ? 'navbar-scrolled' : ''}`}>
      <div className="navbar-inner">
        {/* Left: Brand */}
        <div className="navbar-left">
          {isAuthenticated && (
            <button
              className="navbar-hamburger sidebar-toggle-btn"
              onClick={onToggleSidebar}
              aria-label="Toggle Sidebar"
            >
              {sidebarOpen ? <RiCloseLine /> : <RiMenuLine />}
            </button>
          )}
          <Link to="/" className="navbar-brand">
            <div className="navbar-logo">
              <RiBrainLine />
            </div>
            <span className="navbar-brand-name">EduPath <span>AI</span></span>
          </Link>
        </div>

        {/* Center: Nav links (landing only) */}
        {isLandingPage && (
          <ul className={`navbar-links ${menuOpen ? 'navbar-links-open' : ''}`}>
            <li><a href="#hero" onClick={() => setMenuOpen(false)}>Home</a></li>
            <li><a href="#features" onClick={() => setMenuOpen(false)}>Features</a></li>
            <li><a href="#how-it-works" onClick={() => setMenuOpen(false)}>How It Works</a></li>
            <li><a href="#user-roles" onClick={() => setMenuOpen(false)}>User Roles</a></li>
            <li><a href="#about" onClick={() => setMenuOpen(false)}>About</a></li>
            <li><a href="#footer" onClick={() => setMenuOpen(false)}>Contact</a></li>
            {!isAuthenticated && (
              <li className="mobile-auth-links">
                <Link to="/login" onClick={() => setMenuOpen(false)} className="btn-nav-primary" style={{ display: 'block', textAlign: 'center', margin: '8px 0' }}>Sign In</Link>
              </li>
            )}
          </ul>
        )}

        {/* Right: Actions */}
        <div className="navbar-right">
          {isLandingPage && (
            <button
              className="navbar-hamburger landing-menu-toggle"
              onClick={() => setMenuOpen(!menuOpen)}
              aria-label="Toggle Navigation"
            >
              {menuOpen ? <RiCloseLine /> : <RiMenuLine />}
            </button>
          )}
          {/* ── Theme Toggle ── */}
          <button
            id="theme-toggle-btn"
            className="navbar-icon-btn theme-toggle-btn"
            onClick={toggleTheme}
            aria-label={isDark ? 'Switch to light mode' : 'Switch to dark mode'}
            title={isDark ? 'Light Mode' : 'Dark Mode'}
          >
            {isDark ? <RiSunLine /> : <RiMoonLine />}
          </button>

          {isAuthenticated ? (
            <>
              {/* Notification Bell */}
              <div className="navbar-action-item">
                <button
                  id="notif-btn"
                  className="navbar-icon-btn"
                  onClick={() => { setNotifOpen(!notifOpen); setProfileOpen(false); }}
                  aria-label="Notifications"
                >
                  <RiNotification3Line />
                  <span className="notif-dot" aria-hidden="true" />
                </button>
                {notifOpen && (
                  <div className="navbar-dropdown notif-dropdown">
                    <p className="dropdown-title">Notifications</p>
                    <div className="notif-item">
                      <span className="notif-icon-sm">📅</span>
                      <div>
                        <p className="notif-text">Assignment due tomorrow</p>
                        <p className="notif-time">2 hours ago</p>
                      </div>
                    </div>
                    <div className="notif-item">
                      <span className="notif-icon-sm">🏆</span>
                      <div>
                        <p className="notif-text">New career recommendation ready</p>
                        <p className="notif-time">5 hours ago</p>
                      </div>
                    </div>
                    <Link
                      to={`/${user?.role || 'student'}/notifications`}
                      className="dropdown-view-all"
                      onClick={() => setNotifOpen(false)}
                    >
                      View all notifications →
                    </Link>
                  </div>
                )}
              </div>

              {/* Profile Avatar */}
              <div className="navbar-action-item">
                <button
                  id="profile-menu-btn"
                  className="navbar-avatar-btn"
                  onClick={() => { setProfileOpen(!profileOpen); setNotifOpen(false); }}
                  aria-label="Profile menu"
                >
                  <div className="navbar-avatar">
                    {displayInitial}
                  </div>
                  <div className="navbar-user-info">
                    <span className="navbar-username">{firstName}</span>
                    <span className="navbar-role">
                      {user?.role ? user.role.charAt(0).toUpperCase() + user.role.slice(1) : 'Student'}
                    </span>
                  </div>
                </button>
                {profileOpen && (
                  <div className="navbar-dropdown profile-dropdown">
                    <div className="dropdown-user-header">
                      <div className="dropdown-avatar">{displayInitial}</div>
                      <div>
                        <p className="dropdown-name">{displayName}</p>
                        <p className="dropdown-email">{user?.email}</p>
                      </div>
                    </div>
                    <div className="dropdown-divider" />
                    <Link to={`/${user?.role || 'student'}/profile`} className="dropdown-item" onClick={() => setProfileOpen(false)}>
                      <RiUserLine /> My Profile
                    </Link>
                    <Link to={`/${user?.role || 'student'}/dashboard`} className="dropdown-item" onClick={() => setProfileOpen(false)}>
                      <RiDashboardLine /> Dashboard
                    </Link>
                    <div className="dropdown-divider" />
                    <button
                      id="logout-btn"
                      className="dropdown-item dropdown-logout"
                      onClick={handleLogout}
                    >
                      <RiLogoutBoxLine /> Log Out
                    </button>
                  </div>
                )}
              </div>
            </>
          ) : (
            <div className="navbar-auth-btns">
              <Link to="/login" className="btn-nav-primary">Sign In</Link>
            </div>
          )}
        </div>
      </div>

      {/* Backdrop for dropdowns */}
      {(notifOpen || profileOpen) && (
        <div
          className="navbar-backdrop"
          onClick={() => { setNotifOpen(false); setProfileOpen(false); }}
        />
      )}
    </nav>
  );
};

export default Navbar;