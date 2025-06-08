"use client"

import { useState, useEffect } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { Wallet, Plus, Minus, Eye, EyeOff, RefreshCw, AlertCircle, Loader2 } from "lucide-react"

interface BalanceData {
  balance: number
  bonusBalance: number
  pendingWithdrawals: number
  pendingBetsValue: number
  totalDeposited: number
  totalWithdrawn: number
  availableForWithdrawal: number
}

export function BalanceCard() {
  const [showBalance, setShowBalance] = useState(true)
  const [balanceData, setBalanceData] = useState<BalanceData | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [refreshing, setRefreshing] = useState(false)

  const fetchBalance = async () => {
    try {
      setError(null)
      const response = await fetch("/api/wallet/balance")

      if (!response.ok) {
        if (response.status === 401) {
          throw new Error("Please log in to view your balance")
        }
        throw new Error("Failed to fetch balance")
      }

      const data = await response.json()
      setBalanceData(data)
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to load balance")
      console.error("Fetch balance error:", err)
    } finally {
      setLoading(false)
      setRefreshing(false)
    }
  }

  const refreshBalance = async () => {
    setRefreshing(true)
    await fetchBalance()
  }

  useEffect(() => {
    fetchBalance()
  }, [])

  if (loading) {
    return (
      <Card className="bg-gradient-to-r from-green-600 to-green-700 text-white">
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium flex items-center gap-2">
            <Wallet className="h-4 w-4" />
            Account Balance
          </CardTitle>
          <Loader2 className="h-4 w-4 animate-spin" />
        </CardHeader>
        <CardContent>
          <div className="animate-pulse">
            <div className="h-8 bg-white/20 rounded w-32 mb-4"></div>
            <div className="flex items-center justify-between">
              <div className="h-6 bg-white/20 rounded w-24"></div>
              <div className="flex gap-2">
                <div className="h-8 bg-white/20 rounded w-20"></div>
                <div className="h-8 bg-white/20 rounded w-20"></div>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
    )
  }

  if (error) {
    return (
      <Card className="bg-gradient-to-r from-red-600 to-red-700 text-white">
        <CardHeader>
          <CardTitle className="text-sm font-medium flex items-center gap-2">
            <AlertCircle className="h-4 w-4" />
            Balance Error
          </CardTitle>
        </CardHeader>
        <CardContent>
          <Alert variant="destructive" className="bg-red-800/50 border-red-600 text-white">
            <AlertDescription className="flex items-center justify-between">
              {error}
              <Button variant="outline" size="sm" onClick={fetchBalance} className="ml-2 text-red-600">
                <RefreshCw className="h-4 w-4 mr-1" />
                Retry
              </Button>
            </AlertDescription>
          </Alert>
        </CardContent>
      </Card>
    )
  }

  return (
    <Card className="bg-gradient-to-r from-green-600 to-green-700 text-white">
      <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
        <CardTitle className="text-sm font-medium flex items-center gap-2">
          <Wallet className="h-4 w-4" />
          Account Balance
        </CardTitle>
        <div className="flex items-center gap-2">
          <Button
            variant="ghost"
            size="sm"
            className="text-white hover:bg-white/20"
            onClick={refreshBalance}
            disabled={refreshing}
          >
            <RefreshCw className={`h-4 w-4 ${refreshing ? "animate-spin" : ""}`} />
          </Button>
          <Button
            variant="ghost"
            size="sm"
            className="text-white hover:bg-white/20"
            onClick={() => setShowBalance(!showBalance)}
          >
            {showBalance ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
          </Button>
        </div>
      </CardHeader>
      <CardContent>
        <div className="text-2xl font-bold">
          {showBalance ? `$${(balanceData?.balance || 0).toFixed(2)}` : "••••••"}
        </div>
        <div className="flex items-center justify-between mt-4">
          <div className="flex items-center gap-2 flex-wrap">
            {(balanceData?.pendingBetsValue ?? 0) > 0 && (
              <Badge variant="secondary" className="bg-white/20 text-white">
                Pending: ${showBalance ? (balanceData?.pendingBetsValue ?? 0).toFixed(2) : "••••"}
              </Badge>
            )}

            {balanceData && balanceData.bonusBalance > 0 && (
              <Badge variant="secondary" className="bg-blue-500/20 text-white">
                Bonus: ${showBalance ? balanceData.bonusBalance.toFixed(2) : "••••"}
              </Badge>
            )}

            {(balanceData?.pendingWithdrawals ?? 0) > 0 && (
              <Badge variant="secondary" className="bg-yellow-500/20 text-white">
                Withdrawals: ${showBalance ? (balanceData?.pendingWithdrawals ?? 0).toFixed(2) : "••••"}
              </Badge>
            )}
          </div>
          <div className="flex gap-2">
            <Button
              size="sm"
              variant="secondary"
              className="bg-white/20 text-white hover:bg-white/30"
              onClick={() => (window.location.href = "/wallet?tab=deposit")}
            >
              <Plus className="h-4 w-4 mr-1" />
              Deposit
            </Button>
            <Button
              size="sm"
              variant="secondary"
              className="bg-white/20 text-white hover:bg-white/30"
              onClick={() => (window.location.href = "/wallet?tab=withdraw")}
            >
              <Minus className="h-4 w-4 mr-1" />
              Withdraw
            </Button>
          </div>
        </div>

        {showBalance && balanceData && (
          <div className="mt-3 pt-3 border-t border-white/20">
            <div className="grid grid-cols-2 gap-2 text-xs">
              <div>
                <span className="text-white/70">Available:</span>
                <span className="ml-1 font-medium">${balanceData.availableForWithdrawal.toFixed(2)}</span>
              </div>
              <div>
                <span className="text-white/70">Total Deposited:</span>
                <span className="ml-1 font-medium">${balanceData.totalDeposited.toFixed(2)}</span>
              </div>
            </div>
          </div>
        )}
      </CardContent>
    </Card>
  )
}
