import { NextResponse } from "next/server";
import Stripe from "stripe";

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY as string, {
  apiVersion: "2025-08-27.basil",
});

export async function POST(req: Request) {
  try {
    const { email } = await req.json();

    const customers = await stripe.customers.list({ email, limit: 1 });
    let customer = customers.data[0];
    console.log("Existing customer:", customer?.id);

    if (!customer) {
      return NextResponse.json(
        { message: "No customer found" },
        { status: 404 }
      );
    }

    const subscriptions = await stripe.subscriptions.list({
      customer: customer.id,
      status: "active",
      expand: ["data.items.data.price"],
    });

    if (subscriptions.data.length === 0) {
      return NextResponse.json({ message: "No active subscriptions" });
    }

    const subscription = subscriptions.data[0];
    const items = await Promise.all(
      subscription.items.data.map(async (item) => {
        const productId = item.price.product as string;
        const product = await stripe.products.retrieve(productId);

        return {
          subscriptionId: subscription.id,
          priceId: item.price.id,
          priceAmount: (item.price.unit_amount || 0) / 100,
          priceCurrency: item.price.currency,
          interval: item.price.recurring?.interval,
          productId,
          productName: product.name,
        };
      })
    );

    return NextResponse.json({ items });
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
