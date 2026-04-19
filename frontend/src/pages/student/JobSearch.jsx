import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { FiSearch, FiMapPin, FiDollarSign, FiFilter } from 'react-icons/fi';
import Navbar from '../../components/Navbar';
import { jobService } from '../../services/api';
import { useJobStore } from '../../stores/jobStore';
import { formatSalary } from '../../utils/helpers';
import toast from 'react-hot-toast';

export default function JobSearch({ isDark, onToggleDark }) {
  const navigate = useNavigate();
  const { setJobs, jobs, filters, setFilters, filterJobs } = useJobStore();
  const [searchQuery, setSearchQuery] = useState('');
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadJobs();
  }, []);

  const loadJobs = async () => {
    try {
      setLoading(true);
      const response = await jobService.getAllJobs();
      setJobs(response.data);
    } catch (error) {
      toast.error('Failed to load jobs');
    } finally {
      setLoading(false);
    }
  };

  const handleSearch = async (query) => {
    if (!query.trim()) {
      await loadJobs();
      return;
    }
    try {
      const response = await jobService.searchJobs(query);
      setJobs(response.data);
    } catch (error) {
      toast.error('Search failed');
    }
  };

  const handleFilterChange = (key, value) => {
    setFilters({ [key]: value });
    filterJobs();
  };

  const categories = [
    { name: 'Frontend', icon: '💻' },
    { name: 'Backend', icon: '⚙️' },
    { name: 'Full Stack', icon: '🚀' },
    { name: 'Data Science', icon: '📊' },
    { name: 'DevOps', icon: '🔧' },
    { name: 'Mobile', icon: '📱' },
  ];

  return (
    <div className={`min-h-screen ${isDark ? 'dark bg-dark' : 'bg-white'}`}>
      <Navbar isDark={isDark} onToggleDark={onToggleDark} />

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        {/* Search Section */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="mb-12"
        >
          <h1 className="text-4xl font-bold mb-8">Find Your Dream Job</h1>

          {/* Search Bar */}
          <div className="relative mb-8">
            <FiSearch className="absolute left-4 top-4 text-gray-400 text-xl" />
            <input
              type="text"
              placeholder="Search jobs by title, company, skills..."
              value={searchQuery}
              onChange={(e) => {
                setSearchQuery(e.target.value);
                handleSearch(e.target.value);
              }}
              className="input-field w-full pl-12 h-14 text-lg"
            />
          </div>

          {/* Category Chips */}
          <div className="flex flex-wrap gap-3">
            {categories.map((cat, i) => (
              <motion.button
                key={i}
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                className="px-4 py-2 rounded-full border border-primary/30 hover:border-primary hover:bg-primary/10 transition"
              >
                {cat.icon} {cat.name}
              </motion.button>
            ))}
          </div>
        </motion.div>

        <div className="grid lg:grid-cols-4 gap-8">
          {/* Filters Sidebar */}
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            className="lg:col-span-1"
          >
            <div className="card p-6 sticky top-20">
              <h3 className="text-lg font-semibold mb-6 flex items-center gap-2">
                <FiFilter /> Filters
              </h3>

              <div className="space-y-6">
                {/* Location Filter */}
                <div>
                  <label className="text-sm font-medium mb-2 block">Location</label>
                  <div className="relative">
                    <FiMapPin className="absolute left-3 top-3 text-gray-400" />
                    <input
                      type="text"
                      placeholder="City"
                      value={filters.location}
                      onChange={(e) => handleFilterChange('location', e.target.value)}
                      className="input-field pl-10"
                    />
                  </div>
                </div>

                {/* Salary Filter */}
                <div>
                  <label className="text-sm font-medium mb-2 block">
                    Salary Range
                  </label>
                  <div className="space-y-2">
                    <div className="relative">
                      <FiDollarSign className="absolute left-3 top-3 text-gray-400" />
                      <input
                        type="number"
                        placeholder="Min"
                        value={filters.minSalary}
                        onChange={(e) =>
                          handleFilterChange('minSalary', parseInt(e.target.value))
                        }
                        className="input-field pl-10 w-full"
                      />
                    </div>
                    <input
                      type="number"
                      placeholder="Max"
                      value={filters.maxSalary}
                      onChange={(e) =>
                        handleFilterChange('maxSalary', parseInt(e.target.value))
                      }
                      className="input-field w-full"
                    />
                  </div>
                </div>

                {/* Experience Filter */}
                <div>
                  <label className="text-sm font-medium mb-2 block">
                    Experience Level
                  </label>
                  <select
                    value={filters.experience}
                    onChange={(e) => handleFilterChange('experience', e.target.value)}
                    className="input-field w-full"
                  >
                    <option value="">All Levels</option>
                    <option value="ENTRY">Entry Level</option>
                    <option value="MID">Mid Level</option>
                    <option value="SENIOR">Senior Level</option>
                  </select>
                </div>
              </div>
            </div>
          </motion.div>

          {/* Jobs List */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.2 }}
            className="lg:col-span-3"
          >
            {loading ? (
              <div className="space-y-4">
                {[1, 2, 3].map((i) => (
                  <div key={i} className="card p-6 h-40 shimmer"></div>
                ))}
              </div>
            ) : jobs.length > 0 ? (
              <div className="space-y-4">
                {jobs.map((job) => (
                  <motion.div
                    key={job._id}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    whileHover={{ x: 5 }}
                    onClick={() => navigate(`/student/job/${job._id}`)}
                    className="card p-6 cursor-pointer"
                  >
                    <div className="flex items-start justify-between">
                      <div className="flex-1">
                        <div className="flex items-center gap-3 mb-3">
                          <div className="w-12 h-12 rounded-lg bg-gradient-to-r from-primary to-secondary flex items-center justify-center text-white font-bold">
                            {job.companyName?.charAt(0)}
                          </div>
                          <div>
                            <h3 className="text-lg font-semibold">{job.title}</h3>
                            <p className="text-gray-600 dark:text-gray-400">
                              {job.companyName}
                            </p>
                          </div>
                        </div>

                        <div className="flex flex-wrap gap-2 mb-3">
                          {job.requiredSkills.slice(0, 3).map((skill, i) => (
                            <span
                              key={i}
                              className="px-3 py-1 bg-primary/10 text-primary rounded-full text-xs font-medium"
                            >
                              {skill}
                            </span>
                          ))}
                          {job.requiredSkills.length > 3 && (
                            <span className="px-3 py-1 bg-gray-200 dark:bg-gray-700 rounded-full text-xs font-medium">
                              +{job.requiredSkills.length - 3} more
                            </span>
                          )}
                        </div>

                        <p className="text-gray-600 dark:text-gray-400 text-sm">
                          {job.description}
                        </p>
                      </div>

                      <div className="text-right ml-4">
                        <p className="text-2xl font-bold gradient-text mb-2">
                          {formatSalary(job.salary)}
                        </p>
                        <p className="text-sm text-gray-600 dark:text-gray-400 mb-4">
                          {job.location}
                        </p>
                        <motion.button
                          whileHover={{ scale: 1.05 }}
                          whileTap={{ scale: 0.95 }}
                          className="btn-primary whitespace-nowrap"
                        >
                          View Details
                        </motion.button>
                      </div>
                    </div>
                  </motion.div>
                ))}
              </div>
            ) : (
              <div className="card p-12 text-center">
                <p className="text-gray-600 dark:text-gray-400 mb-4">
                  No jobs found matching your criteria
                </p>
                <button
                  onClick={() => {
                    setFilters({
                      skills: [],
                      location: '',
                      minSalary: 0,
                      maxSalary: 1000000,
                      experience: '',
                    });
                    loadJobs();
                  }}
                  className="btn-primary"
                >
                  Clear Filters
                </button>
              </div>
            )}
          </motion.div>
        </div>
      </main>
    </div>
  );
}
