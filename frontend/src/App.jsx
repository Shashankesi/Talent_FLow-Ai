import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { Toaster } from 'react-hot-toast';
import { useEffect, useState } from 'react';
import { useAuthStore } from './stores/authStore';

// Pages
import Landing from './pages/Landing';
import Signup from './pages/auth/Signup';
import Login from './pages/auth/Login';
import StudentDashboard from './pages/student/StudentDashboard';
import StudentProfile from './pages/student/StudentProfile';
import JobSearch from './pages/student/JobSearch';
import JobDetails from './pages/student/JobDetails';
import MyApplications from './pages/student/MyApplications';
import RecruiterDashboard from './pages/recruiter/RecruiterDashboard';
import PostJob from './pages/recruiter/PostJob';
import ViewApplicants from './pages/recruiter/ViewApplicants';
import NotFound from './pages/NotFound';

// Protected Route Component
const ProtectedRoute = ({ children, requiredRole }) => {
  const { isAuthenticated, role } = useAuthStore();

  // Not authenticated - redirect to login
  if (!isAuthenticated || !role) {
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
};

function App() {
  const { token, role } = useAuthStore();
  const [isDark, setIsDark] = useState(localStorage.getItem('theme') === 'dark');

  useEffect(() => {
    if (isDark) {
      document.documentElement.classList.add('dark');
      localStorage.setItem('theme', 'dark');
    } else {
      document.documentElement.classList.remove('dark');
      localStorage.setItem('theme', 'light');
    }
  }, [isDark]);

  return (
    <Router>
      <div className={isDark ? 'dark' : ''}>
        <Routes>
          {/* Public Routes */}
          <Route path="/" element={<Landing isDark={isDark} onToggleDark={() => setIsDark(!isDark)} />} />
          <Route path="/signup" element={<Signup />} />
          <Route path="/login" element={<Login />} />

          {/* Student Routes */}
          <Route
            path="/student/dashboard"
            element={
              <ProtectedRoute requiredRole="STUDENT">
                <StudentDashboard isDark={isDark} onToggleDark={() => setIsDark(!isDark)} />
              </ProtectedRoute>
            }
          />
          <Route
            path="/student/profile"
            element={
              <ProtectedRoute requiredRole="STUDENT">
                <StudentProfile isDark={isDark} onToggleDark={() => setIsDark(!isDark)} />
              </ProtectedRoute>
            }
          />
          <Route
            path="/student/jobs"
            element={
              <ProtectedRoute requiredRole="STUDENT">
                <JobSearch isDark={isDark} onToggleDark={() => setIsDark(!isDark)} />
              </ProtectedRoute>
            }
          />
          <Route
            path="/student/job/:id"
            element={
              <ProtectedRoute requiredRole="STUDENT">
                <JobDetails isDark={isDark} onToggleDark={() => setIsDark(!isDark)} />
              </ProtectedRoute>
            }
          />
          <Route
            path="/student/applications"
            element={
              <ProtectedRoute requiredRole="STUDENT">
                <MyApplications isDark={isDark} onToggleDark={() => setIsDark(!isDark)} />
              </ProtectedRoute>
            }
          />

          {/* Recruiter Routes */}
          <Route
            path="/recruiter/dashboard"
            element={
              <ProtectedRoute requiredRole="RECRUITER">
                <RecruiterDashboard isDark={isDark} onToggleDark={() => setIsDark(!isDark)} />
              </ProtectedRoute>
            }
          />
          <Route
            path="/recruiter/post-job"
            element={
              <ProtectedRoute requiredRole="RECRUITER">
                <PostJob isDark={isDark} onToggleDark={() => setIsDark(!isDark)} />
              </ProtectedRoute>
            }
          />
          <Route
            path="/recruiter/applicants/:jobId"
            element={
              <ProtectedRoute requiredRole="RECRUITER">
                <ViewApplicants isDark={isDark} onToggleDark={() => setIsDark(!isDark)} />
              </ProtectedRoute>
            }
          />

          {/* 404 Route */}
          <Route path="*" element={<NotFound />} />
        </Routes>
      </div>

      <Toaster position="top-right" />
    </Router>
  );
}

export default App;
