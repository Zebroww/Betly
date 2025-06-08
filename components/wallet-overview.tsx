"use client"

import { useState, useEffect } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { Wallet, Plus, Minus, Eye, EyeOff, TrendingUp, Clock, RefreshCw, AlertCircle, Loader2 } from "lucide-react"

interface WalletData {
  balance: number
  bonusBalance: number
  pendingWithdrawals: number
  pendingBetsValue: number
  totalDeposited: number
  totalWithdrawn: number
  availableForWithdrawal: number
}

export function WalletOverview() {
  const [showBalance, setShowBalance] = useState(true)
  const [walletData, setWalletData] = useState<WalletData | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [refreshing, setRefreshing] = useState(false)

  const fetchWalletData = async () => {
    try {
      setError(null)
      const response = await fetch("/api/wallet/balance")

      if (!response.ok) {
        if (response.status === 401) {
          throw new Error("Please log in to view your wallet")
        }
        throw new Error("Failed to fetch wallet data")
      }

      const data = await response.json()
      setWalletData(data)
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to load wallet data")
      console.error("Fetch wallet data error:", err)
    } finally {
      setLoading(false)
      setRefreshing(false)
    }
  }

  const refreshWalletData = async () => {
    setRefreshing(true)
    await fetchWalletData()
  }

  useEffect(() => {
    fetchWalletData()
  }, [])

  if (loading) {
    return (
      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
        {[1, 2, 3].map((i) => (
          <Card key={i} className="bg-gradient-to-r from-gray-400 to-gray-500">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <div className="animate-pulse">
                <div className="h-4 bg-white/20 rounded w-24"></div>
              </div>
              <Loader2 className="h-4 w-4 animate-spin text-white" />
            </CardHeader>
            <CardContent>
              <div className="animate-pulse">
                <div className="h-8 bg-white/20 rounded w-32 mb-2"></div>
                <div className="h-4 bg-white/20 rounded w-40"></div>
              </div>
            </CardContent>
          </Card>
        ))}

        <Card className="md:col-span-2 lg:col-span-3">
          <CardHeader>
            <div className="animate-pulse h-6 bg-muted rounded w-32"></div>
          </CardHeader>
          <CardContent>
            <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
              {[1, 2, 3, 4].map((i) => (
                <div key={i} className="animate-pulse h-16 bg-muted rounded"></div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>
    )
  }

  if (error) {
    return (
      <Alert variant="destructive">
        <AlertCircle className="h-4 w-4" />
        <AlertDescription className="flex items-center justify-between">
          {error}
          <Button variant="outline" size="sm" onClick={fetchWalletData} className="ml-2">
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
        <h2 className="text-xl font-semibold">Wallet Overview</h2>
        <Button variant="outline" size="sm" onClick={refreshWalletData} disabled={refreshing}>
          <RefreshCw className={`h-4 w-4 mr-1 ${refreshing ? "animate-spin" : ""}`} />
          Refresh
        </Button>
      </div>

      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
        <Card className="bg-gradient-to-r from-green-600 to-green-700 text-white">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium flex items-center gap-2">
              <Wallet className="h-4 w-4" />
              Main Balance
            </CardTitle>
            <Button
              variant="ghost"
              size="sm"
              className="text-white hover:bg-white/20"
              onClick={() => setShowBalance(!showBalance)}
            >
              {showBalance ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
            </Button>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold mb-2">
              {showBalance ? `$${(walletData?.balance || 0).toFixed(2)}` : "••••••"}
            </div>
            <p className="text-sm text-green-100">Available for betting</p>
          </CardContent>
        </Card>

        <Card className="bg-gradient-to-r from-blue-600 to-blue-700 text-white">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium flex items-center gap-2">
              <TrendingUp className="h-4 w-4" />
              Bonus Balance
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold mb-2">
              {showBalance ? `$${(walletData?.bonusBalance || 0).toFixed(2)}` : "••••••"}
            </div>
            <p className="text-sm text-blue-100">Promotional funds</p>
          </CardContent>
        </Card>

        <Card className="bg-gradient-to-r from-orange-600 to-orange-700 text-white">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium flex items-center gap-2">
              <Clock className="h-4 w-4" />
              Pending
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold mb-2">
              {showBalance ? `$${(walletData?.pendingWithdrawals || 0).toFixed(2)}` : "••••••"}
            </div>
            <p className="text-sm text-orange-100">Processing withdrawals</p>
          </CardContent>
        </Card>

        <Card className="md:col-span-2 lg:col-span-3">
          <CardHeader>
            <CardTitle>Quick Actions</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
              <Button
                className="bg-green-600 hover:bg-green-700 h-16 flex flex-col gap-1"
                onClick={() => (window.location.href = "/wallet?tab=overview")}
              >
                <Plus className="h-5 w-5" />
                <span>Deposit</span>
              </Button>
              <Button
                variant="outline"
                className="h-16 flex flex-col gap-1"
                onClick={() => (window.location.href = "/wallet?tab=overview")}
              >
                <Minus className="h-5 w-5" />
                <span>Withdraw</span>
              </Button>
              <Button
                variant="outline"
                className="h-16 flex flex-col gap-1"
                onClick={() => (window.location.href = "/wallet?tab=overview")}
              >
                <TrendingUp className="h-5 w-5" />
                <span>Transfer</span>
              </Button>
              <Button
                variant="outline"
                className="h-16 flex flex-col gap-1"
                onClick={() => (window.location.href = "/wallet?tab=transactions")}
              >
                <Wallet className="h-5 w-5" />
                <span>History</span>
              </Button>
            </div>
          </CardContent>
        </Card>

        <Card className="md:col-span-2 lg:col-span-3">
          <CardHeader>
            <CardTitle>Wallet Summary</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid gap-4 md:grid-cols-3">
              <div className="space-y-2">
                <p className="text-sm text-muted-foreground">Total Deposited</p>
                <p className="text-2xl font-bold text-green-600">
                  {showBalance ? `$${(walletData?.totalDeposited || 0).toFixed(2)}` : "••••••"}
                </p>
              </div>
              <div className="space-y-2">
                <p className="text-sm text-muted-foreground">Total Withdrawn</p>
                <p className="text-2xl font-bold text-blue-600">
                  {showBalance ? `$${(walletData?.totalWithdrawn || 0).toFixed(2)}` : "••••••"}
                </p>
              </div>
              <div className="space-y-2">
                <p className="text-sm text-muted-foreground">Available for Withdrawal</p>
                <p className="text-2xl font-bold">
                  {showBalance ? `$${(walletData?.availableForWithdrawal || 0).toFixed(2)}` : "••••••"}
                </p>
              </div>
            </div>
            
            {showBalance && walletData && walletData.pendingBetsValue > 0 && (
              <div className="mt-4 pt-4 border-t">
                <div className="flex items-center justify-between text-sm">
                  <span className="text-muted-foreground">Pending Bets Value:</span>
                  <span className="font-medium text-yellow-600">${walletData.pendingBetsValue.toFixed(2)}</span>
                </div>
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
