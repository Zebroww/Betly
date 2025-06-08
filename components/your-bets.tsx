"use client"

import { useState, useEffect } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Progress } from "@/components/ui/progress"
import { Input } from "@/components/ui/input"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog"
import { Alert, AlertDescription } from "@/components/ui/alert"
import {
  Calendar,
  Clock,
  DollarSign,
  TrendingUp,
  Search,
  Eye,
  Share2,
  Calculator,
  AlertCircle,
  CheckCircle,
  XCircle,
  Timer,
  Target,
  Trophy,
  Loader2,
  RefreshCw,
} from "lucide-react"

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
  cashOutValue?: number
  settledAt?: string
  profit?: number
}

interface BetStats {
  totalBets: number
  wonBets: number
  lostBets: number
  pendingBets: number
  winRate: number
  totalStaked: number
  totalProfit: number
  roi: number
}

export function YourBets() {
  const [bets, setBets] = useState<Bet[]>([])
  const [stats, setStats] = useState<BetStats | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [refreshing, setRefreshing] = useState(false)

  const [searchTerm, setSearchTerm] = useState("")
  const [selectedSport, setSelectedSport] = useState("all")
  const [selectedStatus, setSelectedStatus] = useState("all")
  const [sortBy, setSortBy] = useState("date")

  useEffect(() => {
    fetchBets()
    fetchStats()
  }, [])

  const fetchBets = async () => {
    try {
      setError(null)
      const response = await fetch("/api/bets")

      if (!response.ok) {
        if (response.status === 401) {
          throw new Error("Please log in to view your bets")
        }
        throw new Error("Failed to fetch bets")
      }

      const data = await response.json()
      setBets(data.bets || [])
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to load bets")
      console.error("Fetch bets error:", err)
    } finally {
      setLoading(false)
    }
  }

  const fetchStats = async () => {
    try {
      const response = await fetch("/api/bets/stats")

      if (response.ok) {
        const data = await response.json()
        setStats(data)
      }
    } catch (err) {
      console.error("Fetch stats error:", err)
    }
  }

  const refreshData = async () => {
    setRefreshing(true)
    await Promise.all([fetchBets(), fetchStats()])
    setRefreshing(false)
  }

  const handleCashOut = async (betId: string, cashOutValue: number) => {
    try {
      const response = await fetch(`/api/bets/${betId}/cash-out`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ cashOutValue }),
      })

      if (response.ok) {
        await refreshData()
      } else {
        const error = await response.json()
        alert(error.error || "Failed to cash out bet")
      }
    } catch (err) {
      console.error("Cash out error:", err)
      alert("Failed to cash out bet")
    }
  }

  const getStatusColor = (status: string) => {
    switch (status) {
      case "won":
        return "bg-green-100 text-green-800"
      case "lost":
        return "bg-red-100 text-red-800"
      case "pending":
        return "bg-yellow-100 text-yellow-800"
      case "void":
        return "bg-gray-100 text-gray-800"
      case "cashed_out":
        return "bg-blue-100 text-blue-800"
      default:
        return "bg-gray-100 text-gray-800"
    }
  }

  const getStatusIcon = (status: string) => {
    switch (status) {
      case "won":
        return <CheckCircle className="h-4 w-4 text-green-600" />
      case "lost":
        return <XCircle className="h-4 w-4 text-red-600" />
      case "pending":
        return <Timer className="h-4 w-4 text-yellow-600" />
      case "void":
        return <AlertCircle className="h-4 w-4 text-gray-600" />
      case "cashed_out":
        return <DollarSign className="h-4 w-4 text-blue-600" />
      default:
        return <Clock className="h-4 w-4" />
    }
  }

  const getBetTypeColor = (betType: string) => {
    switch (betType) {
      case "single":
        return "bg-blue-100 text-blue-800"
      case "accumulator":
        return "bg-purple-100 text-purple-800"
      case "system":
        return "bg-orange-100 text-orange-800"
      default:
        return "bg-gray-100 text-gray-800"
    }
  }

  const filterBets = (status?: string) => {
    let filtered = bets

    if (status && status !== "all") {
      filtered = filtered.filter((bet) => bet.status === status)
    }

    if (selectedSport !== "all") {
      filtered = filtered.filter((bet) => bet.sport.toLowerCase() === selectedSport.toLowerCase())
    }

    if (searchTerm) {
      filtered = filtered.filter(
        (bet) =>
          bet.event.toLowerCase().includes(searchTerm.toLowerCase()) ||
          bet.selection.toLowerCase().includes(searchTerm.toLowerCase()) ||
          bet.league.toLowerCase().includes(searchTerm.toLowerCase()),
      )
    }

    filtered.sort((a, b) => {
      switch (sortBy) {
        case "date":
          return new Date(b.date).getTime() - new Date(a.date).getTime()
        case "stake":
          return b.stake - a.stake
        case "potential":
          return b.potentialWin - a.potentialWin
        case "odds":
          return b.odds - a.odds
        default:
          return 0
      }
    })

    return filtered
  }

  const calculateLocalStats = () => {
    if (stats) return stats

    const totalBets = bets.length
    const wonBets = bets.filter((bet) => bet.status === "won").length
    const lostBets = bets.filter((bet) => bet.status === "lost").length
    const pendingBets = bets.filter((bet) => bet.status === "pending").length
    const settledBets = wonBets + lostBets
    const winRate = settledBets > 0 ? (wonBets / settledBets) * 100 : 0
    const totalStaked = bets.reduce((sum, bet) => sum + (bet.stake || 0), 0)
    const totalProfit = bets.reduce((sum, bet) => sum + (bet.profit || 0), 0)
    const roi = totalStaked > 0 ? (totalProfit / totalStaked) * 100 : 0

    return {
      totalBets,
      wonBets,
      lostBets,
      pendingBets,
      winRate: winRate || 0,
      totalStaked: totalStaked || 0,
      totalProfit: totalProfit || 0,
      roi: roi || 0,
    }
  }

  const currentStats = calculateLocalStats()

  const BetCard = ({ bet }: { bet: Bet }) => (
    <Card className="mb-4 hover:shadow-md transition-shadow">
      <CardContent className="p-4">
        <div className="flex justify-between items-start mb-3">
          <div className="flex-1">
            <div className="flex items-center gap-2 mb-1">
              <h3 className="font-semibold text-lg">{bet.event}</h3>
              <Badge className={getBetTypeColor(bet.betType)}>
                {bet.betType.charAt(0).toUpperCase() + bet.betType.slice(1)}
              </Badge>
            </div>
            <p className="text-sm text-muted-foreground">{bet.league}</p>
          </div>
          <div className="flex items-center gap-2">
            {getStatusIcon(bet.status)}
            <Badge className={getStatusColor(bet.status)}>
              {bet.status.replace("_", " ").charAt(0).toUpperCase() + bet.status.replace("_", " ").slice(1)}
            </Badge>
          </div>
        </div>

        <div className="bg-muted/50 p-3 rounded-lg mb-3">
          <p className="font-medium mb-2">{bet.selection}</p>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm">
            <div className="flex items-center gap-1">
              <TrendingUp className="h-4 w-4 text-muted-foreground" />
              <span>Odds: {bet.odds}</span>
            </div>
            <div className="flex items-center gap-1">
              <DollarSign className="h-4 w-4 text-muted-foreground" />
              <span>Stake: ${bet.stake}</span>
            </div>
            <div className="flex items-center gap-1">
              <Target className="h-4 w-4 text-muted-foreground" />
              <span>Potential: ${bet.potentialWin}</span>
            </div>
            <div className="flex items-center gap-1">
              <Calendar className="h-4 w-4 text-muted-foreground" />
              <span>{new Date(bet.date).toLocaleDateString()}</span>
            </div>
          </div>
        </div>

        {bet.profit !== undefined && (
          <div className="mb-3">
            <div className={`text-sm font-medium ${bet.profit >= 0 ? "text-green-600" : "text-red-600"}`}>
              {bet.profit >= 0 ? "Profit" : "Loss"}: {bet.profit >= 0 ? "+" : ""}${bet.profit.toFixed(2)}
            </div>
            {bet.settledAt && (
              <div className="text-xs text-muted-foreground">Settled: {new Date(bet.settledAt).toLocaleString()}</div>
            )}
          </div>
        )}

        <div className="flex justify-between items-center">
          <div className="flex gap-2">
            <Dialog>
              <DialogTrigger asChild>
                <Button variant="outline" size="sm">
                  <Eye className="h-4 w-4 mr-1" />
                  Details
                </Button>
              </DialogTrigger>
              <DialogContent>
                <DialogHeader>
                  <DialogTitle>Bet Details</DialogTitle>
                </DialogHeader>
                <BetDetailsModal bet={bet} />
              </DialogContent>
            </Dialog>
            <Button variant="outline" size="sm">
              <Share2 className="h-4 w-4 mr-1" />
              Share
            </Button>
          </div>
          {bet.status === "pending" && bet.cashOutValue && (
            <Button
              variant="outline"
              size="sm"
              className="text-blue-600"
              onClick={() => handleCashOut(bet.id, bet.cashOutValue!)}
            >
              <Calculator className="h-4 w-4 mr-1" />
              Cash Out ${bet.cashOutValue}
            </Button>
          )}
        </div>
      </CardContent>
    </Card>
  )

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="text-center">
          <Loader2 className="h-8 w-8 animate-spin mx-auto mb-4" />
          <p className="text-muted-foreground">Loading your bets...</p>
        </div>
      </div>
    )
  }

  if (error) {
    return (
      <Alert variant="destructive">
        <AlertCircle className="h-4 w-4" />
        <AlertDescription>
          {error}
          <Button variant="outline" size="sm" onClick={fetchBets} className="ml-2">
            Try Again
          </Button>
        </AlertDescription>
      </Alert>
    )
  }

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader className="flex flex-row items-center justify-between">
          <CardTitle className="flex items-center gap-2">
            <Trophy className="h-5 w-5" />
            Betting Statistics
          </CardTitle>
          <Button variant="outline" size="sm" onClick={refreshData} disabled={refreshing}>
            <RefreshCw className={`h-4 w-4 mr-2 ${refreshing ? "animate-spin" : ""}`} />
            Refresh
          </Button>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            <div className="text-center">
              <div className="text-2xl font-bold">{currentStats?.totalBets || 0}</div>
              <div className="text-sm text-muted-foreground">Total Bets</div>
            </div>
            <div className="text-center">
              <div className="text-2xl font-bold text-green-600">{(currentStats?.winRate || 0).toFixed(1)}%</div>
              <div className="text-sm text-muted-foreground">Win Rate</div>
              <Progress value={currentStats?.winRate || 0} className="mt-2" />
            </div>
            <div className="text-center">
              <div
                className={`text-2xl font-bold ${(currentStats?.totalProfit || 0) >= 0 ? "text-green-600" : "text-red-600"}`}
              >
                {(currentStats?.totalProfit || 0) >= 0 ? "+" : ""}${(currentStats?.totalProfit || 0).toFixed(2)}
              </div>
              <div className="text-sm text-muted-foreground">Total P&L</div>
            </div>
            <div className="text-center">
              <div
                className={`text-2xl font-bold ${(currentStats?.roi || 0) >= 0 ? "text-green-600" : "text-red-600"}`}
              >
                {(currentStats?.roi || 0) >= 0 ? "+" : ""}
                {(currentStats?.roi || 0).toFixed(1)}%
              </div>
              <div className="text-sm text-muted-foreground">ROI</div>
            </div>
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Your Bets</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex flex-col md:flex-row gap-4 mb-6">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
              <Input
                placeholder="Search bets..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10"
              />
            </div>
            <Select value={selectedSport} onValueChange={setSelectedSport}>
              <SelectTrigger className="w-full md:w-40">
                <SelectValue placeholder="Sport" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Sports</SelectItem>
                <SelectItem value="football">Football</SelectItem>
                <SelectItem value="basketball">Basketball</SelectItem>
                <SelectItem value="tennis">Tennis</SelectItem>
                <SelectItem value="multiple">Multiple</SelectItem>
              </SelectContent>
            </Select>
            <Select value={sortBy} onValueChange={setSortBy}>
              <SelectTrigger className="w-full md:w-40">
                <SelectValue placeholder="Sort by" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="date">Date</SelectItem>
                <SelectItem value="stake">Stake</SelectItem>
                <SelectItem value="potential">Potential Win</SelectItem>
                <SelectItem value="odds">Odds</SelectItem>
              </SelectContent>
            </Select>
          </div>

          {bets.length === 0 ? (
            <div className="text-center py-12">
              <Trophy className="h-12 w-12 mx-auto mb-4 text-muted-foreground" />
              <h3 className="text-lg font-semibold mb-2">No bets yet</h3>
              <p className="text-muted-foreground mb-4">Start betting to see your history here</p>
              <Button asChild>
                <a href="/betting">Place Your First Bet</a>
              </Button>
            </div>
          ) : (
            <Tabs defaultValue="all" className="w-full">
              <TabsList className="grid w-full grid-cols-6">
                <TabsTrigger value="all">All ({bets.length})</TabsTrigger>
                <TabsTrigger value="pending">Pending ({currentStats?.pendingBets || 0})</TabsTrigger>
                <TabsTrigger value="won">Won ({currentStats?.wonBets || 0})</TabsTrigger>
                <TabsTrigger value="lost">Lost ({currentStats?.lostBets || 0})</TabsTrigger>
                <TabsTrigger value="cashed_out">Cashed Out</TabsTrigger>
                <TabsTrigger value="void">Void</TabsTrigger>
              </TabsList>

              <TabsContent value="all" className="mt-4">
                {filterBets().map((bet) => (
                  <BetCard key={bet.id} bet={bet} />
                ))}
              </TabsContent>

              <TabsContent value="pending" className="mt-4">
                {filterBets("pending").map((bet) => (
                  <BetCard key={bet.id} bet={bet} />
                ))}
              </TabsContent>

              <TabsContent value="won" className="mt-4">
                {filterBets("won").map((bet) => (
                  <BetCard key={bet.id} bet={bet} />
                ))}
              </TabsContent>

              <TabsContent value="lost" className="mt-4">
                {filterBets("lost").map((bet) => (
                  <BetCard key={bet.id} bet={bet} />
                ))}
              </TabsContent>

              <TabsContent value="cashed_out" className="mt-4">
                {filterBets("cashed_out").map((bet) => (
                  <BetCard key={bet.id} bet={bet} />
                ))}
              </TabsContent>

              <TabsContent value="void" className="mt-4">
                {filterBets("void").map((bet) => (
                  <BetCard key={bet.id} bet={bet} />
                ))}
              </TabsContent>
            </Tabs>
          )}
        </CardContent>
      </Card>
    </div>
  )
}

