import { create } from "zustand";

interface AuthStore {
  isAuthenticated: boolean;
  userID: string | null;
  setIsAuthenticated: (authState: boolean) => void;
  setUserID: (id: string) => void;
  logout: () => void;
  isValidPrivateKey: (key: string) => boolean;
}

const useAuthStore = create<AuthStore>((set) => ({
  isAuthenticated: false,
  userID: null,

  setIsAuthenticated: (authState: boolean) => set({ isAuthenticated: authState }),
  setUserID: (id: string) => set({ userID: id }),
  logout: () => set({ isAuthenticated: false }),

  isValidPrivateKey: (key: string): boolean => /^0x[a-fA-F0-9]{64}$/.test(key),
}));

export default useAuthStore;