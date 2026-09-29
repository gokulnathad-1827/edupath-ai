import { NavLink, useNavigate } from 'react-router-dom';
import {
  RiDashboardLine,
  RiUserLine,
  RiCompassDiscoverLine,
  RiLightbulbFlashLine,
  RiCalendarCheckLine,
  RiBarChartBoxLine,
  RiNotification3Line,
  RiLogoutBoxLine,
  RiBrainLine,
  RiCloseLine,
  RiFileTextLine,
  RiTeamLine,
} from 'react-icons/ri';
import useAuth from '../../pages/hooks/useAuth';
import './Sidebar.css';

const studentNavItems = [
  { to: '/student/dashboard',            icon: <RiDashboardLine />,         label: 'Dashboard' },
  { to: '/student/career-assessment',    icon: <RiCompassDiscoverLine />,   label: 'Assessment' },
  { to: '/student/career-recommendation',icon: <RiLightbulbFlashLine />,    label: 'Career Recommendation' },
  { to: '/student/attendance',           icon: <RiCalendarCheckLine />,     label: 'Attendance' },
  { to: '/student/performance',          icon: <RiBarChartBoxLine />,       label: 'Performance' },
  { to: '/student/notifications',        icon: <RiNotification3Line />,     label: 'Notifications' },
  { to: '/student/profile',              icon: <RiUserLine />,               label: 'Profile' },
];

const teacherNavItems = [
  { to: '/teacher/dashboard',            icon: <RiDashboardLine />,         label: 'Dashboard' },
  { to: '/teacher/students',             icon: <RiUserLine />,              label: 'Students' },
  { to: '/teacher/attendance',           icon: <RiCalendarCheckLine />,     label: 'Attendance' },
  { to: '/teacher/marks',                icon: <RiBarChartBoxLine />,       label: 'Marks' },
  { to: '/teacher/reports',              icon: <RiFileTextLine />,          label: 'Reports' },
  { to: '/teacher/notifications',        icon: <RiNotification3Line />,     label: 'Notifications' },
  { to: '/teacher/profile',              icon: <RiUserLine />,               label: 'Profile' },
];

const adminNavItems = [
  { to: '/admin/dashboard',              icon: <RiDashboardLine />,         label: 'Dashboard' },
  { to: '/admin/students',               icon: <RiUserLine />,              label: 'Students' },
  { to: '/admin/teachers',               icon: <RiTeamLine />,              label: 'Teachers' },
  { to: '/admin/classes',                icon: <RiCompassDiscoverLine />,   label: 'Classes' },
  { to: '/admin/sessions',               icon: <RiCalendarCheckLine />,     label: 'Sessions' },
  { to: '/admin/analytics',              icon: <RiBarChartBoxLine />,       label: 'Analytics' },
  { to: '/admin/reports',                icon: <RiFileTextLine />,          label: 'Reports' },
  { to: '/admin/notifications',          icon: <RiNotification3Line />,     label: 'Notifications' },
];

const parentNavItems = [
  { to: '/parent/dashboard',             icon: <RiDashboardLine />,         label: 'Dashboard' },
  { to: '/parent/child-progress',        icon: <RiBarChartBoxLine />,       label: 'Child Progress' },
  { to: '/parent/attendance',            icon: <RiCalendarCheckLine />,     label: 'Attendance' },
  { to: '/parent/performance',           icon: <RiBarChartBoxLine />,       label: 'Performance' },
  { to: '/parent/notifications',         icon: <RiNotification3Line />,     label: 'Notifications' },
  { to: '/parent/profile',               icon: <RiUserLine />,               label: 'Profile' },
];

const counselorNavItems = [
  { to: '/counselor/dashboard',          icon: <RiDashboardLine />,         label: 'Dashboard' },
  { to: '/counselor/at-risk',            icon: <RiCompassDiscoverLine />,   label: 'At Risk Students' },
  { to: '/counselor/sessions',           icon: <RiBarChartBoxLine />,       label: 'Sessions' },
  { to: '/counselor/reports',            icon: <RiFileTextLine />,          label: 'Reports' },
  { to: '/counselor/notifications',      icon: <RiNotification3Line />,     label: 'Notifications' },
  { to: '/counselor/profile',            icon: <RiUserLine />,               label: 'Profile' },
];

const Sidebar = ({ isOpen, onClose, role }) => {
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  const currentRole = role || user?.role || 'student';

  const getNavItems = () => {
    switch (currentRole) {
      case 'admin':
        return adminNavItems;
      case 'teacher':
        return teacherNavItems;
      case 'counselor':
        return counselorNavItems;
      case 'parent':
        return parentNavItems;
      case 'student':
      default:
        return studentNavItems;
    }
  };

  const activeNavItems = getNavItems();

  return (
    <>
      {/* Mobile overlay */}
      {isOpen && <div className="sidebar-overlay" onClick={onClose} />}

      <aside className={`sidebar ${isOpen ? 'sidebar-open' : ''}`}>
        {/* Logo */}
        <div className="sidebar-brand">
          <div className="sidebar-logo">
            <RiBrainLine />
          </div>
          <span className="sidebar-brand-text">EduPath <span>AI</span></span>
          <button
            className="sidebar-close-btn"
            onClick={onClose}
            aria-label="Close sidebar"
          >
            <RiCloseLine />
          </button>
        </div>

        {/* User card */}
        {(() => {
          const displayName = user?.fullName || user?.name || `${currentRole.charAt(0).toUpperCase() + currentRole.slice(1)}`;
          const displayInitial = displayName.charAt(0).toUpperCase();
          return (
            <div className="sidebar-student-card">
              <div className="sidebar-student-avatar">
                {displayInitial}
              </div>
              <div className="sidebar-student-info">
                <p className="sidebar-student-name">{displayName}</p>
                <p className="sidebar-student-id">
                  {currentRole === 'student'
                    ? `ID: ${user?.studentId || user?.student_id || user?.rollNumber || 'STU-001'}`
                    : (user?.role || currentRole).toUpperCase()}
                </p>
              </div>
            </div>
          );
        })()}

        {/* Navigation */}
        <nav className="sidebar-nav">
          <ul className="sidebar-nav-list">
            {activeNavItems.map((item) => (
              <li key={item.to}>
                <NavLink
                  to={item.to}
                  className={({ isActive }) =>
                    `sidebar-nav-item ${isActive ? 'sidebar-nav-active' : ''}`
                  }
                  onClick={onClose}
                >
                  <span className="sidebar-nav-icon">{item.icon}</span>
                  <span className="sidebar-nav-text">{item.label}</span>
                  <span className="sidebar-nav-indicator" />
                </NavLink>
              </li>
            ))}
          </ul>
        </nav>

        {/* Bottom: Logout */}
        <div className="sidebar-footer">
          <button
            id="sidebar-logout-btn"
            className="sidebar-logout-btn"
            onClick={handleLogout}
          >
            <RiLogoutBoxLine />
            <span>Logout</span>
          </button>
          <p className="sidebar-version">EduPath AI v1.0</p>
        </div>
      </aside>
    </>
  );
};

export default Sidebar;