import { create } from "zustand";

const useAuthStore = create((set) => ({
  isAuthenticated: false,
  userID: null,
  setIsAuthenticated: (authState) => set({ isAuthenticated: authState }),
  logout: () => set({ isAuthenticated: false }),
  setUserID: (id) => set({ userID: id }),
}));

export default useAuthStore;
