import axios from 'axios';
import { useAuthStore } from '../stores/authStore';

// Determine API base URL based on environment
const API_BASE_URL = import.meta.env.REACT_APP_API_BASE_URL || 
  (import.meta.env.MODE === 'production' 
    ? 'https://talentflow-backend.onrender.com/api'
    : 'http://localhost:8081/api');

const api = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Attach token to all requests
api.interceptors.request.use(
  (config) => {
    const token = useAuthStore.getState().token;
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => Promise.reject(error)
);

// Auth APIs
export const authService = {
  signup: (userData) => api.post('/auth/signup', userData),
  login: (email, password) => api.post('/auth/login', { email, password }),
  getProfile: () => api.get('/auth/profile'),
  updateProfile: (data) => api.put('/auth/profile', data),
};

// Job APIs
export const jobService = {
  getAllJobs: (page = 0, size = 10) =>
    api.get(`/jobs?page=${page}&size=${size}`),
  getJobById: (id) => api.get(`/jobs/${id}`),
  searchJobs: (keyword) => api.get(`/jobs/search?keyword=${keyword}`),
  filterJobs: (filters) => api.post('/jobs/filter', filters),
  getTrendingJobs: () => api.get('/jobs/trending'),
};

// Application APIs
export const applicationService = {
  applyForJob: (jobId, formData) => {
    const form = new FormData();
    form.append('jobId', jobId);
    if (formData.resume) {
      form.append('resume', formData.resume);
    }
    if (formData.coverLetter) {
      form.append('coverLetter', formData.coverLetter);
    }
    return api.post('/applications/apply', form, {
      headers: { 'Content-Type': 'multipart/form-data' },
    });
  },
  getApplications: () => api.get('/applications/my-applications'),
  getApplicationById: (id) => api.get(`/applications/${id}`),
  updateApplicationStatus: (id, status) =>
    api.put(`/applications/${id}/status`, { status }),
};

// Recruiter APIs
export const recruiterService = {
  createJob: (jobData) => api.post('/recruiter/jobs', jobData),
  getMyJobs: () => api.get('/recruiter/my-jobs'),
  getApplicants: (jobId) => api.get(`/recruiter/jobs/${jobId}/applicants`),
  getMatchScore: (jobId, applicationId) =>
    api.get(`/recruiter/match-score/${jobId}/${applicationId}`),
  shortlistCandidate: (applicationId) =>
    api.put(`/recruiter/applications/${applicationId}/shortlist`),
  rejectCandidate: (applicationId) =>
    api.put(`/recruiter/applications/${applicationId}/reject`),
  selectCandidate: (applicationId) =>
    api.put(`/recruiter/applications/${applicationId}/select`),
};

// Resume APIs
export const resumeService = {
  uploadResume: (file) => {
    const formData = new FormData();
    formData.append('file', file);
    return api.post('/resumes/upload', formData, {
      headers: { 'Content-Type': 'multipart/form-data' },
    });
  },
  parseResume: (resumeId) => api.get(`/resumes/${resumeId}/parse`),
  getResume: (resumeId) => api.get(`/resumes/${resumeId}`),
};

export default api;
