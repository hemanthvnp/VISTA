/** @fileoverview Auth store - manages user session, JWT token, and auth state */
import { create } from 'zustand';

const useAuthStore = create((set, get) => ({
  user: null,
  token: localStorage.getItem('vanta_token'),

  get isAuthenticated() {
    return !!get().token;
  },

  login: (token, user) => {
    localStorage.setItem('vanta_token', token);
    set({ token, user });
  },

  logout: () => {
    localStorage.removeItem('vanta_token');
    set({ token: null, user: null });
  },

  setUser: (user) => set({ user }),

  updateUser: (data) => set((state) => ({
    user: state.user ? { ...state.user, ...data } : null,
  })),
}));

export default useAuthStore;
