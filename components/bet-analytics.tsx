"use client"

import { useState, useEffect } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Progress } from "@/components/ui/progress"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { TrendingUp, Target, Calendar, Trophy, RefreshCw, AlertCircle } from "lucide-react"

interface MonthlyStats {
  [key: string]: {
    bets: number
    wins: number
    profit: number
  }
}

interface SportBreakdown {
  sport: string
  bets: number
  winRate: number
  profit: number
}

interface BetTypeStats {
  type: string
  count: number
  winRate: number
  avgOdds: number
}

interface Streaks {
  currentWinStreak: number
  longestWinStreak: number
  currentLossStreak: number
  longestLossStreak: number
}

interface AnalyticsData {
  monthlyStats: MonthlyStats
  sportBreakdown: SportBreakdown[]
  betTypeStats: BetTypeStats[]
  streaks: Streaks
}

interface Bet {
  id: string
  event: string
  selection: string
  odds: number
  stake: number
  potentialWin: number
  status: "pending" | "won" | "lost" | "void" | "cashed_out"
  date: string
  sport: string
  league: string
  betType: "single" | "accumulator" | "system"
  profit?: number
  settledAt?: string
}

export function BetAnalytics() {
  const [analyticsData, setAnalyticsData] = useState<AnalyticsData | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [refreshing, setRefreshing] = useState(false)

  const fetchBetsAndCalculateAnalytics = async () => {
    try {
      setError(null)
      const response = await fetch("/api/bets")

      if (!response.ok) {
        if (response.status === 401) {
          throw new Error("Please log in to view your analytics")
        }
        throw new Error("Failed to fetch betting data")
      }

      const data = await response.json()
      const bets: Bet[] = data.bets || []

      // Calculate analytics from the bets data
      const analytics = calculateAnalytics(bets)
      setAnalyticsData(analytics)
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to load analytics")
      console.error("Fetch analytics error:", err)
    } finally {
      setLoading(false)
      setRefreshing(false)
    }
  }

  const refreshAnalytics = async () => {
    setRefreshing(true)
    await fetchBetsAndCalculateAnalytics()
  }

  useEffect(() => {
    fetchBetsAndCalculateAnalytics()
  }, [])

  const calculateAnalytics = (bets: Bet[]): AnalyticsData => {
    // Calculate monthly stats
    const monthlyStats: MonthlyStats = {}
    const now = new Date()
    const months = [
      "january",
      "february",
      "march",
      "april",
      "may",
      "june",
      "july",
      "august",
      "september",
      "october",
      "november",
      "december",
    ]

    // Get last 3 months
    for (let i = 0; i < 3; i++) {
      const monthDate = new Date(now.getFullYear(), now.getMonth() - i, 1)
      const monthName = months[monthDate.getMonth()]
      const monthBets = bets.filter((bet) => {
        const betDate = new Date(bet.date)
        return betDate.getMonth() === monthDate.getMonth() && betDate.getFullYear() === monthDate.getFullYear()
      })

      const wins = monthBets.filter((bet) => bet.status === "won").length
      const profit = monthBets.reduce((sum, bet) => sum + (bet.profit || 0), 0)

      monthlyStats[monthName] = {
        bets: monthBets.length,
        wins,
        profit,
      }
    }

    // Calculate sport breakdown
    const sportMap = new Map<string, { bets: number; wins: number; profit: number }>()

    bets.forEach((bet) => {
      const sport = bet.sport || "Unknown"
      if (!sportMap.has(sport)) {
        sportMap.set(sport, { bets: 0, wins: 0, profit: 0 })
      }

      const sportData = sportMap.get(sport)!
      sportData.bets++
      if (bet.status === "won") sportData.wins++
      sportData.profit += bet.profit || 0
    })

    const sportBreakdown: SportBreakdown[] = Array.from(sportMap.entries())
      .map(([sport, data]) => ({
        sport,
        bets: data.bets,
        winRate: data.bets > 0 ? (data.wins / data.bets) * 100 : 0,
        profit: data.profit,
      }))
      .sort((a, b) => b.bets - a.bets)

    // Calculate bet type stats
    const betTypeMap = new Map<string, { count: number; wins: number; totalOdds: number }>()

    bets.forEach((bet) => {
      const type = bet.betType || "single"
      const capitalizedType = type.charAt(0).toUpperCase() + type.slice(1)

      if (!betTypeMap.has(capitalizedType)) {
        betTypeMap.set(capitalizedType, { count: 0, wins: 0, totalOdds: 0 })
      }

      const typeData = betTypeMap.get(capitalizedType)!
      typeData.count++
      if (bet.status === "won") typeData.wins++
      typeData.totalOdds += bet.odds
    })

    const betTypeStats: BetTypeStats[] = Array.from(betTypeMap.entries()).map(([type, data]) => ({
      type,
      count: data.count,
      winRate: data.count > 0 ? (data.wins / data.count) * 100 : 0,
      avgOdds: data.count > 0 ? data.totalOdds / data.count : 0,
    }))

    // Calculate streaks
    const settledBets = bets
      .filter((bet) => bet.status === "won" || bet.status === "lost")
      .sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime())

    let currentWinStreak = 0
    let currentLossStreak = 0
    let longestWinStreak = 0
    let longestLossStreak = 0
    let tempWinStreak = 0
    let tempLossStreak = 0

    // Calculate current streaks
    for (const bet of settledBets) {
      if (bet.status === "won") {
        if (currentWinStreak === 0 && currentLossStreak === 0) {
          currentWinStreak++
        } else if (currentWinStreak > 0) {
          currentWinStreak++
        } else {
          break
        }
      } else if (bet.status === "lost") {
        if (currentLossStreak === 0 && currentWinStreak === 0) {
          currentLossStreak++
        } else if (currentLossStreak > 0) {
          currentLossStreak++
        } else {
          break
        }
      }
    }

    // Calculate longest streaks
    for (const bet of settledBets) {
      if (bet.status === "won") {
        tempWinStreak++
        tempLossStreak = 0
        longestWinStreak = Math.max(longestWinStreak, tempWinStreak)
      } else if (bet.status === "lost") {
        tempLossStreak++
        tempWinStreak = 0
        longestLossStreak = Math.max(longestLossStreak, tempLossStreak)
      }
    }

    const streaks: Streaks = {
      currentWinStreak,
      longestWinStreak,
      currentLossStreak,
      longestLossStreak,
    }

    return {
      monthlyStats,
      sportBreakdown,
      betTypeStats,
      streaks,
    }
  }

  if (loading) {
    return (
      <div className="space-y-6">
        {/* Loading skeletons */}
        {[1, 2, 3, 4].map((i) => (
          <Card key={i}>
            <CardHeader>
              <div className="animate-pulse flex items-center gap-2">
                <div className="h-5 w-5 bg-muted rounded"></div>
                <div className="h-6 bg-muted rounded w-48"></div>
              </div>
            </CardHeader>
            <CardContent>
              <div className="animate-pulse space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  {[1, 2, 3].map((j) => (
                    <div key={j} className="h-24 bg-muted rounded"></div>
                  ))}
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    )
  }

  if (error) {
    return (
      <Alert variant="destructive">
        <AlertCircle className="h-4 w-4" />
        <AlertDescription className="flex items-center justify-between">
          {error}
          <Button variant="outline" size="sm" onClick={fetchBetsAndCalculateAnalytics} className="ml-2">
            <RefreshCw className="h-4 w-4 mr-1" />
            Retry
          </Button>
        </AlertDescription>
      </Alert>
    )
  }

  if (!analyticsData) {
    return (
      <div className="text-center py-12">
        <Trophy className="h-12 w-12 mx-auto mb-4 text-muted-foreground" />
        <h3 className="text-lg font-semibold mb-2">No betting data yet</h3>
        <p className="text-muted-foreground mb-4">Start placing bets to see your analytics</p>
        <Button asChild>
          <a href="/betting">Place Your First Bet</a>
        </Button>
      </div>
    )
  }

  return (
    <div className="space-y-6">
      {/* Refresh button */}
      <div className="flex justify-between items-center">
        <h2 className="text-xl font-semibold">Betting Analytics</h2>
        <Button variant="outline" size="sm" onClick={refreshAnalytics} disabled={refreshing}>
          <RefreshCw className={`h-4 w-4 mr-1 ${refreshing ? "animate-spin" : ""}`} />
          Refresh
        </Button>
      </div>

      {/* Monthly Performance */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Calendar className="h-5 w-5" />
            Monthly Performance
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {Object.entries(analyticsData.monthlyStats).map(([month, stats]) => (
              <div key={month} className="p-4 border rounded-lg">
                <h3 className="font-medium capitalize mb-2">{month}</h3>
                <div className="space-y-2">
                  <div className="flex justify-between text-sm">
                    <span>Bets:</span>
                    <span className="font-medium">{stats.bets}</span>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span>Wins:</span>
                    <span className="font-medium">{stats.wins}</span>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span>Win Rate:</span>
                    <span className="font-medium">
                      {stats.bets > 0 ? ((stats.wins / stats.bets) * 100).toFixed(1) : "0.0"}%
                    </span>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span>P&L:</span>
                    <span className={`font-medium ${stats.profit >= 0 ? "text-green-600" : "text-red-600"}`}>
                      {stats.profit >= 0 ? "+" : ""}${stats.profit.toFixed(2)}
                    </span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Performance by Sport */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Target className="h-5 w-5" />
            Performance by Sport
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {analyticsData.sportBreakdown.length > 0 ? (
              analyticsData.sportBreakdown.map((sport) => (
                <div key={sport.sport} className="flex items-center justify-between p-4 border rounded-lg">
                  <div className="flex-1">
                    <div className="flex items-center justify-between mb-2">
                      <h3 className="font-medium">{sport.sport}</h3>
                      <Badge variant="outline">{sport.bets} bets</Badge>
                    </div>
                    <div className="space-y-2">
                      <div className="flex justify-between text-sm">
                        <span>Win Rate: {sport.winRate.toFixed(1)}%</span>
                        <span className={sport.profit >= 0 ? "text-green-600" : "text-red-600"}>
                          {sport.profit >= 0 ? "+" : ""}${sport.profit.toFixed(2)}
                        </span>
                      </div>
                      <Progress value={sport.winRate} className="h-2" />
                    </div>
                  </div>
                </div>
              ))
            ) : (
              <div className="text-center py-8 text-muted-foreground">
                <p>No sport data available yet</p>
              </div>
            )}
          </div>
        </CardContent>
      </Card>

      {/* Bet Type Analysis */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Trophy className="h-5 w-5" />
            Bet Type Analysis
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {analyticsData.betTypeStats.length > 0 ? (
              analyticsData.betTypeStats.map((betType) => (
                <div key={betType.type} className="p-4 border rounded-lg">
                  <h3 className="font-medium mb-3">{betType.type} Bets</h3>
                  <div className="space-y-2">
                    <div className="flex justify-between text-sm">
                      <span>Count:</span>
                      <span className="font-medium">{betType.count}</span>
                    </div>
                    <div className="flex justify-between text-sm">
                      <span>Win Rate:</span>
                      <span className="font-medium">{betType.winRate.toFixed(1)}%</span>
                    </div>
                    <div className="flex justify-between text-sm">
                      <span>Avg Odds:</span>
                      <span className="font-medium">{betType.avgOdds.toFixed(2)}</span>
                    </div>
                    <Progress value={betType.winRate} className="h-2 mt-2" />
                  </div>
                </div>
              ))
            ) : (
              <div className="col-span-3 text-center py-8 text-muted-foreground">
                <p>No bet type data available yet</p>
              </div>
            )}
          </div>
        </CardContent>
      </Card>

      {/* Betting Streaks */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <TrendingUp className="h-5 w-5" />
            Betting Streaks
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            <div className="text-center p-4 border rounded-lg">
              <div className="text-2xl font-bold text-green-600">{analyticsData.streaks.currentWinStreak}</div>
              <div className="text-sm text-muted-foreground">Current Win Streak</div>
            </div>
            <div className="text-center p-4 border rounded-lg">
              <div className="text-2xl font-bold">{analyticsData.streaks.longestWinStreak}</div>
              <div className="text-sm text-muted-foreground">Longest Win Streak</div>
            </div>
            <div className="text-center p-4 border rounded-lg">
              <div className="text-2xl font-bold text-red-600">{analyticsData.streaks.currentLossStreak}</div>
              <div className="text-sm text-muted-foreground">Current Loss Streak</div>
            </div>
            <div className="text-center p-4 border rounded-lg">
              <div className="text-2xl font-bold">{analyticsData.streaks.longestLossStreak}</div>
              <div className="text-sm text-muted-foreground">Longest Loss Streak</div>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
