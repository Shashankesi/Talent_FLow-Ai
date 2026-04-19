import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { FiMail, FiLock, FiUser, FiBriefcase } from 'react-icons/fi';
import toast from 'react-hot-toast';
import { authService } from '../../services/api';
import { useAuthStore } from '../../stores/authStore';

export default function Login() {
  const navigate = useNavigate();
  const { login } = useAuthStore();
  const [selectedRole, setSelectedRole] = useState(null);
  const [formData, setFormData] = useState({
    email: '',
    password: '',
  });
  const [loading, setLoading] = useState(false);

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const handleLogin = async (e) => {
    e.preventDefault();

    if (!formData.email.trim()) {
      toast.error('Email is required');
      return;
    }

    if (!formData.password) {
      toast.error('Password is required');
      return;
    }

    setLoading(true);
    try {
      console.log('🔐 Attempting login with email:', formData.email);
      const response = await authService.login(formData.email, formData.password);
      console.log('✅ Login response:', response.data);
      
      // Unwrap ApiResponse wrapper - actual data is in response.data.data
      const responseData = response.data.data || response.data;
      const { token, user, role } = responseData;
      
      if (!token || !role) {
        throw new Error('Invalid response from server: missing token or role');
      }
      
      console.log('👤 User logged in:', user.fullName, 'Role:', role);
      login(user, token, role);
      toast.success('Login successful! Redirecting...');
      
      setTimeout(() => {
        console.log('🚀 Navigating to dashboard...');
        navigate(role === 'STUDENT' ? '/student/dashboard' : '/recruiter/dashboard');
      }, 500);
    } catch (error) {
      console.error('❌ Login error:', {
        message: error.message,
        status: error.response?.status,
        data: error.response?.data,
        fullError: error
      });
      
      let errorMsg = 'Login failed';
      
      if (error.response?.status === 401) {
        errorMsg = 'Invalid email or password';
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
        className="w-full max-w-md bg-white rounded-2xl p-8 sm:p-10 shadow-xl border border-gray-100"
      >
        {/* Header Section */}
        <div className="text-center mb-10">
          <div className="inline-block mb-4 p-3 bg-gradient-to-r from-primary to-secondary rounded-xl">
            <div className="w-8 h-8 rounded-lg bg-white"></div>
          </div>
          <h1 className="text-4xl font-bold gradient-text">TalentFlow AI</h1>
          <p className="text-gray-500 mt-2 font-medium">Welcome back to your career journey</p>
        </div>

        {!selectedRole ? (
          // Role Selection View
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="space-y-4"
          >
            <p className="text-center text-gray-600 font-medium mb-6">
              Sign in as:
            </p>
            
            <motion.button
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              onClick={() => setSelectedRole('STUDENT')}
              className="w-full py-4 px-6 border-2 border-primary/30 rounded-lg hover:border-primary hover:bg-primary/5 transition flex items-center justify-center gap-3 group"
            >
              <FiUser className="text-2xl text-primary group-hover:scale-110 transition" />
              <div className="text-left">
                <p className="font-bold text-gray-800">Student</p>
                <p className="text-sm text-gray-500">Find your dream job</p>
              </div>
            </motion.button>

            <motion.button
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              onClick={() => setSelectedRole('RECRUITER')}
              className="w-full py-4 px-6 border-2 border-secondary/30 rounded-lg hover:border-secondary hover:bg-secondary/5 transition flex items-center justify-center gap-3 group"
            >
              <FiBriefcase className="text-2xl text-secondary group-hover:scale-110 transition" />
              <div className="text-left">
                <p className="font-bold text-gray-800">Recruiter</p>
                <p className="text-sm text-gray-500">Post jobs and hire talent</p>
              </div>
            </motion.button>

            <div className="pt-6 border-t border-gray-200">
              <p className="text-center text-gray-600 text-sm">
                Don't have an account?{' '}
                <a href="/signup" className="text-primary font-bold hover:text-secondary transition">
                  Create Account
                </a>
              </p>
            </div>
          </motion.div>
        ) : (
          // Login Form View
          <>
            <motion.button
              whileHover={{ x: -5 }}
              onClick={() => {
                setSelectedRole(null);
                setFormData({ email: '', password: '' });
              }}
              className="text-sm text-gray-600 hover:text-primary font-medium mb-6 flex items-center gap-1"
            >
              ← Back to role selection
            </motion.button>

            <div className="mb-6 p-4 bg-gradient-to-r from-primary/10 to-secondary/10 rounded-lg">
              <p className="text-sm text-gray-700">
                <span className="font-bold">
                  {selectedRole === 'STUDENT' ? '👨‍🎓 Student Login' : '💼 Recruiter Login'}
                </span>
              </p>
            </div>

            <form onSubmit={handleLogin} className="space-y-6">
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
              </div>

              {/* Remember & Forgot Password */}
              <div className="flex items-center justify-between text-sm pt-2">
                <label className="flex items-center cursor-pointer group">
                  <input 
                    type="checkbox" 
                    className="w-4 h-4 rounded border-2 border-gray-300 accent-primary cursor-pointer transition" 
                  />
                  <span className="ml-2 text-gray-600 group-hover:text-gray-700 transition">Remember me</span>
                </label>
                <a href="#" className="text-primary hover:text-secondary font-semibold transition duration-200">
                  Forgot password?
                </a>
              </div>

              {/* Sign In Button */}
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
                    Signing in...
                  </>
                ) : (
                  'Sign In'
                )}
              </motion.button>

              <p className="text-center text-gray-600 text-sm">
                Don't have an account?{' '}
                <a href="/signup" className="text-primary font-bold hover:text-secondary transition duration-200">
                  Create Account
                </a>
              </p>
            </form>

            {/* Divider */}
            <div className="my-8 flex items-center gap-4">
              <div className="flex-1 h-px bg-gray-200"></div>
              <span className="text-xs text-gray-500 font-medium">Demo Credentials</span>
              <div className="flex-1 h-px bg-gray-200"></div>
            </div>

            {/* Demo Credentials */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.3 }}
              className="bg-gradient-to-br from-gray-50 to-gray-100 rounded-xl p-4 border border-gray-200"
            >
              <div className="space-y-3">
                {selectedRole === 'STUDENT' && (
                  <div>
                    <p className="text-xs font-bold text-gray-700 uppercase tracking-wide">Student Demo</p>
                    <p className="text-xs text-gray-600 mt-1">
                      <span className="font-semibold">Email:</span> student@example.com
                    </p>
                    <p className="text-xs text-gray-600">
                      <span className="font-semibold">Password:</span> password
                    </p>
                  </div>
                )}
                {selectedRole === 'RECRUITER' && (
                  <div>
                    <p className="text-xs font-bold text-gray-700 uppercase tracking-wide">Recruiter Demo</p>
                    <p className="text-xs text-gray-600 mt-1">
                      <span className="font-semibold">Email:</span> recruiter@example.com
                    </p>
                    <p className="text-xs text-gray-600">
                      <span className="font-semibold">Password:</span> password
                    </p>
                  </div>
                )}
              </div>
            </motion.div>
          </>
        )}
      </motion.div>
    </div>
  );
}
