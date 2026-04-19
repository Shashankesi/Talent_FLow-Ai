import { useNavigate, useLocation } from 'react-router-dom';
import { motion } from 'framer-motion';
import { FiMenu, FiX, FiMoon, FiSun, FiLogOut } from 'react-icons/fi';
import { useState } from 'react';
import { useAuthStore } from '../stores/authStore';

export default function Navbar({ isDark, onToggleDark }) {
  const navigate = useNavigate();
  const location = useLocation();
  const { isAuthenticated, role, logout, user } = useAuthStore();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const handleLogout = () => {
    logout();
    navigate('/');
  };

  const navLinks = isAuthenticated
    ? role === 'STUDENT'
      ? [
          { label: 'Dashboard', path: '/student/dashboard' },
          { label: 'Search Jobs', path: '/student/jobs' },
          { label: 'Applications', path: '/student/applications' },
          { label: 'Profile', path: '/student/profile' },
        ]
      : [
          { label: 'Dashboard', path: '/recruiter/dashboard' },
          { label: 'Post Job', path: '/recruiter/post-job' },
        ]
    : [];

  return (
    <nav className="fixed top-0 left-0 right-0 z-50 bg-white/80 dark:bg-dark-secondary/80 backdrop-blur-md border-b border-gray-200 dark:border-gray-700">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          {/* Logo */}
          <motion.button
            whileHover={{ scale: 1.05 }}
            onClick={() => navigate('/')}
            className="flex items-center gap-2"
          >
            <div className="w-8 h-8 rounded-lg bg-gradient-to-r from-primary to-secondary"></div>
            <span className="font-bold text-xl hidden sm:block">TalentFlow AI</span>
          </motion.button>

          {/* Desktop Navigation */}
          <div className="hidden md:flex items-center gap-8">
            {navLinks.map((link) => (
              <motion.button
                key={link.path}
                onClick={() => navigate(link.path)}
                className={`font-medium transition ${
                  location.pathname === link.path
                    ? 'text-primary border-b-2 border-primary'
                    : 'text-gray-600 dark:text-gray-400 hover:text-primary'
                }`}
              >
                {link.label}
              </motion.button>
            ))}
          </div>

          {/* Right Section */}
          <div className="flex items-center gap-4">
            {/* Theme Toggle */}
            <motion.button
              whileHover={{ scale: 1.1 }}
              whileTap={{ scale: 0.9 }}
              onClick={onToggleDark}
              className="p-2 rounded-lg bg-gray-100 dark:bg-dark hover:bg-gray-200 dark:hover:bg-dark"
            >
              {isDark ? (
                <FiSun className="text-yellow-400" />
              ) : (
                <FiMoon className="text-gray-600" />
              )}
            </motion.button>

            {/* Auth Buttons */}
            {isAuthenticated ? (
              <>
                <div className="hidden sm:block text-sm">
                  <p className="font-medium">{user?.fullName}</p>
                  <p className="text-xs text-gray-600 dark:text-gray-400">{role}</p>
                </div>
                <motion.button
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  onClick={handleLogout}
                  className="p-2 rounded-lg hover:bg-gray-100 dark:hover:bg-dark transition"
                >
                  <FiLogOut className="text-xl text-red-600" />
                </motion.button>
              </>
            ) : (
              <div className="hidden sm:flex gap-3">
                <motion.button
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  onClick={() => navigate('/login')}
                  className="btn-secondary"
                >
                  Sign In
                </motion.button>
                <motion.button
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  onClick={() => navigate('/signup')}
                  className="btn-primary"
                >
                  Sign Up
                </motion.button>
              </div>
            )}

            {/* Mobile Menu */}
            <motion.button
              whileHover={{ scale: 1.1 }}
              whileTap={{ scale: 0.9 }}
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="md:hidden p-2 rounded-lg hover:bg-gray-100 dark:hover:bg-dark"
            >
              {mobileMenuOpen ? <FiX /> : <FiMenu />}
            </motion.button>
          </div>
        </div>

        {/* Mobile Menu */}
        {mobileMenuOpen && (
          <motion.div
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            className="md:hidden pb-4 space-y-2"
          >
            {navLinks.map((link) => (
              <motion.button
                key={link.path}
                onClick={() => {
                  navigate(link.path);
                  setMobileMenuOpen(false);
                }}
                className="block w-full text-left px-4 py-2 rounded-lg hover:bg-gray-100 dark:hover:bg-dark transition font-medium"
              >
                {link.label}
              </motion.button>
            ))}
            {!isAuthenticated && (
              <>
                <motion.button
                  onClick={() => {
                    navigate('/login');
                    setMobileMenuOpen(false);
                  }}
                  className="block w-full text-left px-4 py-2 btn-secondary"
                >
                  Sign In
                </motion.button>
                <motion.button
                  onClick={() => {
                    navigate('/signup');
                    setMobileMenuOpen(false);
                  }}
                  className="block w-full text-left px-4 py-2 btn-primary"
                >
                  Sign Up
                </motion.button>
              </>
            )}
          </motion.div>
        )}
      </div>
    </nav>
  );
}
