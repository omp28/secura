import { create } from "zustand";

const useAuthStore = create((set) => ({
  isAuthenticated: false,
  setIsAuthenticated: (authState) => set({ isAuthenticated: authState }),
  logout: () => set({ isAuthenticated: false }),
}));

export default useAuthStore;
