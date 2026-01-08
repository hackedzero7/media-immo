import { create } from "zustand";
import { devtools, persist } from "zustand/middleware";

interface User {
  id: string;
  firstName: string;
  lastName: string;
  email: string;
  role: "user" | "admin";
  stripeCustomerId: string;
  createdAt: string;
  updatedAt: string;
}

interface AuthState {
  user: User | null;
  isLoading: boolean;
  error: string | null;
  isAuthenticated: boolean;
}

interface AuthActions {
  setUser: (user: User | null) => void;
  setLoading: (loading: boolean) => void;
  setError: (error: string | null) => void;
  login: (
    email: string,
    password: string
  ) => Promise<{ success: boolean; error?: string }>;
  sendLoginCode: (
    email: string
  ) => Promise<{ success: boolean; error?: string }>;
  verifyLoginCode: (
    email: string,
    code: string
  ) => Promise<{ success: boolean; error?: string }>;
  sendSignupCode: (
    firstName: string,
    lastName: string,
    email: string
  ) => Promise<{ success: boolean; error?: string }>;
  signup: (userData: {
    fullName: string;
    email: string;
    code: string;
  }) => Promise<{ success: boolean; error?: string }>;
  logout: () => void;
  clearError: () => void;
  updateProfile: (userData: {
    firstName: string;
    lastName: string;
  }) => Promise<{ success: boolean; error?: string }>;
}

type AuthStore = AuthState & AuthActions;

