import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { FiArrowLeft, FiMapPin, FiDollarSign, FiBookmark, FiShare2, FiFileText } from 'react-icons/fi';
import Navbar from '../../components/Navbar';
import { jobService, applicationService, resumeService } from '../../services/api';
import { useAuthStore } from '../../stores/authStore';
import { formatSalary, formatDate } from '../../utils/helpers';
import toast from 'react-hot-toast';

export default function JobDetails({ isDark, onToggleDark }) {
  const { id } = useParams();
  const navigate = useNavigate();
  const { user } = useAuthStore();
  const [job, setJob] = useState(null);
  const [loading, setLoading] = useState(true);
  const [applying, setApplying] = useState(false);
  const [showApplyForm, setShowApplyForm] = useState(false);
  const [coverLetter, setCoverLetter] = useState('');
  const [resume, setResume] = useState(null);

  useEffect(() => {
    loadJobDetails();
  }, [id]);

  const loadJobDetails = async () => {
    try {
      setLoading(true);
      const response = await jobService.getJobById(id);
      setJob(response.data);
    } catch (error) {
      toast.error('Failed to load job details');
      navigate('/student/jobs');
    } finally {
      setLoading(false);
    }
  };

  const handleApply = async (e) => {
    e.preventDefault();
    setApplying(true);

    try {
      await applicationService.applyForJob(id, {
        resume: resume,
        coverLetter: coverLetter,
      });
      toast.success('Application submitted successfully!');
      setShowApplyForm(false);
      setCoverLetter('');
    } catch (error) {
      toast.error(error.response?.data?.message || 'Failed to apply for job');
    } finally {
      setApplying(false);
    }
  };

  if (loading) {
    return (
      <div className={`min-h-screen ${isDark ? 'dark bg-dark' : 'bg-white'}`}>
        <Navbar isDark={isDark} onToggleDark={onToggleDark} />
        <div className="flex items-center justify-center min-h-[80vh]">
          <div className="text-center">
            <div className="w-12 h-12 rounded-full border-4 border-primary border-t-transparent animate-spin mx-auto mb-4"></div>
            <p>Loading job details...</p>
          </div>
        </div>
      </div>
    );
  }

  if (!job) {
    return (
      <div className={`min-h-screen ${isDark ? 'dark bg-dark' : 'bg-white'}`}>
        <Navbar isDark={isDark} onToggleDark={onToggleDark} />
        <div className="flex items-center justify-center min-h-[80vh]">
          <p className="text-xl text-gray-600">Job not found</p>
        </div>
      </div>
    );
  }

  return (
    <div className={`min-h-screen ${isDark ? 'dark bg-dark' : 'bg-white'}`}>
      <Navbar isDark={isDark} onToggleDark={onToggleDark} />

      <main className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        {/* Back Button */}
        <motion.button
          whileHover={{ x: -5 }}
          onClick={() => navigate('/student/jobs')}
          className="flex items-center gap-2 text-primary hover:underline mb-8"
        >
          <FiArrowLeft /> Back to Jobs
        </motion.button>

        {/* Job Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="card p-8 mb-8"
        >
          <div className="flex items-start justify-between mb-6">
            <div className="flex-1">
              <h1 className="text-4xl font-bold mb-3">{job.title}</h1>
              <p className="text-xl text-gray-600 dark:text-gray-400 mb-4">
                {job.companyName}
              </p>
              <div className="flex flex-wrap gap-4">
                <div className="flex items-center gap-2 text-gray-600 dark:text-gray-400">
                  <FiMapPin /> {job.location}
                </div>
                <div className="flex items-center gap-2 text-2xl font-bold gradient-text">
                  <FiDollarSign /> {formatSalary(job.salary)}
                </div>
              </div>
            </div>

            <div className="flex gap-3">
              <motion.button
                whileHover={{ scale: 1.1 }}
                className="p-3 rounded-lg border border-gray-200 dark:border-gray-700 hover:bg-gray-100 dark:hover:bg-dark-secondary"
              >
                <FiBookmark className="text-2xl" />
              </motion.button>
              <motion.button
                whileHover={{ scale: 1.1 }}
                className="p-3 rounded-lg border border-gray-200 dark:border-gray-700 hover:bg-gray-100 dark:hover:bg-dark-secondary"
              >
                <FiShare2 className="text-2xl" />
              </motion.button>
            </div>
          </div>

          {/* Meta Info */}
          <div className="flex flex-wrap gap-6 pt-6 border-t border-gray-200 dark:border-gray-700">
            <div>
              <p className="text-sm text-gray-600 dark:text-gray-400 mb-1">
                Posted On
              </p>
              <p className="font-semibold">{formatDate(job.createdAt)}</p>
            </div>
            <div>
              <p className="text-sm text-gray-600 dark:text-gray-400 mb-1">
                Experience Level
              </p>
              <p className="font-semibold">{job.experienceRequired} years</p>
            </div>
            <div>
              <p className="text-sm text-gray-600 dark:text-gray-400 mb-1">
                Job Type
              </p>
              <p className="font-semibold">{job.jobType || 'Full Time'}</p>
            </div>
          </div>
        </motion.div>

        <div className="grid lg:grid-cols-3 gap-8">
          {/* Main Content */}
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            className="lg:col-span-2 space-y-8"
          >
            {/* Description */}
            <div className="card p-8">
              <h2 className="text-2xl font-bold mb-4">About the Role</h2>
              <p className="text-gray-600 dark:text-gray-400 leading-relaxed whitespace-pre-line">
                {job.description}
              </p>
            </div>

            {/* Requirements */}
            <div className="card p-8">
              <h2 className="text-2xl font-bold mb-6">Requirements</h2>
              <div className="space-y-4">
                {job.requirements && job.requirements.length > 0 ? (
                  job.requirements.map((req, i) => (
                    <div key={i} className="flex gap-3">
                      <div className="text-primary text-2xl mt-1">✓</div>
                      <p className="text-gray-600 dark:text-gray-400">{req}</p>
                    </div>
                  ))
                ) : (
                  <p className="text-gray-600 dark:text-gray-400">
                    No specific requirements listed
                  </p>
                )}
              </div>
            </div>

            {/* Skills */}
            <div className="card p-8">
              <h2 className="text-2xl font-bold mb-4">Required Skills</h2>
              <div className="flex flex-wrap gap-3">
                {job.requiredSkills.map((skill, i) => (
                  <span
                    key={i}
                    className="px-4 py-2 bg-primary/10 text-primary rounded-full font-medium"
                  >
                    {skill}
                  </span>
                ))}
              </div>
            </div>
          </motion.div>

          {/* Sidebar */}
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            className="lg:col-span-1"
          >
            <div className="card p-6 sticky top-20 space-y-6">
              {/* Apply Button */}
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                onClick={() => setShowApplyForm(!showApplyForm)}
                className="w-full btn-primary text-lg py-3"
              >
                {showApplyForm ? 'Cancel Application' : 'Apply Now'}
              </motion.button>

              {/* Company Info */}
              <div>
                <h3 className="font-bold mb-3">About Company</h3>
                <p className="text-sm text-gray-600 dark:text-gray-400 mb-4">
                  {job.companyDescription || 'No description provided'}
                </p>
                {job.companyWebsite && (
                  <a
                    href={job.companyWebsite}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-primary hover:underline text-sm font-medium"
                  >
                    Visit Website →
                  </a>
                )}
              </div>

              {/* Share Section */}
              <div className="pt-6 border-t border-gray-200 dark:border-gray-700">
                <h3 className="font-bold mb-3">Share this job</h3>
                <div className="flex gap-2">
                  <button className="flex-1 p-2 rounded-lg border border-gray-200 dark:border-gray-700 hover:bg-gray-100 dark:hover:bg-dark-secondary transition">
                    LinkedIn
                  </button>
                  <button className="flex-1 p-2 rounded-lg border border-gray-200 dark:border-gray-700 hover:bg-gray-100 dark:hover:bg-dark-secondary transition">
                    Twitter
                  </button>
                </div>
              </div>
            </div>

            {/* Apply Form */}
            {showApplyForm && (
              <motion.form
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                onSubmit={handleApply}
                className="card p-6 mt-4 space-y-4"
              >
                <h3 className="font-bold">Application Form</h3>

                <div>
                  <label className="block text-sm font-medium mb-2">
                    Cover Letter (Optional)
                  </label>
                  <textarea
                    value={coverLetter}
                    onChange={(e) => setCoverLetter(e.target.value)}
                    placeholder="Tell us why you're a great fit for this role..."
                    className="input-field w-full h-24"
                  />
                </div>

                <div>
                  <label className="flex items-center gap-2 text-sm font-medium mb-2">
                    <FiFileText /> Resume
                  </label>
                  <label className="flex items-center justify-center p-4 border-2 border-dashed border-primary/20 rounded-lg cursor-pointer hover:border-primary transition">
                    <span className="text-sm text-gray-600 dark:text-gray-400">
                      {resume ? resume.name : 'Click to upload or drag resume'}
                    </span>
                    <input
                      type="file"
                      accept=".pdf"
                      onChange={(e) => setResume(e.target.files[0])}
                      className="hidden"
                    />
                  </label>
                </div>

                <motion.button
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  type="submit"
                  disabled={applying}
                  className="w-full btn-primary"
                >
                  {applying ? 'Submitting...' : 'Submit Application'}
                </motion.button>
              </motion.form>
            )}
          </motion.div>
        </div>
      </main>
    </div>
  );
}
