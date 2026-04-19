import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { FiPlus, FiX, FiArrowLeft } from 'react-icons/fi';
import Navbar from '../../components/Navbar';
import { recruiterService } from '../../services/api';
import toast from 'react-hot-toast';

export default function PostJob({ isDark, onToggleDark }) {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [skills, setSkills] = useState([]);
  const [newSkill, setNewSkill] = useState('');
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    location: '',
    salary: '',
    experienceRequired: '0',
    jobType: 'Full Time',
    requirements: [],
  });

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const addSkill = () => {
    if (newSkill.trim() && !skills.includes(newSkill)) {
      setSkills([...skills, newSkill]);
      setNewSkill('');
    }
  };

  const removeSkill = (skillToRemove) => {
    setSkills(skills.filter((skill) => skill !== skillToRemove));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!formData.title || !formData.description || !formData.location) {
      toast.error('Please fill in all required fields');
      return;
    }

    setLoading(true);
    try {
      await recruiterService.createJob({
        ...formData,
        requiredSkills: skills,
        salary: parseInt(formData.salary),
      });
      toast.success('Job posted successfully!');
      navigate('/recruiter/dashboard');
    } catch (error) {
      toast.error(error.response?.data?.message || 'Failed to post job');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className={`min-h-screen ${isDark ? 'dark bg-dark' : 'bg-white'}`}>
      <Navbar isDark={isDark} onToggleDark={onToggleDark} />

      <main className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
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
          <h1 className="text-4xl font-bold mb-2">Post a New Job</h1>
          <p className="text-gray-600 dark:text-gray-400">
            Fill in the details below to post a job opening
          </p>
        </motion.div>

        {/* Form */}
        <motion.form
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          onSubmit={handleSubmit}
          className="card p-8 space-y-6"
        >
          <div className="grid md:grid-cols-2 gap-6">
            <div>
              <label className="block text-sm font-medium mb-2">
                Job Title <span className="text-red-500">*</span>
              </label>
              <input
                type="text"
                name="title"
                value={formData.title}
                onChange={handleChange}
                placeholder="e.g., Senior React Developer"
                required
                className="input-field w-full"
              />
            </div>

            <div>
              <label className="block text-sm font-medium mb-2">
                Location <span className="text-red-500">*</span>
              </label>
              <input
                type="text"
                name="location"
                value={formData.location}
                onChange={handleChange}
                placeholder="e.g., San Francisco, CA"
                required
                className="input-field w-full"
              />
            </div>
          </div>

          <div className="grid md:grid-cols-2 gap-6">
            <div>
              <label className="block text-sm font-medium mb-2">
                Salary (Annual) <span className="text-red-500">*</span>
              </label>
              <input
                type="number"
                name="salary"
                value={formData.salary}
                onChange={handleChange}
                placeholder="e.g., 120000"
                required
                className="input-field w-full"
              />
            </div>

            <div>
              <label className="block text-sm font-medium mb-2">
                Experience Required (years)
              </label>
              <select
                name="experienceRequired"
                value={formData.experienceRequired}
                onChange={handleChange}
                className="input-field w-full"
              >
                <option value="0">Entry Level</option>
                <option value="2">2-5 years</option>
                <option value="5">5-10 years</option>
                <option value="10">10+ years</option>
              </select>
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium mb-2">
              Job Type
            </label>
            <select
              name="jobType"
              value={formData.jobType}
              onChange={handleChange}
              className="input-field w-full"
            >
              <option value="Full Time">Full Time</option>
              <option value="Part Time">Part Time</option>
              <option value="Contract">Contract</option>
              <option value="Remote">Remote</option>
            </select>
          </div>

          <div>
            <label className="block text-sm font-medium mb-2">
              Job Description <span className="text-red-500">*</span>
            </label>
            <textarea
              name="description"
              value={formData.description}
              onChange={handleChange}
              placeholder="Describe the role, responsibilities, and expectations..."
              required
              rows={6}
              className="input-field w-full"
            />
          </div>

          <div>
            <label className="block text-sm font-medium mb-2">
              Required Skills
            </label>
            <div className="flex gap-2 mb-4">
              <input
                type="text"
                value={newSkill}
                onChange={(e) => setNewSkill(e.target.value)}
                onKeyPress={(e) => e.key === 'Enter' && (e.preventDefault(), addSkill())}
                placeholder="Add a skill and press Enter..."
                className="input-field flex-1"
              />
              <button
                type="button"
                onClick={addSkill}
                className="btn-primary"
              >
                <FiPlus /> Add
              </button>
            </div>
            <div className="flex flex-wrap gap-2">
              {skills.map((skill, i) => (
                <motion.span
                  key={i}
                  initial={{ scale: 0 }}
                  animate={{ scale: 1 }}
                  className="px-4 py-2 bg-primary/20 text-primary rounded-full text-sm flex items-center gap-2"
                >
                  {skill}
                  <button
                    type="button"
                    onClick={() => removeSkill(skill)}
                    className="hover:text-primary/60"
                  >
                    <FiX />
                  </button>
                </motion.span>
              ))}
            </div>
          </div>

          <div className="pt-6 border-t border-gray-200 dark:border-gray-700 flex gap-4">
            <motion.button
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              type="submit"
              disabled={loading}
              className="flex-1 btn-primary"
            >
              {loading ? 'Posting...' : 'Post Job'}
            </motion.button>
            <motion.button
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              type="button"
              onClick={() => navigate('/recruiter/dashboard')}
              className="flex-1 btn-secondary"
            >
              Cancel
            </motion.button>
          </div>
        </motion.form>
      </main>
    </div>
  );
}