export const useAuthStore = create<AuthStore>()(
  devtools(
    persist(
      (set, get) => ({
        // Initial state
        user: null,
        isLoading: false,
        error: null,
        isAuthenticated: false,

        // Actions
        setUser: (user) =>
          set(
            {
              user,
              isAuthenticated: !!user,
              error: null,
            },
            false,
            "setUser"
          ),

        setLoading: (loading) =>
          set(
            {
              isLoading: loading,
            },
            false,
            "setLoading"
          ),

        setError: (error) =>
          set(
            {
              error,
            },
            false,
            "setError"
          ),

        clearError: () =>
          set(
            {
              error: null,
            },
            false,
            "clearError"
          ),

        login: async (email, password) => {
          set({ isLoading: true, error: null }, false, "login:start");

          try {
            const response = await fetch("/api/auth/login", {
              method: "POST",
              headers: {
                "Content-Type": "application/json",
              },
              body: JSON.stringify({ email, password }),
            });

            const data = await response.json();

            if (!response.ok) {
              set(
                { isLoading: false, error: data.error },
                false,
                "login:error"
              );
              return { success: false, error: data.error };
            }

            set(
              {
                user: data.user,
                isAuthenticated: true,
                isLoading: false,
                error: null,
              },
              false,
              "login:success"
            );

            return { success: true };
          } catch (error) {
            const errorMessage = "Network error. Please try again.";
            set(
              { isLoading: false, error: errorMessage },
              false,
              "login:network-error"
            );
            return { success: false, error: errorMessage };
          }
        },

        sendLoginCode: async (email) => {
          set({ isLoading: true, error: null }, false, "sendLoginCode:start");

          try {
            const response = await fetch("/api/auth/send-login-code", {
              method: "POST",
              headers: {
                "Content-Type": "application/json",
              },
              body: JSON.stringify({ email }),
            });

            const data = await response.json();

            if (!response.ok) {
              set(
                { isLoading: false, error: data.error },
                false,
                "sendLoginCode:error"
              );
              return { success: false, error: data.error };
            }

            set(
              {
                isLoading: false,
                error: null,
              },
              false,
              "sendLoginCode:success"
            );

            return { success: true };
          } catch (error) {
            const errorMessage = "Network error. Please try again.";
            set(
              { isLoading: false, error: errorMessage },
              false,
              "sendLoginCode:network-error"
            );
            return { success: false, error: errorMessage };
          }
        },

        verifyLoginCode: async (email, code) => {
          set({ isLoading: true, error: null }, false, "verifyLoginCode:start");

          try {
            const response = await fetch("/api/auth/verify-login-code", {
              method: "POST",
              headers: {
                "Content-Type": "application/json",
              },
              body: JSON.stringify({ email, code }),
            });

            const data = await response.json();

            if (!response.ok) {
              set(
                { isLoading: false, error: data.error },
                false,
                "verifyLoginCode:error"
              );
              return { success: false, error: data.error };
            }

            set(
              {
                user: data.user,
                isAuthenticated: true,
                isLoading: false,
                error: null,
              },
              false,
              "verifyLoginCode:success"
            );

            return { success: true };
          } catch (error) {
            const errorMessage = "Network error. Please try again.";
            set(
              { isLoading: false, error: errorMessage },
              false,
              "verifyLoginCode:network-error"
            );
            return { success: false, error: errorMessage };
          }
        },

        sendSignupCode: async (firstName, lastName, email) => {
          set({ isLoading: true, error: null }, false, "sendSignupCode:start");

          try {
            const response = await fetch("/api/auth/send-signup-code", {
              method: "POST",
              headers: {
                "Content-Type": "application/json",
              },
              body: JSON.stringify({ firstName, lastName, email }),
            });

            const data = await response.json();

            if (!response.ok) {
              set(
                { isLoading: false, error: data.error },
                false,
                "sendSignupCode:error"
              );
              return { success: false, error: data.error };
            }

            set(
              {
                isLoading: false,
                error: null,
              },
              false,
              "sendSignupCode:success"
            );

            return { success: true };
          } catch (error) {
            const errorMessage = "Network error. Please try again.";
            set(
              { isLoading: false, error: errorMessage },
              false,
              "sendSignupCode:network-error"
            );
            return { success: false, error: errorMessage };
          }
        },

        signup: async (userData) => {
          set({ isLoading: true, error: null }, false, "signup:start");

          try {
            // Split fullName into firstName and lastName for the API
            const nameParts = userData.fullName.trim().split(/\s+/)
            const firstName = nameParts[0] || ""
            const lastName = nameParts.slice(1).join(" ") || firstName

            const response = await fetch("/api/auth/signup", {
              method: "POST",
              headers: {
                "Content-Type": "application/json",
              },
              body: JSON.stringify({
                firstName,
                lastName,
                email: userData.email,
                code: userData.code,
              }),
            });

            const data = await response.json();

            if (!response.ok) {
              set(
                { isLoading: false, error: data.error },
                false,
                "signup:error"
              );
              return { success: false, error: data.error };
            }

            return { success: true };
          } catch (error) {
            const errorMessage = "Network error. Please try again.";
            set(
              { isLoading: false, error: errorMessage },
              false,
              "signup:network-error"
            );
            return { success: false, error: errorMessage };
          }
        },

        updateProfile: async (userData) => {
          set({ isLoading: true, error: null }, false, "updateProfile:start");

          try {
            const response = await fetch("/api/user/profile", {
              method: "PUT",
              headers: {
                "Content-Type": "application/json",
              },
              body: JSON.stringify(userData),
            });

            const data = await response.json();

            if (!response.ok) {
              set(
                { isLoading: false, error: data.error },
                false,
                "updateProfile:error"
              );
              return { success: false, error: data.error };
            }

            set(
              {
                user: data.user,
                isLoading: false,
                error: null,
              },
              false,
              "updateProfile:success"
            );

            return { success: true };
          } catch (error) {
            const errorMessage = "Network error. Please try again.";
            set(
              { isLoading: false, error: errorMessage },
              false,
              "updateProfile:network-error"
            );
            return { success: false, error: errorMessage };
          }
        },

        logout: () => {
          set(
            {
              user: null,
              isAuthenticated: false,
              error: null,
            },
            false,
            "logout"
          );
        },
      }),
      {
        name: "auth-storage",
        partialize: (state) => ({
          user: state.user,
          isAuthenticated: state.isAuthenticated,
        }),
      }
    ),
    {
      name: "auth-store",
    }
  )
);

// Selectors for better performance
export const useUser = () => useAuthStore((state) => state.user);
export const useIsAuthenticated = () =>
  useAuthStore((state) => state.isAuthenticated);
export const useAuthLoading = () => useAuthStore((state) => state.isLoading);
export const useAuthError = () => useAuthStore((state) => state.error);
