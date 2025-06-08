import { type NextRequest, NextResponse } from "next/server"
import { authenticateRequest } from "@/lib/auth"
import { db } from "@/lib/database"
import { createPaymentIntent, createStripeCustomer } from "@/lib/stripe"

export async function POST(request: NextRequest) {
  try {
    const auth = await authenticateRequest(request)
    if (!auth) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    const { amount } = await request.json()

    // Validate amount
    if (!amount || amount < 10 || amount > 10000) {
      return NextResponse.json({ error: "Amount must be between $10 and $10,000" }, { status: 400 })
    }

    // Get user
    const user = await db.users.findById(auth.userId)
    if (!user) {
      return NextResponse.json({ error: "User not found" }, { status: 404 })
    }

    // Create or get Stripe customer
    let stripeCustomerId = user.stripeCustomerId
    if (!stripeCustomerId) {
      const customer = await createStripeCustomer(user.email, `${user.firstName} ${user.lastName}`)
      stripeCustomerId = customer.id
      await db.users.updateStripeCustomerId(auth.userId, stripeCustomerId)
    }

    // Create payment intent
    const paymentIntent = await createPaymentIntent(amount, "usd", {
      userId: auth.userId,
      type: "deposit",
      customer_id: stripeCustomerId,
    })

    // Create pending transaction
    const transaction = await db.transactions.create({
      userId: auth.userId,
      type: "deposit",
      amount,
      status: "pending",
      date: new Date(),
      description: "Credit Card Deposit",
      method: "Stripe",
      reference: `DEP-${Date.now()}`,
      stripePaymentIntentId: paymentIntent.id,
    })

    return NextResponse.json({
      clientSecret: paymentIntent.client_secret,
      paymentIntentId: paymentIntent.id,
      transactionId: transaction.id,
    })
  } catch (error) {
    console.error("Create payment intent error:", error)
    return NextResponse.json({ error: "Internal server error" }, { status: 500 })
  }
}
