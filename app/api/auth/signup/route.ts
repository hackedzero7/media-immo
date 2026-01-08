import { type NextRequest, NextResponse } from "next/server";

import User from "@/models/User";
import { dbConnect } from "@/lib/mongodb";
import Stripe from "stripe";

// TypeScript declaration for global signup data map
declare global {
  var signupDataMap: Map<string, {
    firstName: string
    lastName: string
    email: string
    otp: string
    expiresAt: Date
  }> | undefined
}

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY as string, {
  apiVersion: "2025-08-27.basil",
});

export async function POST(request: NextRequest) {
  try {
    const { firstName, lastName, email, code } = await request.json();

    // Validation
    if (!firstName || !email || !code) {
      return NextResponse.json(
        { error: "All fields are required" },
        { status: 400 }
      );
    }

    if (!code || typeof code !== "string" || code.length !== 6) {
      return NextResponse.json(
        { error: "Invalid code format" },
        { status: 400 }
      );
    }

    const normalizedEmail = email.toLowerCase().trim()
    const normalizedCode = code.trim()

    // Check temporary signup data
    if (!global.signupDataMap) {
      return NextResponse.json(
        { error: "No signup data found. Please request a new code." },
        { status: 400 }
      );
    }

    const signupData = global.signupDataMap.get(`signup:${normalizedEmail}`);
    if (!signupData) {
      return NextResponse.json(
        { error: "No signup data found. Please request a new code." },
        { status: 400 }
      );
    }

    // Check if code is expired
    const now = new Date();
    if (now > signupData.expiresAt) {
      global.signupDataMap.delete(`signup:${normalizedEmail}`);
      return NextResponse.json(
        { error: "Code has expired. Please request a new one." },
        { status: 401 }
      );
    }

    // Verify code
    if (signupData.otp !== normalizedCode) {
      return NextResponse.json(
        { error: "Invalid verification code" },
        { status: 401 }
      );
    }

    // Verify the data matches (allow lastName to be optional/matched flexibly)
    if (signupData.firstName !== firstName.trim()) {
      return NextResponse.json(
        { error: "Data mismatch. Please start the signup process again." },
        { status: 400 }
      );
    }
    
    // Use the lastName from signupData if provided, otherwise use firstName
    const finalLastName = (lastName && lastName.trim()) || signupData.lastName || signupData.firstName;

    // Email validation
    const emailRegex = /^\w+([.-]?\w+)*@\w+([.-]?\w+)*(\.\w{2,3})+$/;
    if (!emailRegex.test(normalizedEmail)) {
      return NextResponse.json(
        { error: "Please enter a valid email address" },
        { status: 400 }
      );
    }

    let retries = 3;
    while (retries > 0) {
      try {
        await dbConnect();
        break;
      } catch (dbError) {
        retries--;
        console.error(
          `[v0] Database connection attempt failed. Retries left: ${retries}`,
          dbError
        );

        if (retries === 0) {
          // Check if it's a timeout error
          if (dbError.code === "ETIMEOUT" || dbError.syscall === "querySrv") {
            return NextResponse.json(
              {
                error:
                  "Database connection timeout. Please check your MongoDB connection string and network connectivity.",
              },
              { status: 503 }
            );
          }
          throw dbError;
        }

        // Wait 1 second before retrying
        await new Promise((resolve) => setTimeout(resolve, 1000));
      }
    }

    // Check if user already exists
    const existingUser = await User.findOne({ email: normalizedEmail });
    if (existingUser) {
      global.signupDataMap.delete(`signup:${normalizedEmail}`);
      return NextResponse.json(
        { error: "User with this email already exists" },
        { status: 409 }
      );
    }

    const createStripeCustomer = await stripe.customers.create({
      email: normalizedEmail,
      name: `${signupData.firstName} ${finalLastName}`.trim(),
    });

    console.log("Stripe customer created:", createStripeCustomer);
    console.log("Stripe customer created:", createStripeCustomer.id);

    if (createStripeCustomer.id === undefined) {
      return NextResponse.json(
        { error: "Unable to create stripe customer" },
        { status: 500 }
      );
    }
    // Create user (without password)
    const userData = {
      stripeCustomerId: createStripeCustomer.id,
      firstName: signupData.firstName,
      lastName: finalLastName,
      email: normalizedEmail,
      password: null, // No password for OTP-based auth
      role: "user", // Default role
    };
    const user = new User({ ...userData });
    await user.save();

    console.log("User created:", user);

    // Clean up temporary signup data
    global.signupDataMap.delete(`signup:${normalizedEmail}`);

    // Return user without password
    const { password: _, ...userWithoutPassword } = user.toObject();

    return NextResponse.json(
      {
        message: "User created successfully",
        user: userWithoutPassword,
      },
      { status: 201 }
    );
  } catch (error) {
    console.error("Signup error:", error);

    if (error.code === "ETIMEOUT" || error.syscall === "querySrv") {
      return NextResponse.json(
        {
          error:
            "Database connection timeout. Please verify your MongoDB Atlas cluster is running and accessible.",
        },
        { status: 503 }
      );
    }

    // Handle mongoose validation errors
    if (error.name === "ValidationError") {
      const validationErrors = Object.values(error.errors).map(
        (err: any) => err.message
      );
      return NextResponse.json(
        { error: validationErrors.join(", ") },
        { status: 400 }
      );
    }

    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}
