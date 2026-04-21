import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { FiArrowLeft, FiMapPin, FiDollarSign, FiBookmark, FiShare2, FiFileText } from 'react-icons/fi';
import Navbar from '../../components/Navbar';
import { jobService, applicationService } from '../../services/api';
import { formatSalary, formatDate } from '../../utils/helpers';
import toast from 'react-hot-toast';

export default function JobDetails({ isDark, onToggleDark }) {
  const { id } = useParams();
  const navigate = useNavigate();
  const [job, setJob] = useState(null);
  const [loading, setLoading] = useState(true);
  const [applying, setApplying] = useState(false);
  const [showApplyForm, setShowApplyForm] = useState(false);
  const [coverLetter, setCoverLetter] = useState('');
  const [resume, setResume] = useState(null);
  const [hasApplied, setHasApplied] = useState(false);

  useEffect(() => {
    loadJobDetails();
  }, [id]);

  const loadJobDetails = async () => {
    try {
      setLoading(true);
      const [jobResponse, appliedResponse] = await Promise.allSettled([
        jobService.getJobById(id),
        jobService.checkIfApplied(id),
      ]);

      if (jobResponse.status === 'fulfilled') {
        setJob(jobResponse.value.data);
      }

      if (appliedResponse.status === 'fulfilled') {
        setHasApplied(appliedResponse.value.data.applied);
      }
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
      setHasApplied(true);
      setResume(null);
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

        <div className={`grid ${showApplyForm ? 'lg:grid-cols-1' : 'lg:grid-cols-3'} gap-8`}>
          {/* Main Content */}
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            className={showApplyForm ? 'space-y-8' : 'lg:col-span-2 space-y-8'}
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

          {/* Sidebar - Only on right when form is not showing */}
          {!showApplyForm && (
            <motion.div
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              className="lg:col-span-1"
            >
              <div className="card p-6 sticky top-20 space-y-6">
                {/* Apply Button */}
                {hasApplied ? (
                  <div className="w-full bg-green-100 dark:bg-green-900/30 text-green-800 dark:text-green-400 px-6 py-4 rounded-lg text-center border border-green-300 dark:border-green-700">
                    <p className="font-semibold">✓ Application Submitted</p>
                    <p className="text-sm mt-1">You have already applied for this job</p>
                  </div>
                ) : (
                  <motion.button
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    onClick={() => setShowApplyForm(!showApplyForm)}
                    className="w-full btn-primary text-lg py-3"
                  >
                    Apply Now
                  </motion.button>
                )}

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
            </motion.div>
          )}
        </div>

        {/* Apply Form - Full Width Below */}
        {showApplyForm && (
          <motion.form
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            onSubmit={handleApply}
            className="card p-8 space-y-6 mt-8"
          >
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-2xl font-bold">Application Form</h2>
              <button
                type="button"
                onClick={() => setShowApplyForm(false)}
                className="text-gray-600 dark:text-gray-400 hover:text-primary transition"
              >
                ✕
              </button>
            </div>

            <div className="grid lg:grid-cols-2 gap-8">
              {/* Left Side - Form Fields */}
              <div className="space-y-6">
                <div>
                  <label className="block text-sm font-medium mb-2">
                    Cover Letter (Optional)
                  </label>
                  <textarea
                    value={coverLetter}
                    onChange={(e) => setCoverLetter(e.target.value)}
                    placeholder="Tell us why you're a great fit for this role..."
                    className="input-field w-full h-32"
                  />
                  <p className="text-xs text-gray-500 mt-2">Share your motivation and relevant experience</p>
                </div>

                <div>
                  <label className="flex items-center gap-2 text-sm font-medium mb-3">
                    <FiFileText /> Upload Resume (PDF)
                  </label>
                  <label className="flex flex-col items-center justify-center p-6 border-2 border-dashed border-primary/30 rounded-lg cursor-pointer hover:border-primary hover:bg-primary/5 transition">
                    <div className="text-center">
                      <div className="text-3xl mb-2">📄</div>
                      <p className="text-sm font-medium text-gray-700 dark:text-gray-300">
                        {resume ? resume.name : 'Click to upload resume'}
                      </p>
                      <p className="text-xs text-gray-500 mt-1">PDF format, max 10MB</p>
                    </div>
                    <input
                      type="file"
                      accept=".pdf"
                      onChange={(e) => setResume(e.target.files?.[0] || null)}
                      className="hidden"
                    />
                  </label>
                  {resume && (
                    <div className="mt-3 p-3 bg-green-50 dark:bg-green-900/20 rounded-lg border border-green-200 dark:border-green-800">
                      <p className="text-sm text-green-800 dark:text-green-400">✓ Resume selected: {resume.name}</p>
                    </div>
                  )}
                </div>
              </div>

              {/* Right Side - Job Summary */}
              <div className="card p-6 bg-gradient-to-br from-primary/5 to-primary/10 dark:from-primary/10 dark:to-primary/20">
                <h3 className="font-bold text-lg mb-4">Position Summary</h3>
                <div className="space-y-4 text-sm">
                  <div>
                    <p className="text-gray-600 dark:text-gray-400 text-xs uppercase tracking-wide">Position</p>
                    <p className="font-semibold">{job.title}</p>
                  </div>
                  <div>
                    <p className="text-gray-600 dark:text-gray-400 text-xs uppercase tracking-wide">Company</p>
                    <p className="font-semibold">{job.companyName}</p>
                  </div>
                  <div>
                    <p className="text-gray-600 dark:text-gray-400 text-xs uppercase tracking-wide">Location</p>
                    <p className="font-semibold">{job.location}</p>
                  </div>
                  <div>
                    <p className="text-gray-600 dark:text-gray-400 text-xs uppercase tracking-wide">Salary Range</p>
                    <p className="font-semibold text-primary">{formatSalary(job.salary)}</p>
                  </div>
                  <div className="pt-4 border-t border-gray-200 dark:border-gray-700">
                    <p className="text-gray-600 dark:text-gray-400 text-xs uppercase tracking-wide">Required Skills</p>
                    <div className="flex flex-wrap gap-2 mt-2">
                      {job.requiredSkills.slice(0, 3).map((skill, i) => (
                        <span key={i} className="px-2 py-1 bg-primary/20 text-primary rounded text-xs font-medium">
                          {skill}
                        </span>
                      ))}
                      {job.requiredSkills.length > 3 && (
                        <span className="px-2 py-1 bg-gray-200 dark:bg-gray-700 text-gray-700 dark:text-gray-300 rounded text-xs font-medium">
                          +{job.requiredSkills.length - 3} more
                        </span>
                      )}
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Submit and Cancel Buttons */}
            <div className="flex gap-4 pt-6 border-t border-gray-200 dark:border-gray-700">
              <motion.button
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                type="submit"
                disabled={applying}
                className="flex-1 btn-primary text-lg py-3"
              >
                {applying ? (
                  <span className="flex items-center justify-center gap-2">
                    <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                    Submitting...
                  </span>
                ) : (
                  'Submit Application'
                )}
              </motion.button>
              <motion.button
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                type="button"
                onClick={() => setShowApplyForm(false)}
                className="flex-1 px-6 py-3 border-2 border-gray-300 dark:border-gray-600 text-gray-700 dark:text-gray-300 rounded-lg font-medium hover:bg-gray-50 dark:hover:bg-dark-secondary transition"
              >
                Cancel
              </motion.button>
            </div>
          </motion.form>
        )}
      </main>
    </div>
  );
}
