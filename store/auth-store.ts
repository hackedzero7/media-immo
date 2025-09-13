import { create } from "zustand"
import { devtools, persist } from "zustand/middleware"

interface User {
  id: string
  firstName: string
  lastName: string
  email: string
  role: "user" | "admin"
  createdAt: string
  updatedAt: string
}

interface AuthState {
  user: User | null
  isLoading: boolean
  error: string | null
  isAuthenticated: boolean
}

interface AuthActions {
  setUser: (user: User | null) => void
  setLoading: (loading: boolean) => void
  setError: (error: string | null) => void
  login: (email: string, password: string) => Promise<{ success: boolean; error?: string }>
  signup: (userData: {
    firstName: string
    lastName: string
    email: string
    password: string
    confirmPassword: string
  }) => Promise<{ success: boolean; error?: string }>
  logout: () => void
  clearError: () => void
  updateProfile: (userData: { firstName: string; lastName: string }) => Promise<{ success: boolean; error?: string }>
}

type AuthStore = AuthState & AuthActions

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
            "setUser",
          ),

        setLoading: (loading) =>
          set(
            {
              isLoading: loading,
            },
            false,
            "setLoading",
          ),

        setError: (error) =>
          set(
            {
              error,
            },
            false,
            "setError",
          ),

        clearError: () =>
          set(
            {
              error: null,
            },
            false,
            "clearError",
          ),

        login: async (email, password) => {
          set({ isLoading: true, error: null }, false, "login:start")

          try {
            const response = await fetch("/api/auth/login", {
              method: "POST",
              headers: {
                "Content-Type": "application/json",
              },
              body: JSON.stringify({ email, password }),
            })

            const data = await response.json()

            if (!response.ok) {
              set({ isLoading: false, error: data.error }, false, "login:error")
              return { success: false, error: data.error }
            }

            set(
              {
                user: data.user,
                isAuthenticated: true,
                isLoading: false,
                error: null,
              },
              false,
              "login:success",
            )

            return { success: true }
          } catch (error) {
            const errorMessage = "Network error. Please try again."
            set({ isLoading: false, error: errorMessage }, false, "login:network-error")
            return { success: false, error: errorMessage }
          }
        },

        signup: async (userData) => {
          set({ isLoading: true, error: null }, false, "signup:start")

          try {
            const response = await fetch("/api/auth/signup", {
              method: "POST",
              headers: {
                "Content-Type": "application/json",
              },
              body: JSON.stringify(userData),
            })

            const data = await response.json()

            if (!response.ok) {
              set({ isLoading: false, error: data.error }, false, "signup:error")
              return { success: false, error: data.error }
            }

            // set(
            //   {
            //     user: data.user,
            //     isAuthenticated: true,
            //     isLoading: false,
            //     error: null,
            //   },
            //   false,
            //   "signup:success",
            // )

            return { success: true }
          } catch (error) {
            const errorMessage = "Network error. Please try again."
            set({ isLoading: false, error: errorMessage }, false, "signup:network-error")
            return { success: false, error: errorMessage }
          }
        },

        updateProfile: async (userData) => {
          set({ isLoading: true, error: null }, false, "updateProfile:start")

          try {
            const response = await fetch("/api/user/profile", {
              method: "PUT",
              headers: {
                "Content-Type": "application/json",
              },
              body: JSON.stringify(userData),
            })

            const data = await response.json()

            if (!response.ok) {
              set({ isLoading: false, error: data.error }, false, "updateProfile:error")
              return { success: false, error: data.error }
            }

            set(
              {
                user: data.user,
                isLoading: false,
                error: null,
              },
              false,
              "updateProfile:success",
            )

            return { success: true }
          } catch (error) {
            const errorMessage = "Network error. Please try again."
            set({ isLoading: false, error: errorMessage }, false, "updateProfile:network-error")
            return { success: false, error: errorMessage }
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
            "logout",
          )
        },
      }),
      {
        name: "auth-storage",
        partialize: (state) => ({
          user: state.user,
          isAuthenticated: state.isAuthenticated,
        }),
      },
    ),
    {
      name: "auth-store",
    },
  ),
)

// Selectors for better performance
export const useUser = () => useAuthStore((state) => state.user)
export const useIsAuthenticated = () => useAuthStore((state) => state.isAuthenticated)
export const useAuthLoading = () => useAuthStore((state) => state.isLoading)
export const useAuthError = () => useAuthStore((state) => state.error)
