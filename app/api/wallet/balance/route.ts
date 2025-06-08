import { type NextRequest, NextResponse } from "next/server"
import { authenticateRequest } from "@/lib/auth"
import { db } from "@/lib/database"

export async function GET(request: NextRequest) {
  try {
    const auth = await authenticateRequest(request)
    if (!auth) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    const user = await db.users.findById(auth.userId)
    if (!user) {
      return NextResponse.json({ error: "User not found" }, { status: 404 })
    }

    // Get pending withdrawals
    const pendingWithdrawals = await db.transactions.findByType(auth.userId, "withdrawal")
    const pendingAmount = pendingWithdrawals
      .filter((t) => t.status === "pending")
      .reduce((sum, t) => sum + Math.abs(t.amount), 0)

    // Calculate total deposited and withdrawn
    const deposits = await db.transactions.findByType(auth.userId, "deposit")
    const withdrawals = await db.transactions.findByType(auth.userId, "withdrawal")

    const totalDeposited = deposits.filter((t) => t.status === "completed").reduce((sum, t) => sum + t.amount, 0)

    const totalWithdrawn = withdrawals
      .filter((t) => t.status === "completed")
      .reduce((sum, t) => sum + Math.abs(t.amount), 0)

    return NextResponse.json({
      balance: user.balance,
      bonusBalance: user.bonusBalance,
      pendingWithdrawals: pendingAmount,
      totalDeposited,
      totalWithdrawn,
      availableForWithdrawal: user.balance,
    })
  } catch (error) {
    console.error("Get balance error:", error)
    return NextResponse.json({ error: "Internal server error" }, { status: 500 })
  }
}
