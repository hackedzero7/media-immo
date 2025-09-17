import { dbConnect } from "@/lib/mongodb";
import User from "@/models/User";
import { NextResponse } from "next/server";
import Stripe from "stripe";

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY as string, {
  apiVersion: "2025-08-27.basil",
});

export async function POST(req: Request) {
  try {
    const { email } = await req.json();

    await dbConnect();
    const getUser = await User.findOne({ email });

    if (!getUser || !getUser.stripeCustomerId) {
      return NextResponse.json(
        { message: "Your Account has some issue, please login again" },
        { status: 400 }
      );
    }

    const stripeCustomerId = getUser.stripeCustomerId;

    // Get all active subscriptions
    const subscriptions = await stripe.subscriptions.list({
      customer: stripeCustomerId,
      status: "active",
      expand: ["data.items.data.price"],
    });

    if (subscriptions.data.length === 0) {
      return NextResponse.json({ message: "No active subscriptions" });
    }

    const allItems = await Promise.all(
      subscriptions.data.flatMap((subscription: any) =>
        subscription.items.data.map(async (item: any) => {
          const productId = item.price.product as string;
          const product = await stripe.products.retrieve(productId);

          return {
            subscriptionId: subscription.id,
            status: subscription.status,
            currentPeriodEnd: new Date(item.current_period_end * 1000),
            priceId: item.price.id,
            priceAmount: (item.price.unit_amount || 0) / 100,
            priceCurrency: item.price.currency,
            interval: item.price.recurring?.interval,
            productId,
            productName: product.name,
          };
        })
      )
    );

    return NextResponse.json({ subscriptions: allItems[0] });
  } catch (error: any) {
    console.error("Error fetching subscriptions:", error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}

export async function PUT(req: Request) {
  try {
    const data = await req.json();
    const { subscriptionId } = data;
    const sub = await stripe.subscriptions.cancel(subscriptionId, {
      prorate: false,
    });

    return NextResponse.json({
      message: "Subscription Cancel Successfully",
      subscription: sub,
    });
  } catch (error: any) {
    console.error("Error fetching subscriptions:", error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}

export async function GET() {
  try {
    const getAllUsers = await User.find({});
    await dbConnect();
    let users = [];
    for (let i = 0; i < getAllUsers.length; i += 1) {
      const user = getAllUsers[i];
      const customerStripeId = user.stripeCustomerId;

      const subscriptions = await stripe.subscriptions.list({
        customer: customerStripeId,
        status: "active",
        expand: ["data.items.data.price"],
        limit: 1,
      });

      const userObj = user.toObject();

      if (subscriptions.data.length > 0) {
        const subscription = subscriptions.data[0];
        const item = subscription.items.data[0];

        const productId = item.price.product as string;
        const product = await stripe.products.retrieve(productId);

        userObj.subscription = {
          subscriptionId: subscription.id,
          status: subscription.status,
          currentPeriodEnd: new Date(item.current_period_end * 1000),
          priceId: item.price.id,
          priceAmount: (item.price.unit_amount || 0) / 100,
          priceCurrency: item.price.currency,
          interval: item.price.recurring?.interval,
          productId,
          productName: product.name,
        };

        console.log("this is the user", user);
        users.push(userObj);
      } else {
        userObj.subscription = {
          subscriptionId: "",
          status: "cancelled",
          currentPeriodEnd: new Date().setMonth(new Date().getMonth() + 1),
          priceId: "-",
          priceAmount: 0.0,
          priceCurrency: "-",
          interval: "month",
          productId: "-",
          productName: "Free",
        };
        users.push(userObj);
      }
    }
    // console.log("these are the users", users);
    return NextResponse.json({ result: users });
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
