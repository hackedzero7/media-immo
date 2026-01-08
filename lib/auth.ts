import type { NextAuthOptions } from "next-auth"
import CredentialsProvider from "next-auth/providers/credentials"
import bcrypt from "bcryptjs"

import User from "@/models/User"
import { dbConnect } from "./mongodb"

export const authOptions: NextAuthOptions = {
  providers: [
    CredentialsProvider({
      id: "otp",
      name: "otp",
      credentials: {
        email: { label: "Email", type: "email" },
        code: { label: "Code", type: "text" },
      },
      async authorize(credentials) {
        if (!credentials?.email || !credentials?.code) {
          throw new Error("Please enter your email and code")
        }

        try {
          await dbConnect()

          const normalizedEmail = credentials.email.toLowerCase().trim()
          const normalizedCode = credentials.code.trim()

          const user = await User.findOne({ email: normalizedEmail })

          if (!user) {
            throw new Error("Invalid email or code")
          }

          // Check if code exists and is not expired
          if (!user.loginCode || !user.loginCodeExpiresAt) {
            throw new Error("Invalid email or code")
          }

          const now = new Date()
          if (now > user.loginCodeExpiresAt) {
            // Clear expired code
            user.loginCode = null
            user.loginCodeExpiresAt = null
            await user.save()
            throw new Error("Code has expired. Please request a new one.")
          }

          // Verify code
          if (user.loginCode !== normalizedCode) {
            throw new Error("Invalid email or code")
          }

          // Code is valid - clear it (single-use)
          user.loginCode = null
          user.loginCodeExpiresAt = null
          await user.save()

          return {
            id: user._id.toString(),
            email: user.email,
            firstName: user.firstName,
            lastName: user.lastName,
            role: user.role,
          }
        } catch (error) {
          console.error("OTP Auth error:", error)
          if (error instanceof Error) {
            throw error
          }
          throw new Error("Authentication failed. Please try again.")
        }
      },
    }),
    CredentialsProvider({
      name: "credentials",
      credentials: {
        email: { label: "Email", type: "email" },
        password: { label: "Password", type: "password" },
      },
      async authorize(credentials) {
        if (!credentials?.email || !credentials?.password) {
          throw new Error("Please enter your email and password")
        }

        try {
          await dbConnect()

          const user = await User.findOne({ email: credentials.email })

          if (!user) {
            throw new Error("Invalid email or password")
          }

          const isPasswordValid = await bcrypt.compare(credentials.password, user.password)

          if (!isPasswordValid) {
            throw new Error("Invalid email or password")
          }

          return {
            id: user._id.toString(),
            email: user.email,
            firstName: user.firstName,
            lastName: user.lastName,
            role: user.role,
          }
        } catch (error) {
          console.error("Auth error:", error)
          if (error instanceof Error) {
            throw error
          }
          throw new Error("Authentication failed. Please try again.")
        }
      },
    }),
  ],
  session: {
    strategy: "jwt",
  },
  callbacks: {
    async jwt({ token, user }) {
      if (user) {
        token.role = user.role
        token.firstName = user.firstName
        token.lastName = user.lastName
      }
      return token
    },
    async session({ session, token }) {
      if (token) {
        session.user.id = token.sub!
        session.user.role = token.role as string
        session.user.firstName = token.firstName as string
        session.user.lastName = token.lastName as string
      }
      return session
    },
  },
  pages: {
    signIn: "/login",
    signUp: "/signup",
  },
  debug: process.env.NODE_ENV === "development",
}
