import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { FiFilter, FiCheckCircle, FiClock, FiX } from 'react-icons/fi';
import Navbar from '../../components/Navbar';
import { applicationService } from '../../services/api';
import { formatDate } from '../../utils/helpers';
import toast from 'react-hot-toast';

export default function MyApplications({ isDark, onToggleDark }) {
  const [applications, setApplications] = useState([]);
  const [filteredApps, setFilteredApps] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState('all');

  const statusColors = {
    APPLIED: 'bg-blue-100 dark:bg-blue-900/20 text-blue-700 dark:text-blue-400',
    SHORTLISTED: 'bg-yellow-100 dark:bg-yellow-900/20 text-yellow-700 dark:text-yellow-400',
    INTERVIEW: 'bg-purple-100 dark:bg-purple-900/20 text-purple-700 dark:text-purple-400',
    SELECTED: 'bg-green-100 dark:bg-green-900/20 text-green-700 dark:text-green-400',
    REJECTED: 'bg-red-100 dark:bg-red-900/20 text-red-700 dark:text-red-400',
  };

  useEffect(() => {
    loadApplications();
  }, []);

  useEffect(() => {
    filterApplications();
  }, [filter, applications]);

  const loadApplications = async () => {
    try {
      setLoading(true);
      const response = await applicationService.getApplications();
      setApplications(response.data);
    } catch (error) {
      toast.error('Failed to load applications');
    } finally {
      setLoading(false);
    }
  };

  const filterApplications = () => {
    if (filter === 'all') {
      setFilteredApps(applications);
    } else {
      setFilteredApps(
        applications.filter((app) => app.status === filter)
      );
    }
  };

  const statusIcons = {
    APPLIED: <FiClock className="text-blue-600" />,
    SHORTLISTED: <FiCheckCircle className="text-yellow-600" />,
    INTERVIEW: <FiCheckCircle className="text-purple-600" />,
    SELECTED: <FiCheckCircle className="text-green-600" />,
    REJECTED: <FiX className="text-red-600" />,
  };

  return (
    <div className={`min-h-screen ${isDark ? 'dark bg-dark' : 'bg-white'}`}>
      <Navbar isDark={isDark} onToggleDark={onToggleDark} />

      <main className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="mb-8"
        >
          <h1 className="text-3xl font-bold mb-2">My Applications</h1>
          <p className="text-gray-600 dark:text-gray-400">
            Track your job applications and interview status
          </p>
        </motion.div>

        {/* Filter Tabs */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="flex gap-3 mb-8 flex-wrap"
        >
          {[
            { id: 'all', label: 'All Applications', count: applications.length },
            { id: 'APPLIED', label: 'Applied', count: applications.filter(a => a.status === 'APPLIED').length },
            { id: 'SHORTLISTED', label: 'Shortlisted', count: applications.filter(a => a.status === 'SHORTLISTED').length },
            { id: 'INTERVIEW', label: 'Interview', count: applications.filter(a => a.status === 'INTERVIEW').length },
            { id: 'SELECTED', label: 'Selected', count: applications.filter(a => a.status === 'SELECTED').length },
            { id: 'REJECTED', label: 'Rejected', count: applications.filter(a => a.status === 'REJECTED').length },
          ].map((tab) => (
            <motion.button
              key={tab.id}
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={() => setFilter(tab.id)}
              className={`px-4 py-2 rounded-lg font-medium transition ${
                filter === tab.id
                  ? 'bg-primary text-white'
                  : 'bg-gray-100 dark:bg-dark-secondary text-gray-700 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-dark'
              }`}
            >
              {tab.label} ({tab.count})
            </motion.button>
          ))}
        </motion.div>

        {/* Applications List */}
        {loading ? (
          <div className="space-y-4">
            {[1, 2, 3].map((i) => (
              <div key={i} className="card p-6 h-24 shimmer"></div>
            ))}
          </div>
        ) : filteredApps.length > 0 ? (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="space-y-4"
          >
            {filteredApps.map((app) => (
              <motion.div
                key={app.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                whileHover={{ x: 5 }}
                className="card p-6 cursor-pointer"
              >
                <div className="flex items-center gap-4">
                  {/* Status Icon */}
                  <div className="text-4xl">
                    {statusIcons[app.status] || <FiClock />}
                  </div>

                  {/* Job Info */}
                  <div className="flex-1">
                    <h3 className="text-lg font-semibold mb-1">
                      {app.job?.title || 'Job Title'}
                    </h3>
                    <p className="text-gray-600 dark:text-gray-400 mb-2">
                      {app.job?.companyName || 'Company Name'}
                    </p>
                    <p className="text-sm text-gray-500 dark:text-gray-500">
                      Applied on {formatDate(app.createdAt)}
                    </p>
                  </div>

                  {/* Status Badge and Match Score */}
                  <div className="text-right">
                    <span
                      className={`inline-block px-4 py-2 rounded-full text-sm font-semibold mb-3 ${
                        statusColors[app.status]
                      }`}
                    >
                      {app.status}
                    </span>

                    {app.matchScore && (
                      <div className="mt-2">
                        <p className="text-sm text-gray-600 dark:text-gray-400 mb-1">
                          Match Score
                        </p>
                        <div className="w-24 h-2 bg-gray-200 dark:bg-gray-700 rounded-full overflow-hidden">
                          <div
                            className="h-full bg-gradient-to-r from-primary to-secondary transition-all"
                            style={{ width: `${app.matchScore}%` }}
                          ></div>
                        </div>
                        <p className="text-sm font-semibold mt-1">
                          {app.matchScore}%
                        </p>
                      </div>
                    )}
                  </div>
                </div>

                {/* Timeline/Notes */}
                {app.notes && (
                  <motion.div
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    className="mt-4 pt-4 border-t border-gray-200 dark:border-gray-700"
                  >
                    <p className="text-sm text-gray-600 dark:text-gray-400">
                      <span className="font-semibold">Recruiter Notes:</span> {app.notes}
                    </p>
                  </motion.div>
                )}
              </motion.div>
            ))}
          </motion.div>
        ) : (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="card p-12 text-center"
          >
            <p className="text-gray-600 dark:text-gray-400 mb-4">
              No applications in this category yet
            </p>
            <button className="btn-primary" onClick={() => window.location.assign('/student/jobs')}>Start Applying</button>
          </motion.div>
        )}
      </main>
    </div>
  );
}
