import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { FiCamera, FiSave, FiX } from 'react-icons/fi';
import Navbar from '../../components/Navbar';
import { useAuthStore } from '../../stores/authStore';
import { authService, resumeService } from '../../services/api';
import toast from 'react-hot-toast';

export default function StudentProfile({ isDark, onToggleDark }) {
  const { user, setUser } = useAuthStore();
  const [isEditing, setIsEditing] = useState(false);
  const [formData, setFormData] = useState({
    fullName: user?.fullName || '',
    email: user?.email || '',
    phone: user?.phone || '',
    skills: user?.skills || [],
    education: user?.education || '',
    experience: user?.experience || '',
  });
  const [newSkill, setNewSkill] = useState('');
  const [resume, setResume] = useState(null);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    loadProfile();
  }, []);

  useEffect(() => {
    setFormData({
      fullName: user?.fullName || '',
      email: user?.email || '',
      phone: user?.phone || '',
      skills: user?.skills || [],
      education: user?.education || '',
      experience: user?.experience || '',
    });
  }, [user]);

  const loadProfile = async () => {
    try {
      const [profileResponse, resumeResponse] = await Promise.allSettled([
        authService.getProfile(),
        resumeService.getLatestResume(),
      ]);

      if (profileResponse.status === 'fulfilled') {
        setUser(profileResponse.value.data.data);
      }

      if (resumeResponse.status === 'fulfilled') {
        setResume(resumeResponse.value.data);
      }
    } catch (error) {
      toast.error('Failed to load profile');
    }
  };

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const addSkill = () => {
    if (newSkill.trim() && !formData.skills.includes(newSkill)) {
      setFormData({
        ...formData,
        skills: [...formData.skills, newSkill],
      });
      setNewSkill('');
    }
  };

  const removeSkill = (skillToRemove) => {
    setFormData({
      ...formData,
      skills: formData.skills.filter((skill) => skill !== skillToRemove),
    });
  };

  const handleResumeUpload = async (e) => {
    const file = e.target.files[0];
    if (file) {
      try {
        const response = await resumeService.uploadResume(file);
        setResume(response.data);
        setUser({ ...user, resumeId: response.data.id });
        toast.success('Resume uploaded successfully!');
      } catch (error) {
        toast.error('Failed to upload resume');
      }
    }
  };

  const handleSave = async () => {
    setLoading(true);
    try {
      const response = await authService.updateProfile(formData);
      setUser(response.data.data);
      setIsEditing(false);
      toast.success('Profile updated successfully!');
    } catch (error) {
      toast.error('Failed to update profile');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className={`min-h-screen ${isDark ? 'dark bg-dark' : 'bg-white'}`}>
      <Navbar isDark={isDark} onToggleDark={onToggleDark} />

      <main className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="mb-8"
        >
          <h1 className="text-3xl font-bold mb-2">My Profile</h1>
          <p className="text-gray-600 dark:text-gray-400">
            Keep your profile updated to get better job recommendations
          </p>
        </motion.div>

        {/* Profile Card */}
        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          className="card p-8"
        >
          {/* Profile Photo Section */}
          <div className="flex items-center gap-6 mb-8 pb-8 border-b border-gray-200 dark:border-gray-700">
            <div className="relative">
              <div className="w-24 h-24 rounded-full bg-gradient-to-r from-primary to-secondary flex items-center justify-center text-white text-4xl">
                {user?.fullName?.charAt(0).toUpperCase()}
              </div>
              <label className="absolute bottom-0 right-0 bg-primary p-2 rounded-full cursor-pointer hover:bg-secondary transition">
                <FiCamera className="text-white" />
                <input type="file" accept="image/*" className="hidden" />
              </label>
            </div>
            <div>
              <h2 className="text-2xl font-bold">{user?.fullName}</h2>
              <p className="text-gray-600 dark:text-gray-400">{user?.email}</p>
              <p className="text-sm text-gray-500 mt-2">Job Seeker</p>
            </div>
          </div>

          {/* Edit/Save Button */}
          <div className="flex justify-end mb-6">
            {isEditing ? (
              <div className="flex gap-3">
                <button
                  onClick={() => setIsEditing(false)}
                  className="btn-secondary flex items-center gap-2"
                >
                  <FiX /> Cancel
                </button>
                <button
                  onClick={handleSave}
                  disabled={loading}
                  className="btn-primary flex items-center gap-2"
                >
                  <FiSave /> {loading ? 'Saving...' : 'Save Changes'}
                </button>
              </div>
            ) : (
              <button
                onClick={() => setIsEditing(true)}
                className="btn-primary"
              >
                Edit Profile
              </button>
            )}
          </div>

          {/* Form */}
          {isEditing ? (
            <div className="space-y-6">
              <div className="grid md:grid-cols-2 gap-6">
                <div>
                  <label className="block text-sm font-medium mb-2">Full Name</label>
                  <input
                    type="text"
                    name="fullName"
                    value={formData.fullName}
                    onChange={handleChange}
                    className="input-field"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium mb-2">Email</label>
                  <input
                    type="email"
                    name="email"
                    value={formData.email}
                    onChange={handleChange}
                    disabled
                    className="input-field opacity-50"
                  />
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium mb-2">Phone</label>
                <input
                  type="tel"
                  name="phone"
                  value={formData.phone}
                  onChange={handleChange}
                  className="input-field"
                />
              </div>

              <div>
                <label className="block text-sm font-medium mb-2">Education</label>
                <textarea
                  name="education"
                  value={formData.education}
                  onChange={handleChange}
                  placeholder="e.g., B.S. in Computer Science from XYZ University (2020)"
                  className="input-field"
                  rows={3}
                />
              </div>

              <div>
                <label className="block text-sm font-medium mb-2">Experience</label>
                <textarea
                  name="experience"
                  value={formData.experience}
                  onChange={handleChange}
                  placeholder="e.g., Software Developer at ABC Corp (2020-2023)"
                  className="input-field"
                  rows={3}
                />
              </div>

              <div>
                <label className="block text-sm font-medium mb-2">Skills</label>
                <div className="flex gap-2 mb-4">
                  <input
                    type="text"
                    value={newSkill}
                    onChange={(e) => setNewSkill(e.target.value)}
                    onKeyPress={(e) => e.key === 'Enter' && addSkill()}
                    placeholder="Add a skill..."
                    className="input-field flex-1"
                  />
                  <button
                    type="button"
                    onClick={addSkill}
                    className="btn-primary"
                  >
                    Add
                  </button>
                </div>
                <div className="flex flex-wrap gap-2">
                  {formData.skills.map((skill, i) => (
                    <motion.span
                      key={i}
                      initial={{ scale: 0 }}
                      animate={{ scale: 1 }}
                      className="px-4 py-2 bg-primary/20 text-primary rounded-full text-sm flex items-center gap-2"
                    >
                      {skill}
                      <button
                        onClick={() => removeSkill(skill)}
                        className="hover:text-primary/60"
                      >
                        <FiX className="text-lg" />
                      </button>
                    </motion.span>
                  ))}
                </div>
              </div>
            </div>
          ) : (
            <div className="space-y-6">
              <div className="grid md:grid-cols-2 gap-6">
                <div>
                  <p className="text-sm text-gray-600 dark:text-gray-400 mb-1">
                    Full Name
                  </p>
                  <p className="text-lg font-semibold">{formData.fullName}</p>
                </div>
                <div>
                  <p className="text-sm text-gray-600 dark:text-gray-400 mb-1">
                    Email
                  </p>
                  <p className="text-lg font-semibold">{formData.email}</p>
                </div>
              </div>

              <div>
                <p className="text-sm text-gray-600 dark:text-gray-400 mb-1">
                  Phone
                </p>
                <p className="text-lg font-semibold">{formData.phone || 'Not provided'}</p>
              </div>

              <div>
                <p className="text-sm text-gray-600 dark:text-gray-400 mb-1">
                  Education
                </p>
                <p className="text-lg font-semibold">{formData.education || 'Not provided'}</p>
              </div>

              <div>
                <p className="text-sm text-gray-600 dark:text-gray-400 mb-1">
                  Experience
                </p>
                <p className="text-lg font-semibold">{formData.experience || 'Not provided'}</p>
              </div>

              <div>
                <p className="text-sm text-gray-600 dark:text-gray-400 mb-3">
                  Skills
                </p>
                <div className="flex flex-wrap gap-2">
                  {formData.skills.length > 0 ? (
                    formData.skills.map((skill, i) => (
                      <span
                        key={i}
                        className="px-4 py-2 bg-primary/10 text-primary rounded-full text-sm font-medium"
                      >
                        {skill}
                      </span>
                    ))
                  ) : (
                    <p className="text-gray-600 dark:text-gray-400">No skills added yet</p>
                  )}
                </div>
              </div>
            </div>
          )}

          {/* Resume Section */}
          <div className="mt-8 pt-8 border-t border-gray-200 dark:border-gray-700">
            <h3 className="text-lg font-semibold mb-4">Resume</h3>
            <label className="flex items-center justify-center p-8 border-2 border-dashed border-primary/20 rounded-lg cursor-pointer hover:border-primary transition">
              <div className="text-center">
                <p className="font-medium mb-1">Upload your resume (PDF)</p>
                <p className="text-sm text-gray-600 dark:text-gray-400">
                  {resume ? resume.filename : 'No resume uploaded'}
                </p>
              </div>
              <input
                type="file"
                accept=".pdf"
                onChange={handleResumeUpload}
                className="hidden"
              />
            </label>
            {resume?.id && (
              <div className="mt-4">
                <button
                  type="button"
                  onClick={() => resumeService.downloadResume(resume.id, resume.filename)}
                  className="text-primary hover:underline font-medium"
                >
                  View uploaded resume
                </button>
              </div>
            )}
          </div>
        </motion.div>
      </main>
    </div>
  );
}
