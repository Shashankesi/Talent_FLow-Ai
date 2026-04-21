import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { FiCheckCircle, FiBriefcase, FiStar, FiX, FiTrendingUp } from 'react-icons/fi';
import Navbar from '../../components/Navbar';
import { useAuthStore } from '../../stores/authStore';
import { jobService, applicationService } from '../../services/api';
import { calculateProfileCompletion, formatSalary } from '../../utils/helpers';
import toast from 'react-hot-toast';

export default function StudentDashboard({ isDark, onToggleDark }) {
  const navigate = useNavigate();
  const { user } = useAuthStore();
  const [profileCompletion, setProfileCompletion] = useState(0);
  const [stats, setStats] = useState({
    totalApplied: 0,
    shortlisted: 0,
    rejected: 0,
    selected: 0,
    pending: 0,
    successRate: 0,
  });
  const [recommendedJobs, setRecommendedJobs] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadDashboardData();
  }, []);

  const loadDashboardData = async () => {
    try {
      setLoading(true);
      
      // Calculate profile completion
      if (user) {
        const completion = calculateProfileCompletion(user);
        setProfileCompletion(completion);
      }

      // Get application statistics
      const statsRes = await applicationService.getStudentStats();
      setStats(statsRes.data);

      // Get trending jobs as recommended
      const jobsRes = await jobService.getTrendingJobs();
      setRecommendedJobs(jobsRes.data.slice(0, 3));
    } catch (error) {
      toast.error('Failed to load dashboard data');
    } finally {
      setLoading(false);
    }
  };

  const statCards = [
    {
      icon: FiBriefcase,
      label: 'Total Applied',
      value: stats.totalApplied,
      color: 'from-blue-400 to-blue-600',
    },
    {
      icon: FiStar,
      label: 'Shortlisted',
      value: stats.shortlisted,
      color: 'from-yellow-400 to-yellow-600',
    },
    {
      icon: FiCheckCircle,
      label: 'Selected',
      value: stats.selected,
      color: 'from-green-400 to-green-600',
    },
    {
      icon: FiX,
      label: 'Rejected',
      value: stats.rejected,
      color: 'from-red-400 to-red-600',
    },
  ];

  return (
    <div className={`min-h-screen ${isDark ? 'dark bg-dark' : 'bg-white'}`}>
      <Navbar isDark={isDark} onToggleDark={onToggleDark} />

      <main className="max-w-7xl mx-auto px-3 sm:px-6 lg:px-8 py-8 sm:py-12 mt-20">
        {/* Welcome Section */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="mb-10 sm:mb-12"
        >
          <h1 className="text-3xl sm:text-4xl font-bold mb-2">
            Welcome back, <span className="gradient-text">{user?.fullName}</span>!
          </h1>
          <p className="text-gray-600 dark:text-gray-400 text-sm sm:text-base">
            Here's what's happening with your job search today.
          </p>
        </motion.div>

        {/* Profile Completion Alert */}
        {profileCompletion < 100 && (
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            className="mb-8 p-4 sm:p-6 bg-amber-50 dark:bg-amber-900/20 border border-amber-200 dark:border-amber-800 rounded-lg"
          >
            <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
              <div className="flex-1 w-full">
                <h3 className="font-semibold text-amber-900 dark:text-amber-300 mb-2 text-sm sm:text-base">
                  Complete your profile to increase visibility
                </h3>
                <div className="w-full bg-amber-200 dark:bg-amber-800 rounded-full h-2">
                  <div
                    className="bg-gradient-to-r from-amber-400 to-amber-600 h-2 rounded-full transition-all"
                    style={{ width: `${profileCompletion}%` }}
                  ></div>
                </div>
              </div>
              <button
                onClick={() => navigate('/student/profile')}
                className="btn-primary whitespace-nowrap w-full sm:w-auto text-sm sm:text-base"
              >
                Complete Profile
              </button>
            </div>
          </motion.div>
        )}

        {/* Stats Grid */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-3 sm:gap-6 mb-10 sm:mb-12">
          {statCards.map((stat, index) => {
            const Icon = stat.icon;
            return (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.1 }}
                className="card p-4 sm:p-6"
              >
                <div className={`w-10 h-10 sm:w-12 sm:h-12 rounded-lg bg-gradient-to-r ${stat.color} flex items-center justify-center mb-3 sm:mb-4`}>
                  <Icon className="text-white text-xl sm:text-2xl" />
                </div>
                <p className="text-gray-600 dark:text-gray-400 text-xs sm:text-sm mb-1">
                  {stat.label}
                </p>
                <p className="text-2xl sm:text-3xl font-bold">{stat.value}</p>
              </motion.div>
            );
          })}
        </div>

        {/* Success Rate Card */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="card p-6 sm:p-8 mb-10 sm:mb-12"
        >
          <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between mb-6 gap-4">
            <h3 className="text-xl sm:text-2xl font-bold">Your Statistics</h3>
            <span className="text-3xl sm:text-4xl font-bold gradient-text">{stats.successRate}%</span>
          </div>
          <p className="text-gray-600 dark:text-gray-400 mb-6 text-sm sm:text-base">Success Rate (Selected / Applied)</p>
          
          <div className="space-y-4">
            <div>
              <div className="flex justify-between text-xs sm:text-sm mb-2">
                <span>Pending Applications</span>
                <span className="font-semibold">{stats.pending}</span>
              </div>
              <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-2">
                <div
                  className="bg-blue-500 h-2 rounded-full transition-all"
                  style={{ width: `${stats.totalApplied > 0 ? (stats.pending / stats.totalApplied) * 100 : 0}%` }}
                ></div>
              </div>
            </div>

            <div>
              <div className="flex justify-between text-xs sm:text-sm mb-2">
                <span>Shortlisted</span>
                <span className="font-semibold">{stats.shortlisted}</span>
              </div>
              <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-2">
                <div
                  className="bg-yellow-500 h-2 rounded-full transition-all"
                  style={{ width: `${stats.totalApplied > 0 ? (stats.shortlisted / stats.totalApplied) * 100 : 0}%` }}
                ></div>
              </div>
            </div>

            <div>
              <div className="flex justify-between text-xs sm:text-sm mb-2">
                <span>Selected</span>
                <span className="font-semibold">{stats.selected}</span>
              </div>
              <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-2">
                <div
                  className="bg-green-500 h-2 rounded-full transition-all"
                  style={{ width: `${stats.totalApplied > 0 ? (stats.selected / stats.totalApplied) * 100 : 0}%` }}
                ></div>
              </div>
            </div>

            <div>
              <div className="flex justify-between text-xs sm:text-sm mb-2">
                <span>Rejected</span>
                <span className="font-semibold">{stats.rejected}</span>
              </div>
              <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-2">
                <div
                  className="bg-red-500 h-2 rounded-full transition-all"
                  style={{ width: `${stats.totalApplied > 0 ? (stats.rejected / stats.totalApplied) * 100 : 0}%` }}
                ></div>
              </div>
            </div>
          </div>
        </motion.div>

        {/* Action Buttons */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 sm:gap-6 mb-10 sm:mb-12">
          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={() => navigate('/student/jobs')}
            className="p-5 sm:p-6 rounded-lg bg-gradient-to-br from-primary to-secondary text-white font-semibold text-base sm:text-lg shadow-lg hover:shadow-xl transition"
          >
            🔍 Search Jobs
          </motion.button>
          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={() => navigate('/student/applications')}
            className="p-5 sm:p-6 rounded-lg bg-gradient-to-br from-secondary to-accent text-white font-semibold text-base sm:text-lg shadow-lg hover:shadow-xl transition"
          >
            📋 My Applications
          </motion.button>
          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={() => navigate('/student/profile')}
            className="p-5 sm:p-6 rounded-lg bg-gradient-to-br from-accent to-pink-600 text-white font-semibold text-base sm:text-lg shadow-lg hover:shadow-xl transition"
          >
            👤 My Profile
          </motion.button>
        </div>

        {/* Recommended Jobs */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
        >
          <h2 className="text-2xl font-bold mb-6">Recommended Jobs for You</h2>
          {loading ? (
            <div className="space-y-4">
              {[1, 2, 3].map((i) => (
                <div key={i} className="card p-4 sm:p-6 shimmer"></div>
              ))}
            </div>
          ) : recommendedJobs.length > 0 ? (
            <div className="space-y-4">
              {recommendedJobs.map((job) => (
                <motion.div
                  key={job.id}
                  whileHover={{ x: 5 }}
                  onClick={() => navigate(`/student/job/${job.id}`)}
                  className="card p-4 sm:p-6 cursor-pointer"
                >
                  <div className="flex flex-col sm:flex-row sm:items-start sm:justify-between gap-4">
                    <div className="flex-1">
                      <h3 className="text-base sm:text-lg font-semibold mb-2">{job.title}</h3>
                      <p className="text-gray-600 dark:text-gray-400 mb-3 text-sm">
                        {job.companyName}
                      </p>
                      <div className="flex flex-wrap gap-2 mb-3">
                        {job.requiredSkills.slice(0, 3).map((skill, i) => (
                          <span
                            key={i}
                            className="px-3 py-1 bg-primary/10 text-primary rounded-full text-sm"
                          >
                            {skill}
                          </span>
                        ))}
                      </div>
                    </div>
                    <div className="text-right">
                      <p className="text-2xl font-bold gradient-text mb-2">
                        {formatSalary(job.salary)}
                      </p>
                      <p className="text-sm text-gray-600 dark:text-gray-400">
                        {job.location}
                      </p>
                    </div>
                  </div>
                </motion.div>
              ))}
            </div>
          ) : (
            <div className="card p-12 text-center">
              <p className="text-gray-600 dark:text-gray-400 mb-4">
                No jobs found yet. Try checking back later!
              </p>
              <button
                onClick={() => navigate('/student/jobs')}
                className="btn-primary"
              >
                Browse All Jobs
              </button>
            </div>
          )}
        </motion.div>
      </main>
    </div>
  );
}
