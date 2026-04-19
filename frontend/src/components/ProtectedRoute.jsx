import { Navigate } from 'react-router-dom';
import { useAuthStore } from '../stores/authStore';

/**
 * ProtectedRoute Component
 * Handles role-based route protection and redirection
 */
export default function ProtectedRoute({ children, requiredRole }) {
  const { token, role } = useAuthStore();

  // Not authenticated - redirect to login
  if (!token) {
    return <Navigate to="/login" replace />;
  }

  // Authenticated but wrong role
  if (requiredRole && role !== requiredRole) {
    // Redirect to appropriate dashboard based on actual role
    if (role === 'STUDENT') {
      return <Navigate to="/student/dashboard" replace />;
    } else if (role === 'RECRUITER') {
      return <Navigate to="/recruiter/dashboard" replace />;
    }
    return <Navigate to="/login" replace />;
  }

  return children;
}
