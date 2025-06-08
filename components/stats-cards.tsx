"use client"

import { useEffect, useState } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { TrendingUp, TrendingDown, Target, Trophy, RefreshCw, AlertCircle } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Alert, AlertDescription } from "@/components/ui/alert"

interface StatsData {
  totalBets: number
  winRate: number
  totalWinnings: number
  monthlyWinnings: number
  totalBetsChange: number
  winRateChange: number
  totalWinningsChange: number
  monthlyWinningsChange: number
}

export function StatsCards() {
  const [stats, setStats] = useState<StatsData | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  const fetchStats = async () => {
    setLoading(true)
    setError(null)

    try {
      const response = await fetch("/api/bets/stats")

      if (!response.ok) {
        throw new Error("Failed to fetch statistics")
      }

      const data = await response.json()
      setStats(data)
    } catch (err) {
      console.error("Error fetching stats:", err)
      setError("Failed to load betting statistics. Please try again.")
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    fetchStats()
  }, [])

  const fallbackStats = [
    {
      title: "Total Bets",
      value: stats?.totalBets?.toString() || "0",
      change: `${(stats?.totalBetsChange ?? 0) >= 0 ? "+" : ""}${(stats?.totalBetsChange ?? 0).toFixed(1)}%`,
      trend: (stats?.totalBetsChange || 0) >= 0 ? "up" : "down",
      icon: Target,
    },
    {
      title: "Win Rate",
      value: `${stats?.winRate?.toFixed(1) || "0"}%`,
      change: `${(stats?.winRateChange ?? 0) >= 0 ? "+" : ""}${(stats?.winRateChange ?? 0).toFixed(1)}%`,
      trend: (stats?.winRateChange || 0) >= 0 ? "up" : "down",
      icon: Trophy,
    },
    {
      title: "Total Winnings",
      value: `$${stats?.totalWinnings?.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 }) || "0.00"}`,
      change: `${(stats?.totalWinningsChange ?? 0) >= 0 ? "+" : ""}${(stats?.totalWinningsChange ?? 0).toFixed(1)}%`,
      trend: (stats?.totalWinningsChange || 0) >= 0 ? "up" : "down",
      icon: TrendingUp,
    },
    {
      title: "This Month",
      value: `$${stats?.monthlyWinnings?.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 }) || "0.00"}`,
      change: `${(stats?.monthlyWinningsChange ?? 0) >= 0 ? "+" : ""}${(stats?.monthlyWinningsChange ?? 0).toFixed(1)}%`,
      trend: (stats?.monthlyWinningsChange || 0) >= 0 ? "up" : "down",
      icon: TrendingDown,
    },
  ]

  if (error) {
    return (
      <Alert variant="destructive" className="mb-4">
        <AlertCircle className="h-4 w-4" />
        <AlertDescription className="flex items-center justify-between">
          {error}
          <Button variant="outline" size="sm" onClick={fetchStats} className="ml-2">
            <RefreshCw className="h-4 w-4 mr-1" />
            Retry
          </Button>
        </AlertDescription>
      </Alert>
    )
  }

  return (
    <div className="space-y-4">
      <div className="flex justify-between items-center">
        <h2 className="text-xl font-semibold">Betting Performance</h2>
        {!loading && (
          <Button variant="outline" size="sm" onClick={fetchStats} disabled={loading}>
            <RefreshCw className={`h-4 w-4 mr-1 ${loading ? "animate-spin" : ""}`} />
            Refresh
          </Button>
        )}
      </div>

      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        {fallbackStats.map((stat) => (
          <Card key={stat.title}>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">{stat.title}</CardTitle>
              <stat.icon className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              {loading ? (
                <div className="animate-pulse">
                  <div className="h-6 bg-muted rounded w-16 mb-2"></div>
                  <div className="h-4 bg-muted rounded w-24"></div>
                </div>
              ) : (
                <>
                  <div className="text-2xl font-bold">{stat.value}</div>
                  <p className={`text-xs ${stat.trend === "up" ? "text-green-600" : "text-red-600"}`}>
                    {stat.change} from last month
                  </p>
                </>
              )}
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  )
}
