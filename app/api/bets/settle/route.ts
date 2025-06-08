import { type NextRequest, NextResponse } from "next/server"
import { authenticateRequest } from "@/lib/auth"
import { db } from "@/lib/database"

interface SettleBetRequest {
  betId: string
  result: "won" | "lost" | "void"
  actualOdds?: number // For system bets or if odds changed
}

export async function POST(request: NextRequest) {
  try {
    const auth = await authenticateRequest(request)
    if (!auth) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    const { betId, result, actualOdds }: SettleBetRequest = await request.json()

    // Validate input
    if (!betId || !result || !["won", "lost", "void"].includes(result)) {
      return NextResponse.json({ error: "Invalid settlement data" }, { status: 400 })
    }

    // Find the bet
    const bet = await db.bets.findById(betId)
    if (!bet) {
      return NextResponse.json({ error: "Bet not found" }, { status: 404 })
    }

    if (bet.status !== "pending") {
      return NextResponse.json({ error: "Bet is already settled" }, { status: 400 })
    }

    // Calculate settlement amounts
    let winAmount = 0
    let profit = 0

    if (result === "won") {
      winAmount = actualOdds ? bet.stake * actualOdds : bet.potentialWin
      profit = winAmount - bet.stake
    } else if (result === "void") {
      winAmount = bet.stake // Return stake
      profit = 0
    } else {
      // Lost
      winAmount = 0
      profit = -bet.stake
    }

    // Update bet
    const updatedBet = await db.bets.update(betId, {
      status: result === "void" ? "void" : result,
      settledAt: new Date(),
      profit,
    })

    // Update user balance if won or void
    if (winAmount > 0) {
      const user = await db.users.findById(bet.userId)
      if (user) {
        await db.users.updateBalance(bet.userId, user.balance + winAmount)
      }

      // Create win transaction
      await db.transactions.create({
        userId: bet.userId,
        type: result === "void" ? "transfer" : "win",
        amount: winAmount,
        status: "completed",
        date: new Date(),
        description: result === "void" ? `Void: ${bet.event}` : `Win: ${bet.event}`,
        reference: result === "void" ? `VOID-${betId}` : `WIN-${betId}`,
      })
    }

    return NextResponse.json({
      success: true,
      message: `Bet ${result} successfully`,
      bet: updatedBet,
      settlement: {
        result,
        winAmount,
        profit,
      },
    })
  } catch (error) {
    console.error("Settle bet error:", error)
    return NextResponse.json({ error: "Internal server error" }, { status: 500 })
  }
}
