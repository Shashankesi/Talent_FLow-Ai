import { create } from 'zustand';

export const useAuthStore = create((set) => ({
  user: null,
  token: localStorage.getItem('token') || null,
  role: localStorage.getItem('role') || null,
  isAuthenticated: !!localStorage.getItem('token'),

  setUser: (user) => set({ user }),
  setToken: (token) => {
    localStorage.setItem('token', token);
    set({ token, isAuthenticated: !!token });
  },
  setRole: (role) => {
    localStorage.setItem('role', role);
    set({ role });
  },
  login: (user, token, role) => {
    localStorage.setItem('token', token);
    localStorage.setItem('role', role);
    set({ user, token, role, isAuthenticated: true });
  },
  logout: () => {
    localStorage.removeItem('token');
    localStorage.removeItem('role');
    localStorage.removeItem('user');
    set({ user: null, token: null, role: null, isAuthenticated: false });
  },
}));
