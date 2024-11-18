import { create } from "zustand";

interface AuthStore {
  isAuthenticated: boolean;
  userID: string | null;
  userName: string | null;
  setIsAuthenticated: (authState: boolean) => void;
  setUserID: (id: string) => void;
  setUserName : (name: string) => void;
  logout: () => void;
  isValidPrivateKey: (key: string) => boolean;
}

const useAuthStore = create<AuthStore>((set) => ({
  
  isAuthenticated: localStorage.getItem("securaToken") ? true : false,
  userID: localStorage.getItem("securaUserID"),
  userName: localStorage.getItem("securaUserName"),

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
  setUserName: (name: string) => {
    set({ userName: name });
    localStorage.setItem("securaUserName", name);
  },
  logout: () => {
    set({ isAuthenticated: false, userID: null });
    localStorage.removeItem("securaToken");
    localStorage.removeItem("securaUserID");
  },

  isValidPrivateKey: (key: string): boolean => /^0x[a-fA-F0-9]{64}$/.test(key),
}));

export default useAuthStore;
