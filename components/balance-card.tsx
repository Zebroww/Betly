"use client"

import { useState } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Wallet, Plus, Minus, Eye, EyeOff } from "lucide-react"

export function BalanceCard() {
  const [showBalance, setShowBalance] = useState(true)
  const balance = 1250.75
  const pendingWinnings = 340.5

  return (
    <Card className="bg-gradient-to-r from-green-600 to-green-700 text-white">
      <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
        <CardTitle className="text-sm font-medium flex items-center gap-2">
          <Wallet className="h-4 w-4" />
          Account Balance
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
        <div className="text-2xl font-bold">{showBalance ? `$${balance.toFixed(2)}` : "••••••"}</div>
        <div className="flex items-center justify-between mt-4">
          <div className="flex items-center gap-2">
            <Badge variant="secondary" className="bg-white/20 text-white">
              Pending: ${pendingWinnings.toFixed(2)}
            </Badge>
          </div>
          <div className="flex gap-2">
            <Button size="sm" variant="secondary" className="bg-white/20 text-white hover:bg-white/30">
              <Plus className="h-4 w-4 mr-1" />
              Deposit
            </Button>
            <Button size="sm" variant="secondary" className="bg-white/20 text-white hover:bg-white/30">
              <Minus className="h-4 w-4 mr-1" />
              Withdraw
            </Button>
          </div>
        </div>
      </CardContent>
    </Card>
  )
}
