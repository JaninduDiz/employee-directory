import { create } from "zustand";
import { AuthService } from "../services/authService";

interface AuthState {
  isAuthenticated: boolean;
  isLoading: boolean;
  error: string | null;
  login: (pin: string) => Promise<boolean>;
  logout: () => Promise<void>;
  checkAuthStatus: () => Promise<void>;
  clearError: () => void;
}

export const useAuthStore = create<AuthState>((set) => ({
  isAuthenticated: false,
  isLoading: false,
  error: null,

  login: async (pin: string) => {
    set({ isLoading: true, error: null });

    try {
      const result = await AuthService.authenticate(pin);

      if (result.success) {
        set({
          isAuthenticated: true,
          isLoading: false,
          error: null,
        });
        return true;
      } else {
        set({
          isAuthenticated: false,
          isLoading: false,
          error: result.error || "Authentication failed",
        });
        return false;
      }
    } catch (error) {
      set({
        isAuthenticated: false,
        isLoading: false,
        error: "An unexpected error occurred",
      });
      return false;
    }
  },

  logout: async () => {
    set({ isLoading: true });

    try {
      await AuthService.logout();
      set({
        isAuthenticated: false,
        isLoading: false,
        error: null,
      });
    } catch (error) {
      set({ isLoading: false, error: "Logout failed" });
    }
  },

  checkAuthStatus: async () => {
    set({ isLoading: true });

    try {
      const isAuth = await AuthService.isAuthenticated();

      set({
        isAuthenticated: isAuth,
        isLoading: false,
      });
    } catch (error) {
      set({
        isAuthenticated: false,
        isLoading: false,
        error: "Failed to check authentication status",
      });
    }
  },

  clearError: () => set({ error: null }),
}));
