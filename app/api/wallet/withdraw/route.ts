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

    // Check user balance
    const user = await db.users.findById(auth.userId)
    if (!user || user.balance < amount) {
      return NextResponse.json({ error: "Insufficient balance" }, { status: 400 })
    }

    // Create pending withdrawal transaction
    const transaction = await db.transactions.create({
      userId: auth.userId,
      type: "withdrawal",
      amount: -amount,
      status: "pending",
      date: new Date(),
      description: `${method} Withdrawal`,
      method,
      reference: `WTH-${Date.now()}`,
    })

    // Update user balance
    await db.users.updateBalance(auth.userId, user.balance - amount)

    return NextResponse.json({
      transaction,
      message: "Withdrawal request submitted",
    })
  } catch (error) {
    console.error("Withdrawal error:", error)
    return NextResponse.json({ error: "Internal server error" }, { status: 500 })
  }
}
