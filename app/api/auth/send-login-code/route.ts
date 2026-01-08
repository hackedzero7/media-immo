import { type NextRequest, NextResponse } from "next/server"
import { dbConnect } from "@/lib/mongodb"
import User from "@/models/User"
import { sendMail } from "@/lib/mailer"

// Simple in-memory rate limiting (in production, use Redis or similar)
const rateLimitMap = new Map<string, { count: number; resetAt: number }>()

const RATE_LIMIT_WINDOW = 60 * 1000 // 1 minute
const MAX_REQUESTS_PER_WINDOW = 3 // Max 3 requests per minute per email

function checkRateLimit(email: string): boolean {
  const now = Date.now()
  const key = email.toLowerCase()
  const record = rateLimitMap.get(key)

  if (!record || now > record.resetAt) {
    rateLimitMap.set(key, { count: 1, resetAt: now + RATE_LIMIT_WINDOW })
    return true
  }

  if (record.count >= MAX_REQUESTS_PER_WINDOW) {
    return false
  }

  record.count++
  return true
}

function generateOTP(): string {
  return Math.floor(100000 + Math.random() * 900000).toString()
}

export async function POST(request: NextRequest) {
  try {
    const { email } = await request.json()

    // Validation
    if (!email || typeof email !== "string") {
      return NextResponse.json(
        { error: "Email is required" },
        { status: 400 }
      )
    }

    const normalizedEmail = email.toLowerCase().trim()

    // Basic email validation
    const emailRegex = /^\w+([.-]?\w+)*@\w+([.-]?\w+)*(\.\w{2,3})+$/
    if (!emailRegex.test(normalizedEmail)) {
      return NextResponse.json(
        { error: "Invalid email format" },
        { status: 400 }
      )
    }

    // Rate limiting
    if (!checkRateLimit(normalizedEmail)) {
      return NextResponse.json(
        { error: "Too many requests. Please try again later." },
        { status: 429 }
      )
    }

    await dbConnect()

    // Find user by email
    const user = await User.findOne({ email: normalizedEmail })
    if (!user) {
      // Return generic error to avoid user enumeration
      // In production, you might want to auto-create users here
      return NextResponse.json(
        { error: "If an account exists, a code has been sent to your email." },
        { status: 200 } // Return 200 to prevent enumeration
      )
    }

    // Generate 6-digit OTP
    const otp = generateOTP()
    const expiresAt = new Date(Date.now() + 5 * 60 * 1000) // 5 minutes from now

    // Save OTP to user
    user.loginCode = otp
    user.loginCodeExpiresAt = expiresAt
    await user.save()

    // Send email with OTP
    try {
      await sendMail({
        to: normalizedEmail,
        subject: "Your Login Code",
        html: `
          <div style="font-family: system-ui, -apple-system, Segoe UI, Roboto, Helvetica, Arial, sans-serif; line-height: 1.6;">
            <h2 style="margin: 0 0 12px;">Your Login Code</h2>
            <p style="margin: 0 0 8px;">Your verification code is:</p>
            <p style="font-size: 24px; font-weight: bold; letter-spacing: 4px; margin: 16px 0; color: #000;">${otp}</p>
            <p style="margin: 0 0 8px;">This code will expire in 5 minutes.</p>
            <p style="margin: 16px 0 0; color: #666; font-size: 14px;">If you didn't request this code, please ignore this email.</p>
          </div>
        `,
        text: `Your verification code is ${otp}. This code will expire in 5 minutes.`,
      })
    } catch (emailError) {
      console.error("Failed to send email:", emailError)
      // Don't expose email errors to user
      return NextResponse.json(
        { error: "Failed to send code. Please try again." },
        { status: 500 }
      )
    }

    // Return success (don't expose whether user exists)
    return NextResponse.json(
      {
        message: "If an account exists, a code has been sent to your email.",
      },
      { status: 200 }
    )
  } catch (error) {
    console.error("Send login code error:", error)
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    )
  }
}

