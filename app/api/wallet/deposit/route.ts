import { type NextRequest, NextResponse } from "next/server"
import { authenticateRequest } from "@/lib/auth"
import { db } from "@/lib/database"

export async function POST(request: NextRequest) {
  try {
    const auth = await authenticateRequest(request)
    if (!auth) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    const { amount, method } = await request.json()

    // Validate input
    if (!amount || amount <= 0 || !method) {
      return NextResponse.json({ error: "Invalid amount or payment method" }, { status: 400 })
    }

    // Simulate payment processing (replace with real payment gateway)
    const isPaymentSuccessful = Math.random() > 0.1 // 90% success rate

    const status = isPaymentSuccessful ? "completed" : "failed"

    // Create transaction
    const transaction = await db.transactions.create({
      userId: auth.userId,
      type: "deposit",
      amount,
      status,
      date: new Date(),
      description: `${method} Deposit`,
      method,
      reference: `DEP-${Date.now()}`,
    })

    // Update user balance if successful
    if (isPaymentSuccessful) {
      const user = await db.users.findById(auth.userId)
      if (user) {
        await db.users.updateBalance(auth.userId, user.balance + amount)
      }
    }

    return NextResponse.json({
      transaction,
      success: isPaymentSuccessful,
      message: isPaymentSuccessful ? "Deposit successful" : "Deposit failed",
    })
  } catch (error) {
    console.error("Deposit error:", error)
    return NextResponse.json({ error: "Internal server error" }, { status: 500 })
  }
}
