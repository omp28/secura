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
  // TODO: cookies implementation
  isAuthenticated: localStorage.getItem("securaToken") ? true : false,
  userID: localStorage.getItem("securaUserID"),

  setIsAuthenticated: (authState: boolean) => {
    set({ isAuthenticated: authState });
    if (!authState) {
      localStorage.removeItem("securaToken");
      localStorage.removeItem("securaUserID");
    }
  },
  setUserID: (id: string) => {
    set({ userID: id });
    localStorage.setItem("securaUserID", id);
  },
  logout: () => {
    set({ isAuthenticated: false, userID: null });
    localStorage.removeItem("securaToken");
    localStorage.removeItem("securaUserID");
  },

  isValidPrivateKey: (key: string): boolean => /^0x[a-fA-F0-9]{64}$/.test(key),
}));

export default useAuthStore;