function BetDetailsModal({ bet }: { bet: Bet }) {
  const getStatusColor = (status: string) => {
    switch (status) {
      case "won":
        return "bg-green-100 text-green-800"
      case "lost":
        return "bg-red-100 text-red-800"
      case "pending":
        return "bg-yellow-100 text-yellow-800"
      case "void":
        return "bg-gray-100 text-gray-800"
      case "cashed_out":
        return "bg-blue-100 text-blue-800"
      default:
        return "bg-gray-100 text-gray-800"
    }
  }

  const getStatusIcon = (status: string) => {
    switch (status) {
      case "won":
        return <CheckCircle className="h-4 w-4 text-green-600" />
      case "lost":
        return <XCircle className="h-4 w-4 text-red-600" />
      case "pending":
        return <Timer className="h-4 w-4 text-yellow-600" />
      case "void":
        return <AlertCircle className="h-4 w-4 text-gray-600" />
      case "cashed_out":
        return <DollarSign className="h-4 w-4 text-blue-600" />
      default:
        return <Clock className="h-4 w-4" />
    }
  }

  const getBetTypeColor = (betType: string) => {
    switch (betType) {
      case "single":
        return "bg-blue-100 text-blue-800"
      case "accumulator":
        return "bg-purple-100 text-purple-800"
      case "system":
        return "bg-orange-100 text-orange-800"
      default:
        return "bg-gray-100 text-gray-800"
    }
  }

  return (
    <div className="space-y-4">
      <div className="grid grid-cols-2 gap-4">
        <div>
          <label className="text-sm font-medium text-muted-foreground">Event</label>
          <p className="font-medium">{bet.event}</p>
        </div>
        <div>
          <label className="text-sm font-medium text-muted-foreground">League</label>
          <p className="font-medium">{bet.league}</p>
        </div>
      </div>

      <div>
        <label className="text-sm font-medium text-muted-foreground">Selection</label>
        <p className="font-medium">{bet.selection}</p>
      </div>

      <div className="grid grid-cols-2 gap-4">
        <div>
          <label className="text-sm font-medium text-muted-foreground">Odds</label>
          <p className="font-medium">{bet.odds}</p>
        </div>
        <div>
          <label className="text-sm font-medium text-muted-foreground">Bet Type</label>
          <Badge className={getBetTypeColor(bet.betType)}>
            {bet.betType.charAt(0).toUpperCase() + bet.betType.slice(1)}
          </Badge>
        </div>
      </div>

      <div className="grid grid-cols-2 gap-4">
        <div>
          <label className="text-sm font-medium text-muted-foreground">Stake</label>
          <p className="font-medium">${bet.stake.toFixed(2)}</p>
        </div>
        <div>
          <label className="text-sm font-medium text-muted-foreground">Potential Win</label>
          <p className="font-medium">${bet.potentialWin.toFixed(2)}</p>
        </div>
      </div>

      <div className="grid grid-cols-2 gap-4">
        <div>
          <label className="text-sm font-medium text-muted-foreground">Placed At</label>
          <p className="font-medium">{new Date(bet.date).toLocaleString()}</p>
        </div>
        <div>
          <label className="text-sm font-medium text-muted-foreground">Status</label>
          <div className="flex items-center gap-2">
            {getStatusIcon(bet.status)}
            <Badge className={getStatusColor(bet.status)}>
              {bet.status.replace("_", " ").charAt(0).toUpperCase() + bet.status.replace("_", " ").slice(1)}
            </Badge>
          </div>
        </div>
      </div>

      {bet.profit !== undefined && (
        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className="text-sm font-medium text-muted-foreground">Profit/Loss</label>
            <p className={`font-medium ${bet.profit >= 0 ? "text-green-600" : "text-red-600"}`}>
              {bet.profit >= 0 ? "+" : ""}${bet.profit.toFixed(2)}
            </p>
          </div>
          {bet.settledAt && (
            <div>
              <label className="text-sm font-medium text-muted-foreground">Settled At</label>
              <p className="font-medium">{new Date(bet.settledAt).toLocaleString()}</p>
            </div>
          )}
        </div>
      )}

      {bet.cashOutValue && bet.status === "pending" && (
        <div>
          <label className="text-sm font-medium text-muted-foreground">Cash Out Value</label>
          <p className="font-medium text-blue-600">${bet.cashOutValue.toFixed(2)}</p>
        </div>
      )}
    </div>
  )
}
