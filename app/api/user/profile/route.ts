import { type NextRequest, NextResponse } from "next/server"
import { getServerSession } from "next-auth"
import { authOptions } from "@/lib/auth"
import {dbConnect} from "@/lib/mongodb"
import User from "@/models/User"

export async function GET(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions)

    if (!session || !session.user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    await dbConnect()

    const user = await User.findById(session.user.id).select("-password")
    if (!user) {
      return NextResponse.json({ error: "User not found" }, { status: 404 })
    }

    return NextResponse.json({ user }, { status: 200 })
  } catch (error) {
    console.error("Profile fetch error:", error)
    return NextResponse.json({ error: "Internal server error" }, { status: 500 })
  }
}

export async function PUT(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions)

    if (!session || !session.user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    const { firstName, lastName } = await request.json()

    if (!firstName || !lastName) {
      return NextResponse.json({ error: "First name and last name are required" }, { status: 400 })
    }

    await dbConnect()

    const user = await User.findByIdAndUpdate(
      session.user.id,
      {
        firstName: firstName.trim(),
        lastName: lastName.trim(),
      },
      { new: true, runValidators: true },
    ).select("-password")

    if (!user) {
      return NextResponse.json({ error: "User not found" }, { status: 404 })
    }

    return NextResponse.json(
      {
        message: "Profile updated successfully",
        user,
      },
      { status: 200 },
    )
  } catch (error) {
    console.error("Profile update error:", error)
    return NextResponse.json({ error: "Internal server error" }, { status: 500 })
  }
}
