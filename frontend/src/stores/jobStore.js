import { create } from 'zustand';

export const useJobStore = create((set, get) => ({
  jobs: [],
  filteredJobs: [],
  selectedJob: null,
  appliedJobs: [],
  savedJobs: [],
  loading: false,
  filters: {
    skills: [],
    location: '',
    minSalary: 0,
    maxSalary: 1000000,
    experience: '',
  },

  setJobs: (jobs) => set({ jobs, filteredJobs: jobs }),
  setSelectedJob: (job) => set({ selectedJob: job }),
  setAppliedJobs: (jobs) => set({ appliedJobs: jobs }),
  setSavedJobs: (jobs) => set({ savedJobs: jobs }),
  setLoading: (loading) => set({ loading }),

  setFilters: (filters) => {
    set({ filters: { ...get().filters, ...filters } });
  },

  filterJobs: () => {
    const { jobs, filters } = get();
    let filtered = [...jobs];

    if (filters.skills.length > 0) {
      filtered = filtered.filter((job) =>
        filters.skills.some((skill) =>
          job.requiredSkills.map((s) => s.toLowerCase()).includes(skill.toLowerCase())
        )
      );
    }

    if (filters.location) {
      filtered = filtered.filter((job) =>
        job.location.toLowerCase().includes(filters.location.toLowerCase())
      );
    }

    if (filters.minSalary || filters.maxSalary) {
      filtered = filtered.filter(
        (job) => job.salary >= filters.minSalary && job.salary <= filters.maxSalary
      );
    }

    if (filters.experience) {
      filtered = filtered.filter(
        (job) => job.experienceRequired === filters.experience
      );
    }

    set({ filteredJobs: filtered });
  },

  applyForJob: (jobId) => {
    set((state) => ({
      appliedJobs: [...state.appliedJobs, jobId],
    }));
  },

  saveJob: (jobId) => {
    set((state) => ({
      savedJobs: [...state.savedJobs, jobId],
    }));
  },

  unsaveJob: (jobId) => {
    set((state) => ({
      savedJobs: state.savedJobs.filter((id) => id !== jobId),
    }));
  },
}));
