import { dbConnect } from "@/lib/mongodb";
import User from "@/models/User";
import { NextResponse } from "next/server";
import Stripe from "stripe";
import { sendPurchaseEmails, sendCancellationEmails } from "@/lib/mailer"
import EmailLog from "@/models/EmailLog";
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
    const summary = allItems[0]

    if (summary) {
      try {
        const alreadySent = await EmailLog.findOne({
          userId: getUser._id,
          subscriptionId: summary.subscriptionId,
          type: "purchase",
        })

        if (!alreadySent) {
          await sendPurchaseEmails({
            userEmail: email,
            productName: summary.productName,
            priceAmount: summary.priceAmount,
            priceCurrency: summary.priceCurrency,
            interval: summary.interval,
            subscriptionId: summary.subscriptionId,
            currentPeriodEnd: summary.currentPeriodEnd,
          })

          await EmailLog.create({
            userId: getUser._id,
            subscriptionId: summary.subscriptionId,
            type: "purchase",
          })
        }
      } catch (mailErr) {
        console.warn("[v0] Purchase email send/log failed:", mailErr)
        // Do not fail the entire request on mailer/log error
      }
    }

    return NextResponse.json({ subscriptions: summary });
  } catch (error: any) {
    console.error("Error fetching subscriptions:", error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}

export async function PUT(req: Request) {
  try {
    const data = await req.json()
    // actor: "user" -> notify admin, "admin" -> notify user
    const {
      subscriptionId,
      actor,
      email: inputEmail,
    } = data as {
      subscriptionId: string
      actor?: "user" | "admin"
      email?: string
    }

    const cancelled = await stripe.subscriptions.cancel(subscriptionId, {
      prorate: false,
    })

    // Retrieve details to enrich email (product name, customer email)
    const sub = await stripe.subscriptions.retrieve(subscriptionId, {
      expand: ["items.data.price.product", "customer"],
    })

    const firstItem = sub.items?.data?.[0]
    const price: any = firstItem?.price
    // If not expanded to product object, fallback to string ID
    let productName = "Subscription"
    try {
      if (price?.product && typeof price.product === "object" && "name" in price.product) {
        productName = (price.product as any).name || productName
      } else if (price?.product && typeof price.product === "string") {
        const product = await stripe.products.retrieve(price.product)
        productName = product.name || productName
      }
    } catch {
      // ignore product fetch errors, keep default
    }

    // Derive user email if not provided and actor === "admin"
    let userEmail = inputEmail
    try {
      const cust = sub.customer as any
      if (!userEmail && cust && typeof cust === "object") {
        userEmail = cust.email || userEmail
      }
      if (!userEmail && typeof sub.customer === "string") {
        const customerObj = await stripe.customers.retrieve(sub.customer)
        if (!("deleted" in customerObj)) {
          userEmail = (customerObj as any).email || userEmail
        }
      }
    } catch {
      // ignore customer lookup failures
    }

    // Fire-and-forget email based on who cancelled
    if (actor === "user" || actor === "admin") {
      sendCancellationEmails({
        actor,
        userEmail,
        productName,
        subscriptionId,
      }).catch((err) => console.warn("[v0] sendCancellationEmails failed:", err))
    }

    return NextResponse.json({
      message: "Subscription Cancel Successfully",
      subscription: cancelled,
    })
  } catch (error: any) {
    console.error("Error fetching subscriptions:", error)
    return NextResponse.json({ error: error.message }, { status: 500 })
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
