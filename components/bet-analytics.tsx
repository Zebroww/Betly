"use client"

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Progress } from "@/components/ui/progress"
import { Badge } from "@/components/ui/badge"
import { TrendingUp, Target, Calendar, Trophy } from "lucide-react"

export function BetAnalytics() {
  const analyticsData = {
    monthlyStats: {
      january: { bets: 45, wins: 28, profit: 340.5 },
      december: { bets: 52, wins: 31, profit: 280.75 },
      november: { bets: 38, wins: 22, profit: -125.25 },
    },
    sportBreakdown: [
      { sport: "Football", bets: 67, winRate: 68.5, profit: 425.75 },
      { sport: "Basketball", bets: 34, winRate: 61.8, profit: 180.25 },
      { sport: "Tennis", bets: 24, winRate: 75.0, profit: 320.5 },
      { sport: "Baseball", bets: 10, winRate: 50.0, profit: -45.0 },
    ],
    betTypeStats: [
      { type: "Single", count: 89, winRate: 67.4, avgOdds: 2.1 },
      { type: "Accumulator", count: 28, winRate: 35.7, avgOdds: 8.5 },
      { type: "System", count: 18, winRate: 55.6, avgOdds: 4.2 },
    ],
    streaks: {
      currentWinStreak: 3,
      longestWinStreak: 8,
      currentLossStreak: 0,
      longestLossStreak: 4,
    },
  }

  return (
    <div className="space-y-6">
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
                    <span className="font-medium">{((stats.wins / stats.bets) * 100).toFixed(1)}%</span>
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

      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Target className="h-5 w-5" />
            Performance by Sport
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {analyticsData.sportBreakdown.map((sport) => (
              <div key={sport.sport} className="flex items-center justify-between p-4 border rounded-lg">
                <div className="flex-1">
                  <div className="flex items-center justify-between mb-2">
                    <h3 className="font-medium">{sport.sport}</h3>
                    <Badge variant="outline">{sport.bets} bets</Badge>
                  </div>
                  <div className="space-y-2">
                    <div className="flex justify-between text-sm">
                      <span>Win Rate: {sport.winRate}%</span>
                      <span className={sport.profit >= 0 ? "text-green-600" : "text-red-600"}>
                        {sport.profit >= 0 ? "+" : ""}${sport.profit.toFixed(2)}
                      </span>
                    </div>
                    <Progress value={sport.winRate} className="h-2" />
                  </div>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Trophy className="h-5 w-5" />
            Bet Type Analysis
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {analyticsData.betTypeStats.map((betType) => (
              <div key={betType.type} className="p-4 border rounded-lg">
                <h3 className="font-medium mb-3">{betType.type} Bets</h3>
                <div className="space-y-2">
                  <div className="flex justify-between text-sm">
                    <span>Count:</span>
                    <span className="font-medium">{betType.count}</span>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span>Win Rate:</span>
                    <span className="font-medium">{betType.winRate}%</span>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span>Avg Odds:</span>
                    <span className="font-medium">{betType.avgOdds}</span>
                  </div>
                  <Progress value={betType.winRate} className="h-2 mt-2" />
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

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
