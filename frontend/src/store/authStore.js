import { create } from 'zustand';
import { persist } from 'zustand/middleware';

/**
 * Global auth state.
 * Persisted to localStorage so the session survives a page refresh.
 */
const useAuthStore = create(
  persist(
    (set) => ({
      user:            null,
      token:           null,
      isAuthenticated: false,

      setAuth: (user, token) =>
        set({ user, token, isAuthenticated: true }),

      clearAuth: () =>
        set({ user: null, token: null, isAuthenticated: false }),
    }),
    { name: 'railpost-auth' }
  )
);

export default useAuthStore;
