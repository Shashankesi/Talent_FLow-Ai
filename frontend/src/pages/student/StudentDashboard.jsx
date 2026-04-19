import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { FiCheckCircle, FiBriefcase, FiBookmark, FiTrendingUp } from 'react-icons/fi';
import Navbar from '../../components/Navbar';
import { useAuthStore } from '../../stores/authStore';
import { jobService, applicationService } from '../../services/api';
import { calculateProfileCompletion, formatSalary } from '../../utils/helpers';
import toast from 'react-hot-toast';

export default function StudentDashboard({ isDark, onToggleDark }) {
  const navigate = useNavigate();
  const { user } = useAuthStore();
  const [profileCompletion, setProfileCompletion] = useState(0);
  const [appliedCount, setAppliedCount] = useState(0);
  const [savedCount, setSavedCount] = useState(0);
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

      // Get applied applications count
      const applicationsRes = await applicationService.getApplications();
      setAppliedCount(applicationsRes.data.length);

      // Get trending jobs as recommended
      const jobsRes = await jobService.getTrendingJobs();
      setRecommendedJobs(jobsRes.data.slice(0, 3));
    } catch (error) {
      toast.error('Failed to load dashboard data');
    } finally {
      setLoading(false);
    }
  };

  const stats = [
    {
      icon: FiCheckCircle,
      label: 'Profile Completion',
      value: `${profileCompletion}%`,
      color: 'from-green-400 to-green-600',
    },
    {
      icon: FiBriefcase,
      label: 'Applications',
      value: appliedCount,
      color: 'from-blue-400 to-blue-600',
    },
    {
      icon: FiBookmark,
      label: 'Saved Jobs',
      value: savedCount,
      color: 'from-purple-400 to-purple-600',
    },
    {
      icon: FiTrendingUp,
      label: 'Match Score',
      value: '92%',
      color: 'from-pink-400 to-pink-600',
    },
  ];

  return (
    <div className={`min-h-screen ${isDark ? 'dark bg-dark' : 'bg-white'}`}>
      <Navbar isDark={isDark} onToggleDark={onToggleDark} />

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        {/* Welcome Section */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="mb-12"
        >
          <h1 className="text-4xl font-bold mb-2">
            Welcome back, <span className="gradient-text">{user?.fullName}</span>!
          </h1>
          <p className="text-gray-600 dark:text-gray-400">
            Here's what's happening with your job search today.
          </p>
        </motion.div>

        {/* Profile Completion Alert */}
        {profileCompletion < 100 && (
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            className="mb-8 p-6 bg-amber-50 dark:bg-amber-900/20 border border-amber-200 dark:border-amber-800 rounded-lg"
          >
            <div className="flex items-center justify-between">
              <div>
                <h3 className="font-semibold text-amber-900 dark:text-amber-300 mb-2">
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
                className="ml-4 btn-primary whitespace-nowrap"
              >
                Complete Profile
              </button>
            </div>
          </motion.div>
        )}

        {/* Stats Grid */}
        <div className="grid md:grid-cols-4 gap-6 mb-12">
          {stats.map((stat, index) => {
            const Icon = stat.icon;
            return (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.1 }}
                className="card p-6"
              >
                <div className={`w-12 h-12 rounded-lg bg-gradient-to-r ${stat.color} flex items-center justify-center mb-4`}>
                  <Icon className="text-white text-2xl" />
                </div>
                <p className="text-gray-600 dark:text-gray-400 text-sm mb-1">
                  {stat.label}
                </p>
                <p className="text-3xl font-bold">{stat.value}</p>
              </motion.div>
            );
          })}
        </div>

        {/* Action Buttons */}
        <div className="grid md:grid-cols-3 gap-6 mb-12">
          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={() => navigate('/student/jobs')}
            className="p-6 rounded-lg bg-gradient-to-br from-primary to-secondary text-white font-semibold text-lg shadow-lg-custom hover:shadow-xl transition"
          >
            🔍 Search Jobs
          </motion.button>
          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={() => navigate('/student/applications')}
            className="p-6 rounded-lg bg-gradient-to-br from-secondary to-accent text-white font-semibold text-lg shadow-lg-custom hover:shadow-xl transition"
          >
            📋 My Applications
          </motion.button>
          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={() => navigate('/student/profile')}
            className="p-6 rounded-lg bg-gradient-to-br from-accent to-pink-600 text-white font-semibold text-lg shadow-lg-custom hover:shadow-xl transition"
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
                <div key={i} className="card p-6 shimmer"></div>
              ))}
            </div>
          ) : recommendedJobs.length > 0 ? (
            <div className="space-y-4">
              {recommendedJobs.map((job) => (
                <motion.div
                  key={job._id}
                  whileHover={{ x: 5 }}
                  onClick={() => navigate(`/student/job/${job._id}`)}
                  className="card p-6 cursor-pointer"
                >
                  <div className="flex items-start justify-between">
                    <div className="flex-1">
                      <h3 className="text-lg font-semibold mb-2">{job.title}</h3>
                      <p className="text-gray-600 dark:text-gray-400 mb-3">
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
