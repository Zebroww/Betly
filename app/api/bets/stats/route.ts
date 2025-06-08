import { type NextRequest, NextResponse } from "next/server"
import { authenticateRequest } from "@/lib/auth"
import { db } from "@/lib/database"

export async function GET(request: NextRequest) {
  try {
    const auth = await authenticateRequest(request)
    if (!auth) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    const stats = await db.bets.getStats(auth.userId)

    // Calculate additional metrics
    const winRate = stats.totalBets > 0 ? (stats.wonBets / (stats.wonBets + stats.lostBets)) * 100 : 0
    const roi = stats.totalStaked > 0 ? (stats.totalProfit / stats.totalStaked) * 100 : 0

    return NextResponse.json({
      ...stats,
      winRate: Math.round(winRate * 10) / 10, // Round to 1 decimal
      roi: Math.round(roi * 10) / 10, // Round to 1 decimal
    })
  } catch (error) {
    console.error("Get bet stats error:", error)
    return NextResponse.json({ error: "Internal server error" }, { status: 500 })
  }
}
