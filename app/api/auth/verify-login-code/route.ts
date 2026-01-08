import { type NextRequest, NextResponse } from "next/server"
import { dbConnect } from "@/lib/mongodb"
import User from "@/models/User"

export async function POST(request: NextRequest) {
  try {
    const { email, code } = await request.json()

    // Validation
    if (!email || typeof email !== "string") {
      return NextResponse.json(
        { error: "Email is required" },
        { status: 400 }
      )
    }

    if (!code || typeof code !== "string" || code.length !== 6) {
      return NextResponse.json(
        { error: "Invalid code format" },
        { status: 400 }
      )
    }

    const normalizedEmail = email.toLowerCase().trim()
    const normalizedCode = code.trim()

    await dbConnect()

    // Find user by email
    const user = await User.findOne({ email: normalizedEmail })
    if (!user) {
      return NextResponse.json(
        { error: "Invalid email or code" },
        { status: 401 }
      )
    }

    // Check if code exists and is not expired
    if (!user.loginCode || !user.loginCodeExpiresAt) {
      return NextResponse.json(
        { error: "Invalid email or code" },
        { status: 401 }
      )
    }

    const now = new Date()
    if (now > user.loginCodeExpiresAt) {
      // Clear expired code
      user.loginCode = null
      user.loginCodeExpiresAt = null
      await user.save()

      return NextResponse.json(
        { error: "Code has expired. Please request a new one." },
        { status: 401 }
      )
    }

    // Verify code
    if (user.loginCode !== normalizedCode) {
      return NextResponse.json(
        { error: "Invalid email or code" },
        { status: 401 }
      )
    }

    // Code is valid - clear it (single-use)
    user.loginCode = null
    user.loginCodeExpiresAt = null
    await user.save()

    // Return user data (without password)
    const { password: _, loginCode: __, loginCodeExpiresAt: ___, ...userWithoutSensitive } = user.toObject()

    return NextResponse.json(
      {
        message: "Login successful",
        user: userWithoutSensitive,
      },
      { status: 200 }
    )
  } catch (error) {
    console.error("Verify login code error:", error)
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    )
  }
}

