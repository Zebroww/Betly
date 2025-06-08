import { type NextRequest, NextResponse } from "next/server"
import { stripe } from "@/lib/stripe"
import { db } from "@/lib/database"

const webhookSecret = process.env.STRIPE_WEBHOOK_SECRET!

export async function POST(request: NextRequest) {
  try {
    const body = await request.text()
    const signature = request.headers.get("stripe-signature")!

    let event
    try {
      event = stripe.webhooks.constructEvent(body, signature, webhookSecret)
    } catch (err) {
      console.error("Webhook signature verification failed:", err)
      return NextResponse.json({ error: "Invalid signature" }, { status: 400 })
    }

    // Handle the event
    switch (event.type) {
      case "payment_intent.succeeded": {
        const paymentIntent = event.data.object
        console.log("Payment succeeded:", paymentIntent.id)

        // Find and update transaction
        const transaction = await db.transactions.findByStripePaymentIntent(paymentIntent.id)
        if (transaction) {
          await db.transactions.updateStatus(transaction.id!, "completed")

          // Update user balance
          const user = await db.users.findById(transaction.userId)
          if (user) {
            await db.users.updateBalance(transaction.userId, user.balance + transaction.amount)
          }
        }
        break
      }

      case "payment_intent.payment_failed": {
        const paymentIntent = event.data.object
        console.log("Payment failed:", paymentIntent.id)

        // Find and update transaction
        const transaction = await db.transactions.findByStripePaymentIntent(paymentIntent.id)
        if (transaction) {
          await db.transactions.updateStatus(transaction.id!, "failed")
        }
        break
      }

      case "setup_intent.succeeded": {
        const setupIntent = event.data.object
        console.log("Setup intent succeeded:", setupIntent.id)
        // Payment method was successfully saved
        break
      }

      default:
        console.log(`Unhandled event type: ${event.type}`)
    }

    return NextResponse.json({ received: true })
  } catch (error) {
    console.error("Webhook error:", error)
    return NextResponse.json({ error: "Webhook handler failed" }, { status: 500 })
  }
}
