import { create } from "zustand";
import type { LoginRequest, RegisterRequest, SafeUser } from "@workspace/shared";
import { authApi } from "@/lib/api";

type AuthStore = {
  user: SafeUser | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  hasInitialized: boolean;
  setUser: (user: SafeUser) => void;
  clearUser: () => void;
  hydrate: () => Promise<void>;
  login: (input: LoginRequest) => Promise<SafeUser>;
  register: (input: RegisterRequest) => Promise<SafeUser>;
  logout: () => Promise<void>;
};

export const useAuthStore = create<AuthStore>((set) => ({
  user: null,
  isAuthenticated: false,
  isLoading: true,
  hasInitialized: false,
  setUser: (user) => set({ user, isAuthenticated: true, isLoading: false, hasInitialized: true }),
  clearUser: () => set({ user: null, isAuthenticated: false, isLoading: false, hasInitialized: true }),
  hydrate: async () => {
    set({ isLoading: true });
    try {
      const user = await authApi.me();
      set({ user, isAuthenticated: true, isLoading: false, hasInitialized: true });
    } catch {
      set({ user: null, isAuthenticated: false, isLoading: false, hasInitialized: true });
    }
  },
  login: async (input) => {
    set({ isLoading: true });
    try {
      const user = await authApi.login(input);
      set({ user, isAuthenticated: true, isLoading: false, hasInitialized: true });
      return user;
    } catch (error) {
      set({ isLoading: false, hasInitialized: true });
      throw error;
    }
  },
  register: async (input) => {
    set({ isLoading: true });
    try {
      const user = await authApi.register(input);
      set({ user, isAuthenticated: true, isLoading: false, hasInitialized: true });
      return user;
    } catch (error) {
      set({ isLoading: false, hasInitialized: true });
      throw error;
    }
  },
  logout: async () => {
    try {
      await authApi.logout();
    } finally {
      set({ user: null, isAuthenticated: false, isLoading: false, hasInitialized: true });
    }
  },
}));