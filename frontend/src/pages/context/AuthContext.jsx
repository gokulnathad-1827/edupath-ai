import { createContext, useState, useEffect, useCallback } from 'react';
import { authService } from '../services/authService';

export const AuthContext = createContext(null);

const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [token, setToken] = useState(null);
  const [role, setRole] = useState(null);
  const [permissions, setPermissions] = useState([]);
  const [loading, setLoading] = useState(true);

  // Initialise from localStorage on mount
  useEffect(() => {
    const storedToken = localStorage.getItem('edupath_token');
    const storedUser  = localStorage.getItem('edupath_user');
    const storedRole  = localStorage.getItem('edupath_role');
    const storedPermissions = localStorage.getItem('edupath_permissions');
    if (storedToken && storedUser) {
      try {
        setToken(storedToken);
        const parsedUser = JSON.parse(storedUser);
        setUser(parsedUser);
        setRole(storedRole || parsedUser?.role || null);
        setPermissions(storedPermissions ? JSON.parse(storedPermissions) : (parsedUser?.permissions || []));
      } catch {
        localStorage.removeItem('edupath_token');
        localStorage.removeItem('edupath_user');
        localStorage.removeItem('edupath_role');
        localStorage.removeItem('edupath_permissions');
      }
    }
    setLoading(false);
  }, []);

  const login = useCallback(async (email, password) => {
    const data = await authService.login(email, password);
    const activeToken = data.token || 'token';
    const activeUser = data.user || {
      id: data.id,
      email: data.email || email,
      fullName: data.fullName || data.name || 'User',
      role: data.role || 'student',
    };
    const activeRole = (activeUser.role || data.role || '').toString().toLowerCase().replace('role_', '');
    const activePermissions = activeUser.permissions || data.permissions || [];

    setToken(activeToken);
    setUser(activeUser);
    setRole(activeRole);
    setPermissions(activePermissions);

    localStorage.setItem('edupath_token', activeToken);
    localStorage.setItem('edupath_user', JSON.stringify(activeUser));
    localStorage.setItem('edupath_role', activeRole);
    localStorage.setItem('edupath_permissions', JSON.stringify(activePermissions));

    return { token: activeToken, user: activeUser, role: activeRole };
  }, []);

  const register = useCallback(async (formData) => {
    const data = await authService.register(formData);
    const activeToken = data.token || 'token';
    const activeUser = data.user || {
      id: data.id,
      email: data.email || formData.email,
      fullName: data.name || formData.name || 'User',
      role: data.role || formData.role || 'student',
    };
    const activeRole = (activeUser.role || '').toString().toLowerCase().replace('role_', '');
    const activePermissions = activeUser.permissions || [];

    setToken(activeToken);
    setUser(activeUser);
    setRole(activeRole);
    setPermissions(activePermissions);

    localStorage.setItem('edupath_token', activeToken);
    localStorage.setItem('edupath_user', JSON.stringify(activeUser));
    localStorage.setItem('edupath_role', activeRole);
    localStorage.setItem('edupath_permissions', JSON.stringify(activePermissions));

    return { token: activeToken, user: activeUser, role: activeRole };
  }, []);

  const logout = useCallback(() => {
    setToken(null);
    setUser(null);
    setRole(null);
    setPermissions([]);
    localStorage.removeItem('edupath_token');
    localStorage.removeItem('edupath_user');
    localStorage.removeItem('edupath_role');
    localStorage.removeItem('edupath_permissions');
    sessionStorage.clear();
  }, []);

  const updateUser = useCallback((updatedUser) => {
    setUser(updatedUser);
    const normRole = (updatedUser?.role || '').toString().toLowerCase().replace('role_', '');
    setRole(normRole);
    setPermissions(updatedUser?.permissions || []);
    localStorage.setItem('edupath_user', JSON.stringify(updatedUser));
    localStorage.setItem('edupath_role', normRole);
    localStorage.setItem('edupath_permissions', JSON.stringify(updatedUser?.permissions || []));
  }, []);

  return (
    <AuthContext.Provider
      value={{
        user,
        token,
        role,
        permissions,
        loading,
        isAuthenticated: !!token && !!user,
        login,
        register,
        logout,
        updateUser,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export default AuthProvider;