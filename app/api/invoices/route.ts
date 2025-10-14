import { NextResponse } from "next/server"
import Stripe from "stripe"

export async function GET(req: Request) {
  try {
    const url = new URL(req.url)
    const subscriptionId = url.searchParams.get("subscriptionId")

    if (!subscriptionId) {
      return NextResponse.json({ error: "subscriptionId is required" }, { status: 400 })
    }

    const secret = process.env.STRIPE_SECRET_KEY
    if (!secret) {
      return NextResponse.json({ error: "Missing STRIPE_SECRET_KEY" }, { status: 500 })
    }

    const stripe = new Stripe(secret)

    // Find most recent finalized invoice for this subscription
    const invoices = await stripe.invoices.list({
      subscription: subscriptionId,
      limit: 1,
    })

    if (!invoices.data?.length) {
      return NextResponse.json({ error: "No invoices found for this subscription" }, { status: 404 })
    }

    const invoice = invoices.data[0]
    // invoice.invoice_pdf is a direct, time-limited PDF URL hosted by Stripe
    if (!invoice.invoice_pdf) {
      return NextResponse.json({ error: "No PDF available for the latest invoice" }, { status: 404 })
    }

    // Fetch and stream the PDF back to the browser with a download filename
    const pdfRes = await fetch(invoice.invoice_pdf)
    if (!pdfRes.ok || !pdfRes.body) {
      return NextResponse.json({ error: "Unable to fetch invoice PDF" }, { status: 502 })
    }

    const fileName = `invoice-${invoice.number || invoice.id}.pdf`
    return new Response(pdfRes.body, {
      status: 200,
      headers: {
        "content-type": "application/pdf",
        "content-disposition": `attachment; filename="${fileName}"`,
        "cache-control": "no-store",
      },
    })
  } catch (err: any) {
    console.error("[v0] GET /api/invoices error:", err?.message || err)
    return NextResponse.json({ error: err?.message || "Internal Server Error" }, { status: 500 })
  }
}
