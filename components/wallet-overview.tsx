"use client"

import { useState } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Wallet, Plus, Minus, Eye, EyeOff, TrendingUp, Clock } from "lucide-react"

export function WalletOverview() {
  const [showBalance, setShowBalance] = useState(true)

  const walletData = {
    mainBalance: 1250.75,
    bonusBalance: 125.5,
    pendingWithdrawals: 200.0,
    totalDeposited: 5000.0,
    totalWithdrawn: 3500.0,
    availableForWithdrawal: 1050.75,
  }

  return (
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
            {showBalance ? `$${walletData.mainBalance.toFixed(2)}` : "••••••"}
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
            {showBalance ? `$${walletData.bonusBalance.toFixed(2)}` : "••••••"}
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
            {showBalance ? `$${walletData.pendingWithdrawals.toFixed(2)}` : "••••••"}
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
            <Button className="bg-green-600 hover:bg-green-700 h-16 flex flex-col gap-1">
              <Plus className="h-5 w-5" />
              <span>Deposit</span>
            </Button>
            <Button variant="outline" className="h-16 flex flex-col gap-1">
              <Minus className="h-5 w-5" />
              <span>Withdraw</span>
            </Button>
            <Button variant="outline" className="h-16 flex flex-col gap-1">
              <TrendingUp className="h-5 w-5" />
              <span>Transfer</span>
            </Button>
            <Button variant="outline" className="h-16 flex flex-col gap-1">
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
              <p className="text-2xl font-bold text-green-600">${walletData.totalDeposited.toFixed(2)}</p>
            </div>
            <div className="space-y-2">
              <p className="text-sm text-muted-foreground">Total Withdrawn</p>
              <p className="text-2xl font-bold text-blue-600">${walletData.totalWithdrawn.toFixed(2)}</p>
            </div>
            <div className="space-y-2">
              <p className="text-sm text-muted-foreground">Available for Withdrawal</p>
              <p className="text-2xl font-bold">${walletData.availableForWithdrawal.toFixed(2)}</p>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
