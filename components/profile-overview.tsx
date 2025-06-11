"use client"

import { useState, useEffect } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Alert, AlertDescription } from "@/components/ui/alert"
import {
  User,
  Mail,
  Calendar,
  Shield,
  Trophy,
  Target,
  TrendingUp,
  AlertCircle,
  Loader2,
  Edit,
  Camera,
} from "lucide-react"

interface UserProfile {
  id: string
  email: string
  firstName: string
  lastName: string
  balance: number
  bonusBalance: number
  createdAt: string
  phone?: string
  dateOfBirth?: string
  address?: string
  city?: string
  country?: string
  isVerified?: boolean
  accountLevel?: string
}

interface ProfileStats {
  totalBets: number
  winRate: number
  totalProfit: number
  memberSince: string
  favoritesSport?: string
  lastLogin?: string
}

export function ProfileOverview() {
  const [user, setUser] = useState<UserProfile | null>(null)
  const [stats, setStats] = useState<ProfileStats | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    fetchUserProfile()
    fetchUserStats()
  }, [])

  const fetchUserProfile = async () => {
    try {
      const response = await fetch("/api/auth/me")
      if (response.ok) {
        const data = await response.json()
        setUser(data.user)
      } else {
        throw new Error("Failed to fetch profile")
      }
    } catch (err) {
      setError("Failed to load profile information")
      console.error("Profile fetch error:", err)
    }
  }

  const fetchUserStats = async () => {
    try {
      const response = await fetch("/api/bets/stats")
      if (response.ok) {
        const data = await response.json()
        setStats({
          totalBets: data.totalBets || 0,
          winRate: data.winRate || 0,
          totalProfit: data.totalProfit || 0,
          memberSince: user?.createdAt || new Date().toISOString(),
          favoritesSport: "Football", // This could be calculated from bet history
          lastLogin: new Date().toISOString(),
        })
      }
    } catch (err) {
      console.error("Stats fetch error:", err)
    } finally {
      setLoading(false)
    }
  }

  const getUserInitials = () => {
    if (!user) return "U"
    const firstName = user.firstName || ""
    const lastName = user.lastName || ""
    return (firstName.charAt(0) + lastName.charAt(0)).toUpperCase()
  }

  const getAccountLevelColor = (level?: string) => {
    switch (level?.toLowerCase()) {
      case "premium":
        return "bg-yellow-100 text-yellow-800"
      case "vip":
        return "bg-purple-100 text-purple-800"
      case "pro":
        return "bg-blue-100 text-blue-800"
      default:
        return "bg-gray-100 text-gray-800"
    }
  }

  if (loading) {
    return (
      <div className="space-y-6">
        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-center h-64">
              <div className="text-center">
                <Loader2 className="h-8 w-8 animate-spin mx-auto mb-4" />
                <p className="text-muted-foreground">Loading profile...</p>
              </div>
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
        <AlertDescription>{error}</AlertDescription>
      </Alert>
    )
  }

  return (
    <div className="space-y-6">
      {/* Profile Header */}
      <Card>
        <CardContent className="p-6">
          <div className="flex flex-col md:flex-row items-start md:items-center gap-6">
            <div className="relative">
              <Avatar className="h-24 w-24">
                <AvatarImage src="/placeholder.svg?height=96&width=96" />
                <AvatarFallback className="text-2xl font-bold bg-green-100 text-green-700">
                  {getUserInitials()}
                </AvatarFallback>
              </Avatar>
              <Button size="sm" variant="outline" className="absolute -bottom-2 -right-2 h-8 w-8 rounded-full p-0">
                <Camera className="h-4 w-4" />
              </Button>
            </div>

            <div className="flex-1 space-y-2">
              <div className="flex items-center gap-3">
                <h2 className="text-2xl font-bold">
                  {user?.firstName} {user?.lastName}
                </h2>
                {user?.isVerified && (
                  <Badge className="bg-green-100 text-green-800">
                    <Shield className="h-3 w-3 mr-1" />
                    Verified
                  </Badge>
                )}
                <Badge className={getAccountLevelColor(user?.accountLevel)}>
                  {user?.accountLevel || "Standard"} Member
                </Badge>
              </div>

              <div className="flex items-center gap-4 text-sm text-muted-foreground">
                <div className="flex items-center gap-1">
                  <Mail className="h-4 w-4" />
                  {user?.email}
                </div>
                <div className="flex items-center gap-1">
                  <Calendar className="h-4 w-4" />
                  Member since {new Date(user?.createdAt || "").toLocaleDateString()}
                </div>
              </div>

              <div className="flex items-center gap-2 pt-2">
                <Button variant="outline" size="sm">
                  <Edit className="h-4 w-4 mr-2" />
                  Edit Profile
                </Button>
                <Button variant="outline" size="sm">
                  <Shield className="h-4 w-4 mr-2" />
                  Verify Account
                </Button>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Account Balance */}
      <div className="grid gap-6 md:grid-cols-2">
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Target className="h-5 w-5" />
              Account Balance
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div>
                <p className="text-sm text-muted-foreground">Main Balance</p>
                <p className="text-3xl font-bold">${(user?.balance || 0).toFixed(2)}</p>
              </div>
              <div>
                <p className="text-sm text-muted-foreground">Bonus Balance</p>
                <p className="text-xl font-semibold text-blue-600">${(user?.bonusBalance || 0).toFixed(2)}</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Trophy className="h-5 w-5" />
              Betting Stats
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div className="flex justify-between">
                <span className="text-sm text-muted-foreground">Total Bets</span>
                <span className="font-semibold">{stats?.totalBets || 0}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-sm text-muted-foreground">Win Rate</span>
                <span className="font-semibold">{(stats?.winRate || 0).toFixed(1)}%</span>
              </div>
              <div className="flex justify-between">
                <span className="text-sm text-muted-foreground">Total P&L</span>
                <span className={`font-semibold ${(stats?.totalProfit || 0) >= 0 ? "text-green-600" : "text-red-600"}`}>
                  {(stats?.totalProfit || 0) >= 0 ? "+" : ""}${(stats?.totalProfit || 0).toFixed(2)}
                </span>
              </div>
              <div className="flex justify-between">
                <span className="text-sm text-muted-foreground">Favorite Sport</span>
                <span className="font-semibold">{stats?.favoritesSport || "N/A"}</span>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Personal Information */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <User className="h-5 w-5" />
            Personal Information
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid gap-6 md:grid-cols-2">
            <div className="space-y-4">
              <div>
                <label className="text-sm font-medium text-muted-foreground">Full Name</label>
                <p className="font-medium">
                  {user?.firstName} {user?.lastName}
                </p>
              </div>
              <div>
                <label className="text-sm font-medium text-muted-foreground">Email Address</label>
                <p className="font-medium">{user?.email}</p>
              </div>
              <div>
                <label className="text-sm font-medium text-muted-foreground">Phone Number</label>
                <p className="font-medium">{user?.phone || "Not provided"}</p>
              </div>
            </div>

            <div className="space-y-4">
              <div>
                <label className="text-sm font-medium text-muted-foreground">Date of Birth</label>
                <p className="font-medium">{user?.dateOfBirth || "Not provided"}</p>
              </div>
              <div>
                <label className="text-sm font-medium text-muted-foreground">Address</label>
                <p className="font-medium">{user?.address || "Not provided"}</p>
              </div>
              <div>
                <label className="text-sm font-medium text-muted-foreground">Location</label>
                <p className="font-medium">
                  {user?.city && user?.country ? `${user.city}, ${user.country}` : "Not provided"}
                </p>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Account Activity */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <TrendingUp className="h-5 w-5" />
            Recent Activity
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            <div className="flex justify-between items-center py-2 border-b">
              <span className="text-sm">Last Login</span>
              <span className="text-sm text-muted-foreground">
                {stats?.lastLogin ? new Date(stats.lastLogin).toLocaleString() : "Just now"}
              </span>
            </div>
            <div className="flex justify-between items-center py-2 border-b">
              <span className="text-sm">Account Created</span>
              <span className="text-sm text-muted-foreground">
                {new Date(user?.createdAt || "").toLocaleDateString()}
              </span>
            </div>
            <div className="flex justify-between items-center py-2 border-b">
              <span className="text-sm">Profile Completion</span>
              <div className="flex items-center gap-2">
                <span className="text-sm text-muted-foreground">75%</span>
                <Badge variant="outline">Incomplete</Badge>
              </div>
            </div>
            <div className="flex justify-between items-center py-2">
              <span className="text-sm">Account Status</span>
              <Badge className={user?.isVerified ? "bg-green-100 text-green-800" : "bg-yellow-100 text-yellow-800"}>
                {user?.isVerified ? "Verified" : "Pending Verification"}
              </Badge>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
