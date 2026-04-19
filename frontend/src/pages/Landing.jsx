import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { FiSearch, FiBriefcase, FiUsers, FiTrendingUp, FiMoon, FiSun } from 'react-icons/fi';
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';

export default function Landing({ isDark, onToggleDark }) {
  const navigate = useNavigate();

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: { staggerChildren: 0.2, delayChildren: 0.3 },
    },
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: { opacity: 1, y: 0, transition: { duration: 0.8 } },
  };

  const features = [
    {
      icon: FiSearch,
      title: 'Smart Job Search',
      description: 'Find your dream job with advanced filters and AI-powered recommendations',
    },
    {
      icon: FiBriefcase,
      title: 'Easy Application',
      description: 'Apply to jobs with one click using your saved resume and profile',
    },
    {
      icon: FiUsers,
      title: 'Recruiter Dashboard',
      description: 'Manage job postings and applicants with our powerful dashboard',
    },
    {
      icon: FiTrendingUp,
      title: 'AI Matching',
      description: 'Get matched with perfect candidates using intelligent algorithms',
    },
  ];

  return (
    <div className={`min-h-screen ${isDark ? 'dark bg-dark' : 'bg-white'}`}>
      <Navbar isDark={isDark} onToggleDark={onToggleDark} />

      {/* Hero Section */}
      <motion.section
        variants={containerVariants}
        initial="hidden"
        animate="visible"
        className="min-h-[90vh] flex items-center justify-center px-4 sm:px-6 lg:px-8 pt-20"
      >
        <div className="max-w-6xl mx-auto w-full">
          <div className="grid md:grid-cols-2 gap-12 items-center">
            {/* Left Content */}
            <motion.div variants={itemVariants}>
              <h1 className="text-5xl md:text-6xl font-bold mb-6 leading-tight">
                <span className="gradient-text">Search, Apply </span>
                <br />
                <span>& Get Your</span>
                <br />
                <span className="gradient-text">Dream Job</span>
              </h1>
              <p className="text-xl text-gray-600 dark:text-gray-400 mb-8 leading-relaxed">
                TalentFlow AI is your ultimate job portal with intelligent recruitment automation. 
                Connect with top companies and find the perfect match.
              </p>
              <div className="flex gap-4 flex-wrap">
                <motion.button
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  onClick={() => navigate('/signup')}
                  className="btn-primary shadow-lg-custom"
                >
                  Get Started
                </motion.button>
                <motion.button
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  onClick={() => navigate('/login')}
                  className="btn-secondary"
                >
                  Sign In
                </motion.button>
              </div>
            </motion.div>

            {/* Right Visual */}
            <motion.div
              variants={itemVariants}
              className="hidden md:flex justify-center"
            >
              <motion.div
                animate={{ y: [0, -20, 0] }}
                transition={{ duration: 4, repeat: Infinity }}
                className="relative w-full h-96"
              >
                <div className="absolute inset-0 bg-gradient-to-r from-primary/20 to-secondary/20 rounded-3xl blur-3xl"></div>
                <div className="relative bg-white dark:bg-dark-secondary rounded-3xl p-8 shadow-2xl border border-gray-200 dark:border-gray-700">
                  <div className="space-y-4">
                    <div className="h-4 bg-gradient-to-r from-primary to-secondary rounded w-3/4"></div>
                    <div className="h-3 bg-gray-200 dark:bg-gray-700 rounded w-full"></div>
                    <div className="h-3 bg-gray-200 dark:bg-gray-700 rounded w-5/6"></div>
                    <div className="pt-4 flex gap-2">
                      <div className="h-8 w-8 bg-primary rounded-full"></div>
                      <div className="h-8 w-8 bg-secondary rounded-full"></div>
                    </div>
                  </div>
                </div>
              </motion.div>
            </motion.div>
          </div>
        </div>
      </motion.section>

      {/* Features Section */}
      <motion.section
        variants={containerVariants}
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true }}
        className="py-20 px-4 sm:px-6 lg:px-8 bg-gray-50 dark:bg-dark-secondary"
      >
        <div className="max-w-6xl mx-auto">
          <motion.div variants={itemVariants} className="text-center mb-16">
            <h2 className="text-4xl font-bold mb-4">Why Choose TalentFlow AI?</h2>
            <p className="text-xl text-gray-600 dark:text-gray-400">
              Powerful features designed for job seekers and recruiters
            </p>
          </motion.div>

          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
            {features.map((feature, index) => {
              const Icon = feature.icon;
              return (
                <motion.div
                  key={index}
                  variants={itemVariants}
                  whileHover={{ y: -10, transition: { duration: 0.3 } }}
                  className="card p-6 cursor-pointer"
                >
                  <motion.div
                    whileHover={{ rotate: 360 }}
                    transition={{ duration: 0.6 }}
                    className="w-12 h-12 bg-gradient-to-r from-primary to-secondary rounded-lg flex items-center justify-center mb-4"
                  >
                    <Icon className="text-white text-2xl" />
                  </motion.div>
                  <h3 className="font-semibold text-lg mb-2">{feature.title}</h3>
                  <p className="text-gray-600 dark:text-gray-400">
                    {feature.description}
                  </p>
                </motion.div>
              );
            })}
          </div>
        </div>
      </motion.section>

      {/* CTA Section */}
      <motion.section
        variants={containerVariants}
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true }}
        className="py-20 px-4 sm:px-6 lg:px-8"
      >
        <div className="max-w-4xl mx-auto text-center">
          <motion.h2 variants={itemVariants} className="text-4xl font-bold mb-6">
            Ready to Find Your Next Opportunity?
          </motion.h2>
          <motion.p
            variants={itemVariants}
            className="text-xl text-gray-600 dark:text-gray-400 mb-8"
          >
            Join thousands of job seekers and recruiters on TalentFlow AI
          </motion.p>
          <motion.button
            variants={itemVariants}
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={() => navigate('/signup')}
            className="btn-primary shadow-lg-custom text-lg px-8 py-3"
          >
            Start Your Journey Now
          </motion.button>
        </div>
      </motion.section>

      <Footer />
    </div>
  );
}
