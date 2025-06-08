import { type NextRequest, NextResponse } from "next/server"
import { authenticateRequest } from "@/lib/auth"
import { db } from "@/lib/database"

export async function POST(request: NextRequest, { params }: { params: { id: string } }) {
  try {
    const auth = await authenticateRequest(request)
    if (!auth) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    const { cashOutValue } = await request.json()
    const betId = params.id

    // Find bet
    const bet = await db.bets.findById(betId)
    if (!bet || bet.userId !== auth.userId) {
      return NextResponse.json({ error: "Bet not found" }, { status: 404 })
    }

    if (bet.status !== "pending") {
      return NextResponse.json({ error: "Bet cannot be cashed out" }, { status: 400 })
    }

    // Update bet status
    const updatedBet = await db.bets.update(betId, {
      status: "cashed_out",
      cashOutValue,
      settledAt: new Date(),
      profit: cashOutValue - bet.stake,
    })

    // Update user balance
    const user = await db.users.findById(auth.userId)
    if (user) {
      await db.users.updateBalance(auth.userId, user.balance + cashOutValue)
    }

    // Create transaction
    await db.transactions.create({
      userId: auth.userId,
      type: "win",
      amount: cashOutValue,
      status: "completed",
      date: new Date(),
      description: `Cash Out: ${bet.event}`,
      reference: `CASH-${betId}`,
    })

    return NextResponse.json({ bet: updatedBet })
  } catch (error) {
    console.error("Cash out error:", error)
    return NextResponse.json({ error: "Internal server error" }, { status: 500 })
  }
}
