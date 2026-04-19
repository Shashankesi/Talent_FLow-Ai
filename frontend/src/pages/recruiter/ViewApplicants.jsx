import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { FiArrowLeft, FiDownload, FiCheck, FiX } from 'react-icons/fi';
import Navbar from '../../components/Navbar';
import { recruiterService } from '../../services/api';
import toast from 'react-hot-toast';

export default function ViewApplicants({ isDark, onToggleDark }) {
  const { jobId } = useParams();
  const navigate = useNavigate();
  const [applicants, setApplicants] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState('all');

  useEffect(() => {
    loadApplicants();
  }, [jobId]);

  const loadApplicants = async () => {
    try {
      setLoading(true);
      const response = await recruiterService.getApplicants(jobId);
      setApplicants(response.data);
    } catch (error) {
      toast.error('Failed to load applicants');
    } finally {
      setLoading(false);
    }
  };

  const handleShortlist = async (appId) => {
    try {
      await recruiterService.shortlistCandidate(appId);
      toast.success('Candidate shortlisted!');
      loadApplicants();
    } catch (error) {
      toast.error('Failed to shortlist candidate');
    }
  };

  const handleReject = async (appId) => {
    try {
      await recruiterService.rejectCandidate(appId);
      toast.success('Candidate rejected!');
      loadApplicants();
    } catch (error) {
      toast.error('Failed to reject candidate');
    }
  };

  const handleSelect = async (appId) => {
    try {
      await recruiterService.selectCandidate(appId);
      toast.success('Candidate selected!');
      loadApplicants();
    } catch (error) {
      toast.error('Failed to select candidate');
    }
  };

  const statusColors = {
    APPLIED: 'bg-blue-100 dark:bg-blue-900/20 text-blue-700 dark:text-blue-400',
    SHORTLISTED: 'bg-yellow-100 dark:bg-yellow-900/20 text-yellow-700 dark:text-yellow-400',
    INTERVIEW: 'bg-purple-100 dark:bg-purple-900/20 text-purple-700 dark:text-purple-400',
    SELECTED: 'bg-green-100 dark:bg-green-900/20 text-green-700 dark:text-green-400',
    REJECTED: 'bg-red-100 dark:bg-red-900/20 text-red-700 dark:text-red-400',
  };

  const filteredApplicants = filter === 'all' 
    ? applicants 
    : applicants.filter((app) => app.status === filter);

  return (
    <div className={`min-h-screen ${isDark ? 'dark bg-dark' : 'bg-white'}`}>
      <Navbar isDark={isDark} onToggleDark={onToggleDark} />

      <main className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        {/* Back Button */}
        <motion.button
          whileHover={{ x: -5 }}
          onClick={() => navigate('/recruiter/dashboard')}
          className="flex items-center gap-2 text-primary hover:underline mb-8"
        >
          <FiArrowLeft /> Back to Dashboard
        </motion.button>

        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="mb-8"
        >
          <h1 className="text-3xl font-bold mb-2">Job Applicants</h1>
          <p className="text-gray-600 dark:text-gray-400">
            Review and manage applicants for your job posting
          </p>
        </motion.div>

        {/* Filter Tabs */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="flex gap-3 mb-8 flex-wrap"
        >
          {[
            { id: 'all', label: 'All' },
            { id: 'APPLIED', label: 'Applied' },
            { id: 'SHORTLISTED', label: 'Shortlisted' },
            { id: 'SELECTED', label: 'Selected' },
            { id: 'REJECTED', label: 'Rejected' },
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
              {tab.label}
            </motion.button>
          ))}
        </motion.div>

        {/* Applicants List */}
        {loading ? (
          <div className="space-y-4">
            {[1, 2, 3].map((i) => (
              <div key={i} className="card p-6 h-24 shimmer"></div>
            ))}
          </div>
        ) : filteredApplicants.length > 0 ? (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="space-y-4"
          >
            {filteredApplicants.map((app) => (
              <motion.div
                key={app._id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                className="card p-6"
              >
                <div className="flex items-start justify-between">
                  <div className="flex-1">
                    {/* Applicant Info */}
                    <div className="flex items-center gap-4 mb-4">
                      <div className="w-12 h-12 rounded-full bg-gradient-to-r from-primary to-secondary flex items-center justify-center text-white font-bold">
                        {app.userId?.fullName?.charAt(0)}
                      </div>
                      <div>
                        <h3 className="text-lg font-semibold">
                          {app.userId?.fullName}
                        </h3>
                        <p className="text-gray-600 dark:text-gray-400">
                          {app.userId?.email}
                        </p>
                      </div>
                    </div>

                    {/* Match Score */}
                    <div className="mb-4">
                      <div className="flex items-center justify-between mb-2">
                        <span className="text-sm font-medium">Match Score</span>
                        <span className="text-sm font-bold">{app.matchScore}%</span>
                      </div>
                      <div className="w-full h-2 bg-gray-200 dark:bg-gray-700 rounded-full overflow-hidden">
                        <div
                          className="h-full bg-gradient-to-r from-primary to-secondary transition-all"
                          style={{ width: `${app.matchScore}%` }}
                        ></div>
                      </div>
                    </div>

                    {/* Skills */}
                    {app.userId?.skills && app.userId.skills.length > 0 && (
                      <div className="mb-4">
                        <p className="text-sm font-medium mb-2">Skills</p>
                        <div className="flex flex-wrap gap-2">
                          {app.userId.skills.map((skill, i) => (
                            <span
                              key={i}
                              className="px-3 py-1 bg-primary/10 text-primary rounded-full text-xs font-medium"
                            >
                              {skill}
                            </span>
                          ))}
                        </div>
                      </div>
                    )}

                    {/* Application Date */}
                    <p className="text-xs text-gray-500">
                      Applied on {new Date(app.createdAt).toLocaleDateString()}
                    </p>
                  </div>

                  {/* Right Column: Status and Actions */}
                  <div className="text-right ml-4">
                    {/* Status Badge */}
                    <span
                      className={`inline-block px-4 py-2 rounded-full text-sm font-semibold mb-4 ${
                        statusColors[app.status]
                      }`}
                    >
                      {app.status}
                    </span>

                    {/* Action Buttons */}
                    {app.status === 'APPLIED' && (
                      <div className="space-y-2">
                        <motion.button
                          whileHover={{ scale: 1.05 }}
                          whileTap={{ scale: 0.95 }}
                          onClick={() => handleShortlist(app._id)}
                          className="w-full flex items-center justify-center gap-2 px-4 py-2 bg-yellow-100 dark:bg-yellow-900/20 text-yellow-700 dark:text-yellow-400 rounded-lg hover:bg-yellow-200 dark:hover:bg-yellow-900/30 transition font-medium text-sm"
                        >
                          <FiCheck /> Shortlist
                        </motion.button>
                        <motion.button
                          whileHover={{ scale: 1.05 }}
                          whileTap={{ scale: 0.95 }}
                          onClick={() => handleReject(app._id)}
                          className="w-full flex items-center justify-center gap-2 px-4 py-2 bg-red-100 dark:bg-red-900/20 text-red-700 dark:text-red-400 rounded-lg hover:bg-red-200 dark:hover:bg-red-900/30 transition font-medium text-sm"
                        >
                          <FiX /> Reject
                        </motion.button>
                      </div>
                    )}

                    {app.status === 'SHORTLISTED' && (
                      <div className="space-y-2">
                        <motion.button
                          whileHover={{ scale: 1.05 }}
                          whileTap={{ scale: 0.95 }}
                          onClick={() => handleSelect(app._id)}
                          className="w-full flex items-center justify-center gap-2 px-4 py-2 bg-green-100 dark:bg-green-900/20 text-green-700 dark:text-green-400 rounded-lg hover:bg-green-200 dark:hover:bg-green-900/30 transition font-medium text-sm"
                        >
                          <FiCheck /> Select
                        </motion.button>
                      </div>
                    )}

                    {/* Download Resume */}
                    {app.resumeId && (
                      <motion.a
                        whileHover={{ scale: 1.05 }}
                        href={`/api/resumes/${app.resumeId}/download`}
                        className="mt-4 flex items-center justify-center gap-2 px-4 py-2 bg-primary/20 text-primary rounded-lg hover:bg-primary/30 transition font-medium text-sm"
                      >
                        <FiDownload /> Resume
                      </motion.a>
                    )}
                  </div>
                </div>
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
              No applicants in this category yet
            </p>
          </motion.div>
        )}
      </main>
    </div>
  );
}
