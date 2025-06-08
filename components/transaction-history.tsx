"use client"

import { useState } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs"
import {
  ArrowUpRight,
  ArrowDownLeft,
  Search,
  Filter,
  Download,
  Calendar,
  CreditCard,
  Smartphone,
  Building,
  CheckCircle,
  Clock,
  XCircle,
} from "lucide-react"

interface Transaction {
  id: string
  type: "deposit" | "withdrawal" | "bet" | "win" | "bonus" | "transfer"
  amount: number
  status: "completed" | "pending" | "failed" | "cancelled"
  date: string
  description: string
  method?: string
  reference?: string
}

export function TransactionHistory() {
  const [searchTerm, setSearchTerm] = useState("")
  const [selectedFilter, setSelectedFilter] = useState("all")

  const transactions: Transaction[] = [
    {
      id: "1",
      type: "deposit",
      amount: 500.0,
      status: "completed",
      date: "2024-01-20T10:30:00Z",
      description: "Credit Card Deposit",
      method: "Visa ****1234",
      reference: "DEP-2024-001",
    },
    {
      id: "2",
      type: "bet",
      amount: -50.0,
      status: "completed",
      date: "2024-01-20T14:15:00Z",
      description: "Bet: Manchester United vs Liverpool",
      reference: "BET-2024-127",
    },
    {
      id: "3",
      type: "win",
      amount: 125.0,
      status: "completed",
      date: "2024-01-19T16:45:00Z",
      description: "Win: Lakers vs Warriors",
      reference: "WIN-2024-089",
    },
    {
      id: "4",
      type: "withdrawal",
      amount: -200.0,
      status: "pending",
      date: "2024-01-19T09:20:00Z",
      description: "Bank Transfer Withdrawal",
      method: "Bank ****5678",
      reference: "WTH-2024-012",
    },
    {
      id: "5",
      type: "bonus",
      amount: 25.0,
      status: "completed",
      date: "2024-01-18T12:00:00Z",
      description: "Welcome Bonus",
      reference: "BON-2024-003",
    },
    {
      id: "6",
      type: "deposit",
      amount: 300.0,
      status: "completed",
      date: "2024-01-17T15:30:00Z",
      description: "PayPal Deposit",
      method: "PayPal",
      reference: "DEP-2024-002",
    },
    {
      id: "7",
      type: "bet",
      amount: -75.0,
      status: "completed",
      date: "2024-01-17T18:20:00Z",
      description: "Bet: Real Madrid vs Barcelona",
      reference: "BET-2024-126",
    },
    {
      id: "8",
      type: "withdrawal",
      amount: -150.0,
      status: "failed",
      date: "2024-01-16T11:10:00Z",
      description: "Credit Card Withdrawal",
      method: "Visa ****1234",
      reference: "WTH-2024-011",
    },
  ]

  const getTransactionIcon = (type: string) => {
    switch (type) {
      case "deposit":
      case "win":
      case "bonus":
        return <ArrowDownLeft className="h-4 w-4 text-green-600" />
      case "withdrawal":
      case "bet":
        return <ArrowUpRight className="h-4 w-4 text-red-600" />
      default:
        return <ArrowUpRight className="h-4 w-4" />
    }
  }

  const getStatusIcon = (status: string) => {
    switch (status) {
      case "completed":
        return <CheckCircle className="h-4 w-4 text-green-600" />
      case "pending":
        return <Clock className="h-4 w-4 text-yellow-600" />
      case "failed":
      case "cancelled":
        return <XCircle className="h-4 w-4 text-red-600" />
      default:
        return <Clock className="h-4 w-4" />
    }
  }

  const getStatusColor = (status: string) => {
    switch (status) {
      case "completed":
        return "bg-green-100 text-green-800"
      case "pending":
        return "bg-yellow-100 text-yellow-800"
      case "failed":
      case "cancelled":
        return "bg-red-100 text-red-800"
      default:
        return "bg-gray-100 text-gray-800"
    }
  }

  const getMethodIcon = (method?: string) => {
    if (!method) return null

    if (method.includes("Visa") || method.includes("Credit")) {
      return <CreditCard className="h-4 w-4" />
    }
    if (method.includes("PayPal")) {
      return <Smartphone className="h-4 w-4" />
    }
    if (method.includes("Bank")) {
      return <Building className="h-4 w-4" />
    }
    return <CreditCard className="h-4 w-4" />
  }

  const filteredTransactions = transactions.filter((transaction) => {
    const matchesSearch =
      transaction.description.toLowerCase().includes(searchTerm.toLowerCase()) ||
      transaction.reference?.toLowerCase().includes(searchTerm.toLowerCase())
    const matchesFilter = selectedFilter === "all" || transaction.type === selectedFilter
    return matchesSearch && matchesFilter
  })

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString("en-US", {
      month: "short",
      day: "numeric",
      year: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    })
  }

  return (
    <Card>
      <CardHeader>
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
          <CardTitle>Transaction History</CardTitle>
          <div className="flex gap-2">
            <Button variant="outline" size="sm">
              <Download className="h-4 w-4 mr-2" />
              Export
            </Button>
            <Button variant="outline" size="sm">
              <Filter className="h-4 w-4 mr-2" />
              Filter
            </Button>
          </div>
        </div>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          <div className="flex flex-col sm:flex-row gap-4">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
              <Input
                placeholder="Search transactions..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10"
              />
            </div>
            <Tabs value={selectedFilter} onValueChange={setSelectedFilter} className="w-full sm:w-auto">
              <TabsList className="grid grid-cols-4 lg:grid-cols-7">
                <TabsTrigger value="all">All</TabsTrigger>
                <TabsTrigger value="deposit">Deposits</TabsTrigger>
                <TabsTrigger value="withdrawal">Withdrawals</TabsTrigger>
                <TabsTrigger value="bet">Bets</TabsTrigger>
                <TabsTrigger value="win">Wins</TabsTrigger>
                <TabsTrigger value="bonus">Bonus</TabsTrigger>
                <TabsTrigger value="transfer">Transfer</TabsTrigger>
              </TabsList>
            </Tabs>
          </div>

          <div className="space-y-2">
            {filteredTransactions.map((transaction) => (
              <div
                key={transaction.id}
                className="flex items-center justify-between p-4 border rounded-lg hover:bg-muted/50 transition-colors"
              >
                <div className="flex items-center gap-4">
                  <div className="flex items-center gap-2">
                    {getTransactionIcon(transaction.type)}
                    {transaction.method && getMethodIcon(transaction.method)}
                  </div>
                  <div className="space-y-1">
                    <p className="font-medium">{transaction.description}</p>
                    <div className="flex items-center gap-2 text-sm text-muted-foreground">
                      <Calendar className="h-3 w-3" />
                      <span>{formatDate(transaction.date)}</span>
                      {transaction.reference && (
                        <>
                          <span>•</span>
                          <span>{transaction.reference}</span>
                        </>
                      )}
                      {transaction.method && (
                        <>
                          <span>•</span>
                          <span>{transaction.method}</span>
                        </>
                      )}
                    </div>
                  </div>
                </div>
                <div className="flex items-center gap-3">
                  <div className="text-right">
                    <p className={`font-bold ${transaction.amount > 0 ? "text-green-600" : "text-red-600"}`}>
                      {transaction.amount > 0 ? "+" : ""}${Math.abs(transaction.amount).toFixed(2)}
                    </p>
                    <div className="flex items-center gap-1">
                      {getStatusIcon(transaction.status)}
                      <Badge className={getStatusColor(transaction.status)}>
                        {transaction.status.charAt(0).toUpperCase() + transaction.status.slice(1)}
                      </Badge>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>

          {filteredTransactions.length === 0 && (
            <div className="text-center py-8 text-muted-foreground">
              <p>No transactions found matching your criteria.</p>
            </div>
          )}
        </div>
      </CardContent>
    </Card>
  )
}
