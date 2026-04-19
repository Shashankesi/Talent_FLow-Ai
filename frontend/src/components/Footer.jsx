import { motion } from 'framer-motion';
import { FiGithub, FiTwitter, FiLinkedin } from 'react-icons/fi';

export default function Footer() {
  return (
    <footer className="bg-gray-50 dark:bg-dark-secondary mt-20">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid md:grid-cols-4 gap-8 mb-8">
          {/* Company */}
          <motion.div initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }}>
            <h3 className="font-bold mb-4">TalentFlow AI</h3>
            <p className="text-sm text-gray-600 dark:text-gray-400">
              Your ultimate job portal with intelligent recruitment automation.
            </p>
          </motion.div>

          {/* For Job Seekers */}
          <motion.div initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} transition={{ delay: 0.1 }}>
            <h4 className="font-semibold mb-4">For Job Seekers</h4>
            <ul className="space-y-2 text-sm text-gray-600 dark:text-gray-400">
              <li><a href="#" className="hover:text-primary transition">Browse Jobs</a></li>
              <li><a href="#" className="hover:text-primary transition">My Profile</a></li>
              <li><a href="#" className="hover:text-primary transition">Saved Jobs</a></li>
            </ul>
          </motion.div>

          {/* For Recruiters */}
          <motion.div initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} transition={{ delay: 0.2 }}>
            <h4 className="font-semibold mb-4">For Recruiters</h4>
            <ul className="space-y-2 text-sm text-gray-600 dark:text-gray-400">
              <li><a href="#" className="hover:text-primary transition">Post Jobs</a></li>
              <li><a href="#" className="hover:text-primary transition">Manage Applicants</a></li>
              <li><a href="#" className="hover:text-primary transition">Pricing</a></li>
            </ul>
          </motion.div>

          {/* Connect */}
          <motion.div initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} transition={{ delay: 0.3 }}>
            <h4 className="font-semibold mb-4">Connect</h4>
            <div className="flex gap-4">
              <motion.a whileHover={{ scale: 1.2 }} href="#" className="text-gray-600 dark:text-gray-400 hover:text-primary transition">
                <FiGithub className="text-xl" />
              </motion.a>
              <motion.a whileHover={{ scale: 1.2 }} href="#" className="text-gray-600 dark:text-gray-400 hover:text-primary transition">
                <FiTwitter className="text-xl" />
              </motion.a>
              <motion.a whileHover={{ scale: 1.2 }} href="#" className="text-gray-600 dark:text-gray-400 hover:text-primary transition">
                <FiLinkedin className="text-xl" />
              </motion.a>
            </div>
          </motion.div>
        </div>

        <div className="border-t border-gray-200 dark:border-gray-700 pt-8">
          <div className="flex flex-col md:flex-row items-center justify-between text-sm text-gray-600 dark:text-gray-400">
            <p>&copy; 2024 TalentFlow AI. All rights reserved.</p>
            <div className="flex gap-6 mt-4 md:mt-0">
              <a href="#" className="hover:text-primary transition">Privacy Policy</a>
              <a href="#" className="hover:text-primary transition">Terms of Service</a>
              <a href="#" className="hover:text-primary transition">Contact Us</a>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
}
