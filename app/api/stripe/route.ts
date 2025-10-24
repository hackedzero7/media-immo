import { dbConnect } from "@/lib/mongodb";
import User from "@/models/User";
import { NextResponse } from "next/server";
import Stripe from "stripe";

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY as string, {
  apiVersion: "2025-08-27.basil",
});

export async function POST(req: Request) {
  try {
    const { email, priceId } = await req.json();
    await dbConnect();

    const getUser = await User.findOne({ email });

    if (!getUser) {
      return NextResponse.json(
        {
          message: "Your Account have some issue please login again",
        },
        { status: 400 }
      );
    }

    const session = await stripe.checkout.sessions.create({
      mode: "subscription",
      payment_method_types: ["card"],
      customer: getUser?.stripeCustomerId,
      line_items: [
        {
          price: priceId,
          quantity: 1,
        },
      ],
      automatic_tax: {
        enabled: true,
      },
      tax_id_collection: {
        enabled: true,
      },
      customer_update: {
        address: "auto",
        name: "auto",
      },
      success_url: `${process.env.NEXT_PUBLIC_BASE_URL}/success?session_id={CHECKOUT_SESSION_ID}`,
      cancel_url: `${process.env.NEXT_PUBLIC_BASE_URL}`,
    });

    return NextResponse.json({ url: session.url });
  } catch (error: any) {
    console.log('this is the error', error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
