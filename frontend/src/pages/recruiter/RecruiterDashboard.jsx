import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { FiPlus, FiBriefcase, FiUsers, FiTrendingUp } from 'react-icons/fi';
import Navbar from '../../components/Navbar';
import { recruiterService } from '../../services/api';
import { useAuthStore } from '../../stores/authStore';
import toast from 'react-hot-toast';

export default function RecruiterDashboard({ isDark, onToggleDark }) {
  const navigate = useNavigate();
  const { user } = useAuthStore();
  const [myJobs, setMyJobs] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadDashboardData();
  }, []);

  const loadDashboardData = async () => {
    try {
      setLoading(true);
      const response = await recruiterService.getMyJobs();
      setMyJobs(response.data);
    } catch (error) {
      toast.error('Failed to load dashboard data');
    } finally {
      setLoading(false);
    }
  };

  const stats = [
    {
      icon: FiBriefcase,
      label: 'Jobs Posted',
      value: myJobs.length,
      color: 'from-blue-400 to-blue-600',
    },
    {
      icon: FiUsers,
      label: 'Total Applicants',
      value: myJobs.reduce((sum, job) => sum + (job.applicantCount || 0), 0),
      color: 'from-green-400 to-green-600',
    },
    {
      icon: FiTrendingUp,
      label: 'Shortlisted',
      value: myJobs.reduce((sum, job) => sum + (job.shortlistedCount || 0), 0),
      color: 'from-purple-400 to-purple-600',
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
            Manage your job postings and applicants from here
          </p>
        </motion.div>

        {/* Stats Grid */}
        <div className="grid md:grid-cols-3 gap-6 mb-12">
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

        {/* Action Button */}
        <motion.button
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          onClick={() => navigate('/recruiter/post-job')}
          className="mb-8 btn-primary flex items-center gap-2 text-lg px-8 py-3"
        >
          <FiPlus /> Post New Job
        </motion.button>

        {/* Posted Jobs */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
        >
          <h2 className="text-2xl font-bold mb-6">Your Job Postings</h2>
          {loading ? (
            <div className="space-y-4">
              {[1, 2, 3].map((i) => (
                <div key={i} className="card p-6 h-20 shimmer"></div>
              ))}
            </div>
          ) : myJobs.length > 0 ? (
            <div className="space-y-4">
              {myJobs.map((job) => (
                <motion.div
                  key={job._id}
                  whileHover={{ x: 5 }}
                  className="card p-6 cursor-pointer"
                  onClick={() => navigate(`/recruiter/applicants/${job._id}`)}
                >
                  <div className="flex items-center justify-between">
                    <div className="flex-1">
                      <h3 className="text-lg font-semibold mb-2">{job.title}</h3>
                      <p className="text-gray-600 dark:text-gray-400 mb-3">
                        {job.description}
                      </p>
                      <div className="flex flex-wrap gap-4 text-sm">
                        <span className="px-3 py-1 bg-blue-100 dark:bg-blue-900/20 text-blue-700 dark:text-blue-400 rounded-full">
                          📍 {job.location}
                        </span>
                        <span className="px-3 py-1 bg-green-100 dark:bg-green-900/20 text-green-700 dark:text-green-400 rounded-full">
                          💼 {job.jobType || 'Full Time'}
                        </span>
                      </div>
                    </div>
                    <div className="text-right">
                      <p className="text-3xl font-bold gradient-text mb-2">
                        {job.applicantCount || 0}
                      </p>
                      <p className="text-sm text-gray-600 dark:text-gray-400">
                        Applicants
                      </p>
                      <div className="mt-3 text-xs text-gray-500">
                        {job.shortlistedCount || 0} Shortlisted
                      </div>
                    </div>
                  </div>
                </motion.div>
              ))}
            </div>
          ) : (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="card p-12 text-center"
            >
              <p className="text-gray-600 dark:text-gray-400 mb-4">
                No jobs posted yet. Start by posting your first job!
              </p>
              <button
                onClick={() => navigate('/recruiter/post-job')}
                className="btn-primary"
              >
                Post Your First Job
              </button>
            </motion.div>
          )}
        </motion.div>
      </main>
    </div>
  );
}
