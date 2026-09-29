import { useContext } from 'react';
import { AuthContext } from '../context/AuthContext';

/**
 * useAuth — consume the AuthContext in any component.
 * Throws if used outside <AuthProvider>.
 */
const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};

export default useAuth;