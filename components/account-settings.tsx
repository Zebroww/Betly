"use client"

import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Switch } from "@/components/ui/switch"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { Badge } from "@/components/ui/badge"
import { User, Mail, Shield, Trash2, Download, AlertTriangle, CheckCircle, AlertCircle } from "lucide-react"

export function AccountSettings() {
  const [user, setUser] = useState<any>(null)
  const [emailNotifications, setEmailNotifications] = useState(true)
  const [twoFactorEnabled, setTwoFactorEnabled] = useState(false)
  const [loading, setLoading] = useState(true)

  const router = useRouter()
  const [deleteLoading, setDeleteLoading] = useState(false)
  const [deleteError, setDeleteError] = useState("")
  const [showDeleteDialog, setShowDeleteDialog] = useState(false)

  useEffect(() => {
    fetchUserData()
  }, [])

  const fetchUserData = async () => {
    try {
      const response = await fetch("/api/auth/me")
      if (response.ok) {
        const data = await response.json()
        setUser(data.user)
      }
    } catch (err) {
      console.error("Failed to fetch user data:", err)
    } finally {
      setLoading(false)
    }
  }

  const handleEmailChange = async (newEmail: string) => {
    // Implementation for email change
    console.log("Changing email to:", newEmail)
  }

  const handleDataExport = () => {
    // Implementation for data export
    console.log("Data export requested")
  }

  const handleAccountDeletion = async () => {
    setDeleteLoading(true)
    setDeleteError("")

    try {
      const response = await fetch("/api/auth/delete-account", {
        method: "DELETE",
        headers: {
          "Content-Type": "application/json",
        },
      })

      if (!response.ok) {
        const errorData = await response.json()
        throw new Error(errorData.error || "Failed to delete account")
      }

      // Clear auth token with proper cookie attributes
      // This ensures the cookie is properly removed for both client and server
      document.cookie = "auth-token=; Path=/; Expires=Thu, 01 Jan 1970 00:00:00 GMT; SameSite=Lax;"

      // Also remove from localStorage if it's stored there
      localStorage.removeItem("auth-token")

      // Redirect to auth page
      router.push("/auth")
    } catch (error) {
      setDeleteError(error instanceof Error ? error.message : "An error occurred")
    } finally {
      setDeleteLoading(false)
      setShowDeleteDialog(false)
    }
  }

  if (loading) {
    return (
      <div className="space-y-6">
        <Card>
          <CardContent className="p-6">
            <div className="animate-pulse space-y-4">
              <div className="h-4 bg-muted rounded w-1/4"></div>
              <div className="h-10 bg-muted rounded"></div>
            </div>
          </CardContent>
        </Card>
      </div>
    )
  }

  return (
    <div className="space-y-6">
      {/* Account Information */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <User className="h-5 w-5" />
            Account Information
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid gap-4 md:grid-cols-2">
            <div className="space-y-2">
              <Label>Account ID</Label>
              <Input value={user?.id || ""} disabled />
            </div>
            <div className="space-y-2">
              <Label>Member Since</Label>
              <Input value={user?.createdAt ? new Date(user.createdAt).toLocaleDateString() : ""} disabled />
            </div>
          </div>

          <div className="space-y-2">
            <Label>Account Status</Label>
            <div className="flex items-center gap-2">
              <Badge className="bg-green-100 text-green-800">
                <CheckCircle className="h-3 w-3 mr-1" />
                Active
              </Badge>
              {user?.isVerified ? (
                <Badge className="bg-blue-100 text-blue-800">
                  <Shield className="h-3 w-3 mr-1" />
                  Verified
                </Badge>
              ) : (
                <Badge variant="outline">
                  <AlertCircle className="h-3 w-3 mr-1" />
                  Unverified
                </Badge>
              )}
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Email Settings */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Mail className="h-5 w-5" />
            Email Settings
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="email">Email Address</Label>
            <div className="flex gap-2">
              <Input id="email" type="email" value={user?.email || ""} placeholder="Enter your email" />
              <Button variant="outline">Change</Button>
            </div>
            <p className="text-sm text-muted-foreground">We'll send a verification email to your new address.</p>
          </div>

          <div className="flex items-center justify-between">
            <div className="space-y-0.5">
              <Label>Email Notifications</Label>
              <p className="text-sm text-muted-foreground">Receive notifications about your account activity</p>
            </div>
            <Switch checked={emailNotifications} onCheckedChange={setEmailNotifications} />
          </div>
        </CardContent>
      </Card>

      {/* Security Settings */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Shield className="h-5 w-5" />
            Security Settings
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex items-center justify-between">
            <div className="space-y-0.5">
              <Label>Two-Factor Authentication</Label>
              <p className="text-sm text-muted-foreground">Add an extra layer of security to your account</p>
            </div>
            <Switch checked={twoFactorEnabled} onCheckedChange={setTwoFactorEnabled} />
          </div>

          <div className="space-y-2">
            <Label>Password</Label>
            <div className="flex gap-2">
              <Input type="password" value="••••••••" disabled />
              <Button variant="outline">Change Password</Button>
            </div>
          </div>

          <div className="space-y-2">
            <Label>Login Sessions</Label>
            <div className="p-3 border rounded-lg">
              <div className="flex justify-between items-center">
                <div>
                  <p className="font-medium">Current Session</p>
                  <p className="text-sm text-muted-foreground">Chrome on Windows • Active now</p>
                </div>
                <Badge variant="outline">Current</Badge>
              </div>
            </div>
            <Button variant="outline" size="sm">
              View All Sessions
            </Button>
          </div>
        </CardContent>
      </Card>

      {/* Data & Privacy */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Download className="h-5 w-5" />
            Data & Privacy
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="space-y-2">
            <Label>Export Your Data</Label>
            <p className="text-sm text-muted-foreground">
              Download a copy of your account data including bets, transactions, and profile information.
            </p>
            <Button variant="outline" onClick={handleDataExport}>
              <Download className="h-4 w-4 mr-2" />
              Request Data Export
            </Button>
          </div>
        </CardContent>
      </Card>

      {/* Danger Zone */}
      <Card className="border-red-200">
        <CardHeader>
          <CardTitle className="flex items-center gap-2 text-red-600">
            <AlertTriangle className="h-5 w-5" />
            Danger Zone
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <Alert variant="destructive">
            <AlertTriangle className="h-4 w-4" />
            <AlertDescription>
              These actions are permanent and cannot be undone. Please proceed with caution.
            </AlertDescription>
          </Alert>

          <div className="space-y-2">
            <Label>Deactivate Account</Label>
            <p className="text-sm text-muted-foreground">
              Temporarily disable your account. You can reactivate it later by logging in.
            </p>
            <Button variant="outline" className="text-red-600 border-red-200 hover:bg-red-50">
              Deactivate Account
            </Button>
          </div>

          <div className="space-y-2">
            <Label>Delete Account</Label>
            <p className="text-sm text-muted-foreground">
              Permanently delete your account and all associated data. This action cannot be undone.
            </p>
            {deleteError && (
              <Alert variant="destructive">
                <AlertTriangle className="h-4 w-4" />
                <AlertDescription>{deleteError}</AlertDescription>
              </Alert>
            )}

            <AlertDialog open={showDeleteDialog} onOpenChange={setShowDeleteDialog}>
              <AlertDialogTrigger asChild>
                <Button variant="destructive" disabled={deleteLoading}>
                  <Trash2 className="h-4 w-4 mr-2" />
                  {deleteLoading ? "Deleting..." : "Delete Account"}
                </Button>
              </AlertDialogTrigger>
              <AlertDialogContent>
                <AlertDialogHeader>
                  <AlertDialogTitle>Are you absolutely sure?</AlertDialogTitle>
                  <AlertDialogDescription>
                    This action cannot be undone. This will permanently delete your account and remove all your data
                    from our servers, including:
                    <ul className="list-disc list-inside mt-2 space-y-1">
                      <li>Your betting history and statistics</li>
                      <li>Transaction records and payment methods</li>
                      <li>Profile information and preferences</li>
                      <li>Any remaining account balance</li>
                    </ul>
                  </AlertDialogDescription>
                </AlertDialogHeader>
                <AlertDialogFooter>
                  <AlertDialogCancel>Cancel</AlertDialogCancel>
                  <AlertDialogAction
                    onClick={handleAccountDeletion}
                    className="bg-red-600 hover:bg-red-700"
                    disabled={deleteLoading}
                  >
                    {deleteLoading ? "Deleting..." : "Yes, delete my account"}
                  </AlertDialogAction>
                </AlertDialogFooter>
              </AlertDialogContent>
            </AlertDialog>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
