import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { FiMail, FiLock, FiUser, FiPhone } from 'react-icons/fi';
import toast from 'react-hot-toast';
import { authService } from '../../services/api';
import { useAuthStore } from '../../stores/authStore';

export default function Signup() {
  const navigate = useNavigate();
  const { login } = useAuthStore();
  const [role, setRole] = useState(null);
  const [formData, setFormData] = useState({
    fullName: '',
    email: '',
    password: '',
    confirmPassword: '',
    phone: '',
  });
  const [loading, setLoading] = useState(false);

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const handleSignup = async (e) => {
    e.preventDefault();

    // Validation
    if (!role) {
      toast.error('Please select a role');
      return;
    }

    if (!formData.fullName.trim()) {
      toast.error('Full name is required');
      return;
    }

    if (!formData.email.trim()) {
      toast.error('Email is required');
      return;
    }

    if (!formData.phone.trim()) {
      toast.error('Phone number is required');
      return;
    }

    if (formData.password.length < 6) {
      toast.error('Password must be at least 6 characters');
      return;
    }

    if (formData.password !== formData.confirmPassword) {
      toast.error('Passwords do not match');
      return;
    }

    setLoading(true);
    try {
      console.log('📝 Attempting signup with:', {
        fullName: formData.fullName,
        email: formData.email,
        phone: formData.phone,
        role: role
      });

      const response = await authService.signup({
        fullName: formData.fullName,
        email: formData.email,
        password: formData.password,
        phone: formData.phone,
        role: role,
      });

      console.log('✅ Signup response:', response.data);
      
      // Unwrap ApiResponse wrapper - actual data is in response.data.data
      const responseData = response.data.data || response.data;
      const { token, user, role: userRole } = responseData;
      
      if (!token || !userRole) {
        throw new Error('Invalid response from server: missing token or role');
      }

      console.log('👤 User created:', user.fullName, 'Role:', userRole);
      login(user, token, userRole);
      toast.success('Account created successfully! Redirecting...');
      
      setTimeout(() => {
        console.log('🚀 Navigating to dashboard...');
        navigate(userRole === 'STUDENT' ? '/student/dashboard' : '/recruiter/dashboard');
      }, 500);
    } catch (error) {
      console.error('❌ Signup error:', {
        message: error.message,
        status: error.response?.status,
        data: error.response?.data,
        fullError: error
      });

      let errorMsg = 'Signup failed';
      
      if (error.response?.status === 400) {
        if (error.response?.data?.message?.includes('already exists')) {
          errorMsg = 'Email already registered. Please login instead.';
        } else {
          errorMsg = error.response.data.message || 'Invalid signup data';
        }
      } else if (error.response?.data?.message) {
        errorMsg = error.response.data.message;
      } else if (error.message) {
        errorMsg = error.message;
      }
      
      toast.error(errorMsg);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-primary/5 to-secondary/5 flex items-center justify-center px-4 py-8">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
        className="w-full max-w-md"
      >
        {/* Header Section */}
        <div className="text-center mb-10">
          <div className="inline-block mb-4 p-3 bg-gradient-to-r from-primary to-secondary rounded-xl">
            <div className="w-8 h-8 rounded-lg bg-white"></div>
          </div>
          <h1 className="text-4xl font-bold gradient-text">TalentFlow AI</h1>
          <p className="text-gray-500 mt-2 font-medium">Start your career journey</p>
        </div>

        {/* Role Selection */}
        {!role ? (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="bg-white rounded-2xl p-8 sm:p-10 shadow-xl border border-gray-100 space-y-4"
          >
            <p className="text-center font-bold text-lg text-gray-800 mb-8">
              Choose your role
            </p>
            <motion.button
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              onClick={() => setRole('STUDENT')}
              className="w-full p-4 rounded-xl border-2 border-primary bg-white hover:bg-gradient-to-r hover:from-primary/10 hover:to-secondary/10 text-primary font-bold transition duration-200 flex items-center justify-center gap-3 text-lg"
            >
              <span className="text-2xl">👤</span> Job Seeker
            </motion.button>
            <motion.button
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              onClick={() => setRole('RECRUITER')}
              className="w-full p-4 rounded-xl border-2 border-secondary bg-white hover:bg-gradient-to-r hover:from-secondary/10 hover:to-primary/10 text-secondary font-bold transition duration-200 flex items-center justify-center gap-3 text-lg"
            >
              <span className="text-2xl">🏢</span> Recruiter
            </motion.button>
          </motion.div>
        ) : (
          <motion.form
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            onSubmit={handleSignup}
            className="space-y-6 bg-white rounded-2xl p-8 sm:p-10 shadow-xl border border-gray-100"
          >
            <button
              type="button"
              onClick={() => setRole(null)}
              className="inline-flex items-center gap-1 text-sm text-primary hover:text-secondary font-bold transition duration-200 mb-4"
            >
              ← Change role
            </button>

            {/* Full Name Field */}
            <div className="space-y-2">
              <label className="block text-sm font-semibold text-gray-700">Full Name</label>
              <div className="relative group">
                <FiUser className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400 group-focus-within:text-primary transition pointer-events-none" />
                <input
                  type="text"
                  name="fullName"
                  placeholder="John Doe"
                  value={formData.fullName}
                  onChange={handleChange}
                  disabled={loading}
                  required
                  className="w-full px-4 py-3 pl-12 rounded-lg border-2 border-gray-200 bg-gray-50 text-gray-900 placeholder-gray-400 focus:outline-none focus:border-primary focus:bg-white focus:ring-4 focus:ring-primary/10 transition duration-200"
                />
              </div>
            </div>

            {/* Email Field */}
            <div className="space-y-2">
              <label className="block text-sm font-semibold text-gray-700">Email Address</label>
              <div className="relative group">
                <FiMail className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400 group-focus-within:text-primary transition pointer-events-none" />
                <input
                  type="email"
                  name="email"
                  placeholder="you@example.com"
                  value={formData.email}
                  onChange={handleChange}
                  disabled={loading}
                  required
                  className="w-full px-4 py-3 pl-12 rounded-lg border-2 border-gray-200 bg-gray-50 text-gray-900 placeholder-gray-400 focus:outline-none focus:border-primary focus:bg-white focus:ring-4 focus:ring-primary/10 transition duration-200"
                />
              </div>
            </div>

            {/* Phone Field */}
            <div className="space-y-2">
              <label className="block text-sm font-semibold text-gray-700">Phone Number</label>
              <div className="relative group">
                <FiPhone className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400 group-focus-within:text-primary transition pointer-events-none" />
                <input
                  type="tel"
                  name="phone"
                  placeholder="+1 (555) 000-0000"
                  value={formData.phone}
                  onChange={handleChange}
                  disabled={loading}
                  required
                  className="w-full px-4 py-3 pl-12 rounded-lg border-2 border-gray-200 bg-gray-50 text-gray-900 placeholder-gray-400 focus:outline-none focus:border-primary focus:bg-white focus:ring-4 focus:ring-primary/10 transition duration-200"
                />
              </div>
            </div>

            {/* Password Field */}
            <div className="space-y-2">
              <label className="block text-sm font-semibold text-gray-700">Password</label>
              <div className="relative group">
                <FiLock className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400 group-focus-within:text-primary transition pointer-events-none" />
                <input
                  type="password"
                  name="password"
                  placeholder="••••••••"
                  value={formData.password}
                  onChange={handleChange}
                  disabled={loading}
                  required
                  className="w-full px-4 py-3 pl-12 rounded-lg border-2 border-gray-200 bg-gray-50 text-gray-900 placeholder-gray-400 focus:outline-none focus:border-primary focus:bg-white focus:ring-4 focus:ring-primary/10 transition duration-200"
                />
              </div>
              {formData.password && (
                <div className="mt-2 pt-2 border-t border-gray-200">
                  {formData.password.length < 6 ? (
                    <p className="text-xs font-medium text-red-600 flex items-center gap-1">
                      ✗ Minimum 6 characters
                    </p>
                  ) : (
                    <p className="text-xs font-medium text-green-600 flex items-center gap-1">
                      ✓ Strong password
                    </p>
                  )}
                </div>
              )}
            </div>

            {/* Confirm Password Field */}
            <div className="space-y-2">
              <label className="block text-sm font-semibold text-gray-700">Confirm Password</label>
              <div className="relative group">
                <FiLock className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400 group-focus-within:text-primary transition pointer-events-none" />
                <input
                  type="password"
                  name="confirmPassword"
                  placeholder="••••••••"
                  value={formData.confirmPassword}
                  onChange={handleChange}
                  disabled={loading}
                  required
                  className="w-full px-4 py-3 pl-12 rounded-lg border-2 border-gray-200 bg-gray-50 text-gray-900 placeholder-gray-400 focus:outline-none focus:border-primary focus:bg-white focus:ring-4 focus:ring-primary/10 transition duration-200"
                />
              </div>
              {formData.confirmPassword && (
                <div className="mt-2 pt-2 border-t border-gray-200">
                  {formData.password !== formData.confirmPassword ? (
                    <p className="text-xs font-medium text-red-600 flex items-center gap-1">
                      ✗ Passwords don't match
                    </p>
                  ) : (
                    <p className="text-xs font-medium text-green-600 flex items-center gap-1">
                      ✓ Passwords match
                    </p>
                  )}
                </div>
              )}
            </div>

            {/* Sign Up Button */}
            <motion.button
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              type="submit"
              disabled={loading}
              className="w-full py-3 px-6 mt-8 bg-gradient-to-r from-primary to-secondary text-white font-bold rounded-lg shadow-lg hover:shadow-xl hover:scale-105 disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:scale-100 transition duration-200 flex items-center justify-center gap-2"
            >
              {loading ? (
                <>
                  <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                  Creating account...
                </>
              ) : (
                'Create Account'
              )}
            </motion.button>

            <p className="text-center text-gray-600 text-sm">
              Already have an account?{' '}
              <a href="/login" className="text-primary font-bold hover:text-secondary transition duration-200">
                Sign In
              </a>
            </p>
          </motion.form>
        )}
      </motion.div>
    </div>
  );
}
