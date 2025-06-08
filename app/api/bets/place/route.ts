import { type NextRequest, NextResponse } from "next/server"
import { authenticateRequest } from "@/lib/auth"
import { db } from "@/lib/database"

interface BetSelection {
  eventId: string
  market: string
  selection: string
  odds: number
  eventName: string
  sport: string
  league: string
}

interface PlaceBetRequest {
  selections: BetSelection[]
  betType: "single" | "accumulator" | "system"
  stakes: Record<string, number> // For singles: key is "eventId-market", for accumulators: key is "accumulator"
  systemType?: string // For system bets like "2/3", "3/4", etc.
}

export async function POST(request: NextRequest) {
  try {
    const auth = await authenticateRequest(request)
    if (!auth) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    const { selections, betType, stakes, systemType }: PlaceBetRequest = await request.json()

    // Validate input
    if (!selections || !Array.isArray(selections) || selections.length === 0) {
      return NextResponse.json({ error: "At least one selection is required" }, { status: 400 })
    }

    if (!betType || !["single", "accumulator", "system"].includes(betType)) {
      return NextResponse.json({ error: "Invalid bet type" }, { status: 400 })
    }

    if (!stakes || Object.keys(stakes).length === 0) {
      return NextResponse.json({ error: "Stakes are required" }, { status: 400 })
    }

    // Validate selections
    for (const selection of selections) {
      if (!selection.eventId || !selection.market || !selection.selection || !selection.odds || !selection.eventName) {
        return NextResponse.json({ error: "Invalid selection data" }, { status: 400 })
      }

      if (selection.odds < 1.01 || selection.odds > 1000) {
        return NextResponse.json({ error: "Invalid odds range" }, { status: 400 })
      }
    }

    // Get user and check balance
    const user = await db.users.findById(auth.userId)
    if (!user) {
      return NextResponse.json({ error: "User not found" }, { status: 404 })
    }

    // Calculate total stake and validate
    let totalStake = 0
    const placedBets: any[] = []
    const transactions: any[] = []

    if (betType === "single") {
      // Process single bets
      for (const selection of selections) {
        const stakeKey = `${selection.eventId}-${selection.market}`
        const stake = stakes[stakeKey]

        if (!stake || stake <= 0) {
          return NextResponse.json({ error: `Invalid stake for ${selection.selection}` }, { status: 400 })
        }

        if (stake < 1 || stake > 10000) {
          return NextResponse.json({ error: "Stake must be between $1 and $10,000" }, { status: 400 })
        }

        totalStake += stake
      }

      // Check if user has sufficient balance
      if (user.balance < totalStake) {
        return NextResponse.json({ error: "Insufficient balance" }, { status: 400 })
      }

      // Create individual bets
      for (const selection of selections) {
        const stakeKey = `${selection.eventId}-${selection.market}`
        const stake = stakes[stakeKey]
        const potentialWin = stake * selection.odds

        const bet = await db.bets.create({
          userId: auth.userId,
          event: selection.eventName,
          selection: selection.selection,
          odds: selection.odds,
          stake,
          potentialWin,
          status: "pending",
          date: new Date(),
          sport: selection.sport,
          league: selection.league,
          betType: "single",
        })

        placedBets.push(bet)

        // Create transaction for this bet
        const transaction = await db.transactions.create({
          userId: auth.userId,
          type: "bet",
          amount: -stake,
          status: "completed",
          date: new Date(),
          description: `Bet: ${selection.eventName} - ${selection.selection}`,
          reference: `BET-${bet.id}`,
        })

        transactions.push(transaction)
      }
    } else if (betType === "accumulator") {
      // Process accumulator bet
      const accumulatorStake = stakes["accumulator"]

      if (!accumulatorStake || accumulatorStake <= 0) {
        return NextResponse.json({ error: "Invalid accumulator stake" }, { status: 400 })
      }

      if (accumulatorStake < 1 || accumulatorStake > 10000) {
        return NextResponse.json({ error: "Stake must be between $1 and $10,000" }, { status: 400 })
      }

      if (selections.length < 2) {
        return NextResponse.json({ error: "Accumulator requires at least 2 selections" }, { status: 400 })
      }

      totalStake = accumulatorStake

      // Check if user has sufficient balance
      if (user.balance < totalStake) {
        return NextResponse.json({ error: "Insufficient balance" }, { status: 400 })
      }

      // Calculate combined odds
      const combinedOdds = selections.reduce((odds, selection) => odds * selection.odds, 1)
      const potentialWin = accumulatorStake * combinedOdds

      // Create accumulator bet
      const eventNames = selections.map((s) => s.eventName).join(" + ")
      const selectionNames = selections.map((s) => s.selection).join(" + ")

      const bet = await db.bets.create({
        userId: auth.userId,
        event: `Accumulator: ${eventNames}`,
        selection: selectionNames,
        odds: combinedOdds,
        stake: accumulatorStake,
        potentialWin,
        status: "pending",
        date: new Date(),
        sport: "Multiple",
        league: "Multiple",
        betType: "accumulator",
      })

      placedBets.push(bet)

      // Create transaction
      const transaction = await db.transactions.create({
        userId: auth.userId,
        type: "bet",
        amount: -accumulatorStake,
        status: "completed",
        date: new Date(),
        description: `Accumulator Bet: ${selections.length} selections`,
        reference: `BET-${bet.id}`,
      })

      transactions.push(transaction)
    } else if (betType === "system") {
      // Process system bet (e.g., 2/3, 3/4)
      if (!systemType) {
        return NextResponse.json({ error: "System type is required for system bets" }, { status: 400 })
      }

      const systemStake = stakes["system"]
      if (!systemStake || systemStake <= 0) {
        return NextResponse.json({ error: "Invalid system stake" }, { status: 400 })
      }

      if (selections.length < 3) {
        return NextResponse.json({ error: "System bet requires at least 3 selections" }, { status: 400 })
      }

      // Parse system type (e.g., "2/3" means 2 selections from 3)
      const [systemSize, totalSelections] = systemType.split("/").map(Number)

      if (totalSelections !== selections.length) {
        return NextResponse.json({ error: "System type doesn't match number of selections" }, { status: 400 })
      }

      // Calculate number of combinations
      const combinations = calculateCombinations(selections.length, systemSize)
      totalStake = systemStake * combinations

      // Check if user has sufficient balance
      if (user.balance < totalStake) {
        return NextResponse.json({ error: "Insufficient balance" }, { status: 400 })
      }

      // Create system bet
      const eventNames = selections.map((s) => s.eventName).join(" + ")
      const selectionNames = selections.map((s) => s.selection).join(" + ")

      const bet = await db.bets.create({
        userId: auth.userId,
        event: `System ${systemType}: ${eventNames}`,
        selection: selectionNames,
        odds: 0, // System bets don't have single odds
        stake: totalStake,
        potentialWin: 0, // Will be calculated when settled
        status: "pending",
        date: new Date(),
        sport: "Multiple",
        league: "Multiple",
        betType: "system",
      })

      placedBets.push(bet)

      // Create transaction
      const transaction = await db.transactions.create({
        userId: auth.userId,
        type: "bet",
        amount: -totalStake,
        status: "completed",
        date: new Date(),
        description: `System ${systemType} Bet: ${selections.length} selections`,
        reference: `BET-${bet.id}`,
      })

      transactions.push(transaction)
    }

    // Update user balance
    await db.users.updateBalance(auth.userId, user.balance - totalStake)

    return NextResponse.json({
      success: true,
      message: `${betType.charAt(0).toUpperCase() + betType.slice(1)} bet${placedBets.length > 1 ? "s" : ""} placed successfully`,
      bets: placedBets,
      transactions,
      totalStake,
      newBalance: user.balance - totalStake,
    })
  } catch (error) {
    console.error("Place bet error:", error)
    return NextResponse.json({ error: "Internal server error" }, { status: 500 })
  }
}

// Helper function to calculate combinations for system bets
function calculateCombinations(n: number, r: number): number {
  if (r > n) return 0
  if (r === 0 || r === n) return 1

  let result = 1
  for (let i = 0; i < r; i++) {
    result = (result * (n - i)) / (i + 1)
  }
  return Math.round(result)
}
