import { Navigate, Outlet, useLocation } from 'react-router-dom';
import useAuth from '../hooks/useAuth';

/**
 * ProtectedRoute — wraps all portal routes.
 * Redirects to /login if the user is not authenticated or token is missing.
 * Checks that the user's role matches the requested sub-route prefix.
 * Shows a loading spinner while auth state is initialising.
 */
const ProtectedRoute = () => {
  const { isAuthenticated, token, user, loading } = useAuth();
  const location = useLocation();

  if (loading) {
    return (
      <div
        style={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          height: '100vh',
          background: 'var(--bg-base)',
        }}
      >
        <div className="spinner" />
      </div>
    );
  }

  const activeToken = token || localStorage.getItem('edupath_token');
  const storedUserRaw = localStorage.getItem('edupath_user');
  let activeUser = user;
  if (!activeUser && storedUserRaw) {
    try {
      activeUser = JSON.parse(storedUserRaw);
    } catch {
      activeUser = null;
    }
  }

  // 1. Verify User is logged in and token exists
  if (!activeToken || (!isAuthenticated && !storedUserRaw)) {
    return <Navigate to="/login" state={{ from: location }} replace />;
  }

  // 2. Normalize user role for comparison (e.g. ROLE_ADMIN -> admin)
  const userRole = (activeUser?.role || localStorage.getItem('edupath_role') || '')
    .toString()
    .toLowerCase()
    .replace('role_', '')
    .trim();

  const path = location.pathname;

  if (path.startsWith('/student') && userRole !== 'student') {
    return <Navigate to="/login" replace />;
  }
  if (path.startsWith('/teacher') && userRole !== 'teacher') {
    return <Navigate to="/login" replace />;
  }
  if (path.startsWith('/admin') && userRole !== 'admin') {
    return <Navigate to="/login" replace />;
  }
  if (path.startsWith('/parent') && userRole !== 'parent') {
    return <Navigate to="/login" replace />;
  }
  if (path.startsWith('/counselor') && userRole !== 'counselor') {
    return <Navigate to="/login" replace />;
  }

  return <Outlet />;
};

export default ProtectedRoute;
