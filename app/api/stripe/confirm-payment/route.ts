import { type NextRequest, NextResponse } from "next/server"
import { authenticateRequest } from "@/lib/auth"
import { db } from "@/lib/database"
import { retrievePaymentIntent } from "@/lib/stripe"

export async function POST(request: NextRequest) {
  try {
    const auth = await authenticateRequest(request)
    if (!auth) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    const { paymentIntentId } = await request.json()

    if (!paymentIntentId) {
      return NextResponse.json({ error: "Payment intent ID is required" }, { status: 400 })
    }

    // Retrieve payment intent from Stripe
    const paymentIntent = await retrievePaymentIntent(paymentIntentId)

    // Find the transaction
    const transaction = await db.transactions.findByStripePaymentIntent(paymentIntentId)
    if (!transaction || transaction.userId !== auth.userId) {
      return NextResponse.json({ error: "Transaction not found" }, { status: 404 })
    }

    // Check payment status
    if (paymentIntent.status === "succeeded") {
      // Update transaction status
      await db.transactions.updateStatus(transaction.id!, "completed")

      // Update user balance
      const user = await db.users.findById(auth.userId)
      if (user) {
        await db.users.updateBalance(auth.userId, user.balance + transaction.amount)
      }

      return NextResponse.json({
        success: true,
        message: "Payment successful",
        amount: transaction.amount,
      })
    } else if (paymentIntent.status === "payment_failed") {
      // Update transaction status
      await db.transactions.updateStatus(transaction.id!, "failed")

      return NextResponse.json({
        success: false,
        message: "Payment failed",
      })
    } else {
      return NextResponse.json({
        success: false,
        message: "Payment is still processing",
      })
    }
  } catch (error) {
    console.error("Confirm payment error:", error)
    return NextResponse.json({ error: "Internal server error" }, { status: 500 })
  }
}
