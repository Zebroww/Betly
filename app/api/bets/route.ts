import { type NextRequest, NextResponse } from "next/server"
import { authenticateRequest } from "@/lib/auth"
import { db } from "@/lib/database"

export async function GET(request: NextRequest) {
  try {
    const auth = await authenticateRequest(request)
    if (!auth) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    const bets = await db.bets.findByUserId(auth.userId)
    return NextResponse.json({ bets })
  } catch (error) {
    console.error("Get bets error:", error)
    return NextResponse.json({ error: "Internal server error" }, { status: 500 })
  }
}

export async function POST(request: NextRequest) {
  try {
    const auth = await authenticateRequest(request)
    if (!auth) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    const { event, selection, odds, stake, sport, league, betType } = await request.json()

    // Validate input
    if (!event || !selection || !odds || !stake || !sport || !league || !betType) {
      return NextResponse.json({ error: "All fields are required" }, { status: 400 })
    }

    // Check user balance
    const user = await db.users.findById(auth.userId)
    if (!user || user.balance < stake) {
      return NextResponse.json({ error: "Insufficient balance" }, { status: 400 })
    }

    // Calculate potential win
    const potentialWin = stake * odds

    // Create bet
    const bet = await db.bets.create({
      userId: auth.userId,
      event,
      selection,
      odds,
      stake,
      potentialWin,
      status: "pending",
      date: new Date(),
      sport,
      league,
      betType,
    })

    // Update user balance
    await db.users.updateBalance(auth.userId, user.balance - stake)

    // Create transaction
    await db.transactions.create({
      userId: auth.userId,
      type: "bet",
      amount: -stake,
      status: "completed",
      date: new Date(),
      description: `Bet: ${event}`,
      reference: `BET-${bet.id}`,
    })

    return NextResponse.json({ bet })
  } catch (error) {
    console.error("Place bet error:", error)
    return NextResponse.json({ error: "Internal server error" }, { status: 500 })
  }
}
