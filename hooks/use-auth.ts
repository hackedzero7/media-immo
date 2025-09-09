"use client"

import { useSession, signIn, signOut } from "next-auth/react"
import { useAuthStore } from "@/store/auth-store"
import { useEffect } from "react"

export function useAuth() {
  const { data: session, status } = useSession()
  const {
    user,
    isLoading: storeLoading,
    error,
    isAuthenticated,
    setUser,
    setLoading,
    login,
    signup,
    logout: storeLogout,
    clearError,
    updateProfile,
  } = useAuthStore()

  // Sync NextAuth session with Zustand store
  useEffect(() => {
    if (status === "loading") {
      setLoading(true)
      return
    }

    setLoading(false)

    if (session?.user) {
      setUser({
        id: session.user.id,
        firstName: session.user.firstName,
        lastName: session.user.lastName,
        email: session.user.email,
        role: session.user.role as "user" | "admin",
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
      })
    } else {
      setUser(null)
    }
  }, [session, status, setUser, setLoading])

  const handleLogin = async (email: string, password: string) => {
    const result = await signIn("credentials", {
      email,
      password,
      redirect: false,
    })

    if (result?.error) {
      return { success: false, error: "Invalid email or password" }
    }

    return { success: true }
  }

  const handleLogout = async () => {
    await signOut({ redirect: false })
    storeLogout()
  }

  const isLoading = status === "loading" || storeLoading

  return {
    user,
    isAuthenticated: !!session?.user || isAuthenticated,
    isLoading,
    error,
    login: handleLogin,
    signup,
    logout: handleLogout,
    clearError,
    updateProfile,
  }
}
