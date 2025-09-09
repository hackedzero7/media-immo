import { type NextRequest, NextResponse } from "next/server"
import bcrypt from "bcryptjs"

import User from "@/models/User"
import { dbConnect } from "@/lib/mongodb"

export async function POST(request: NextRequest) {
  try {
    const { firstName, lastName, email, password, confirmPassword } = await request.json()

    // Validation
    if (!firstName || !lastName || !email || !password || !confirmPassword) {
      return NextResponse.json({ error: "All fields are required" }, { status: 400 })
    }

    if (password !== confirmPassword) {
      return NextResponse.json({ error: "Passwords do not match" }, { status: 400 })
    }

    if (password.length < 6) {
      return NextResponse.json({ error: "Password must be at least 6 characters long" }, { status: 400 })
    }

    // Email validation
    const emailRegex = /^\w+([.-]?\w+)*@\w+([.-]?\w+)*(\.\w{2,3})+$/
    if (!emailRegex.test(email)) {
      return NextResponse.json({ error: "Please enter a valid email address" }, { status: 400 })
    }

    let retries = 3
    while (retries > 0) {
      try {
        await dbConnect()
        break
      } catch (dbError) {
        retries--
        console.error(`[v0] Database connection attempt failed. Retries left: ${retries}`, dbError)

        if (retries === 0) {
          // Check if it's a timeout error
          if (dbError.code === "ETIMEOUT" || dbError.syscall === "querySrv") {
            return NextResponse.json(
              {
                error:
                  "Database connection timeout. Please check your MongoDB connection string and network connectivity.",
              },
              { status: 503 },
            )
          }
          throw dbError
        }

        // Wait 1 second before retrying
        await new Promise((resolve) => setTimeout(resolve, 1000))
      }
    }

    // Check if user already exists
    const existingUser = await User.findOne({ email: email.toLowerCase() })
    if (existingUser) {
      return NextResponse.json({ error: "User with this email already exists" }, { status: 409 })
    }

    // Hash password
    const saltRounds = 12
    const hashedPassword = await bcrypt.hash(password, saltRounds)

    // Create user
    const user = await User.create({
      firstName: firstName.trim(),
      lastName: lastName.trim(),
      email: email.toLowerCase().trim(),
      password: hashedPassword,
      role: "user", // Default role
    })

    // Return user without password
    const { password: _, ...userWithoutPassword } = user.toObject()

    return NextResponse.json(
      {
        message: "User created successfully",
        user: userWithoutPassword,
      },
      { status: 201 },
    )
  } catch (error) {
    console.error("Signup error:", error)

    if (error.code === "ETIMEOUT" || error.syscall === "querySrv") {
      return NextResponse.json(
        {
          error: "Database connection timeout. Please verify your MongoDB Atlas cluster is running and accessible.",
        },
        { status: 503 },
      )
    }

    // Handle mongoose validation errors
    if (error.name === "ValidationError") {
      const validationErrors = Object.values(error.errors).map((err: any) => err.message)
      return NextResponse.json({ error: validationErrors.join(", ") }, { status: 400 })
    }

    return NextResponse.json({ error: "Internal server error" }, { status: 500 })
  }
}
