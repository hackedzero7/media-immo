import { NextResponse } from "next/server"
import Stripe from "stripe"
import { dbConnect } from "@/lib/mongodb"
import User from "@/models/User"

export async function POST(req: Request) {
  try {
    const { email } = await req.json()

    if (!email) {
      return NextResponse.json({ error: "Email is required" }, { status: 400 })
    }

    await dbConnect()
    const user = await User.findOne({ email })

    if (!user || !user.stripeCustomerId) {
      return NextResponse.json({ error: "User or subscription not found" }, { status: 404 })
    }

    const secret = process.env.STRIPE_SECRET_KEY
    if (!secret) {
      return NextResponse.json({ error: "Missing STRIPE_SECRET_KEY" }, { status: 500 })
    }

    const stripe = new Stripe(secret)

    const invoices = await stripe.invoices.list({
      customer: user.stripeCustomerId,
      limit: 100,
      status: "paid",
    })

    const invoiceList = invoices.data.map((invoice) => ({
      id: invoice.id,
      number: invoice.number,
      date: new Date(invoice.created * 1000).toLocaleDateString(),
      amount: (invoice.amount_paid || 0) / 100,
      currency: invoice.currency?.toUpperCase(),
      status: invoice.status,
      pdfUrl: invoice.invoice_pdf,
      subscriptionId: invoice.subscription,
    }))

    return NextResponse.json({ invoices: invoiceList })
  } catch (err: any) {
    console.error("[v0] POST /api/invoices/list error:", err?.message || err)
    return NextResponse.json({ error: err?.message || "Internal Server Error" }, { status: 500 })
  }
}
