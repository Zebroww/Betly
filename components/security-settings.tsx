"use client"

import { useState } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Switch } from "@/components/ui/switch"
import { Badge } from "@/components/ui/badge"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { Shield, Key, Smartphone, Eye, AlertTriangle, CheckCircle, Clock, MapPin } from "lucide-react"

export function SecuritySettings() {
  const [twoFactorEnabled, setTwoFactorEnabled] = useState(false)
  const [loginAlerts, setLoginAlerts] = useState(true)
  const [sessionTimeout, setSessionTimeout] = useState(true)

  const loginSessions = [
    {
      id: 1,
      device: "Chrome on Windows",
      location: "New York, US",
      lastActive: "Active now",
      current: true,
    },
    {
      id: 2,
      device: "Safari on iPhone",
      location: "New York, US",
      lastActive: "2 hours ago",
      current: false,
    },
    {
      id: 3,
      device: "Firefox on MacOS",
      location: "Los Angeles, US",
      lastActive: "1 day ago",
      current: false,
    },
  ]

  return (
    <div className="space-y-6">
      {/* Password Security */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Key className="h-5 w-5" />
            Password Security
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="currentPassword">Current Password</Label>
            <Input id="currentPassword" type="password" placeholder="Enter your current password" />
          </div>

          <div className="space-y-2">
            <Label htmlFor="newPassword">New Password</Label>
            <Input id="newPassword" type="password" placeholder="Enter your new password" />
          </div>

          <div className="space-y-2">
            <Label htmlFor="confirmPassword">Confirm New Password</Label>
            <Input id="confirmPassword" type="password" placeholder="Confirm your new password" />
          </div>

          <div className="space-y-2">
            <Label>Password Strength Requirements</Label>
            <div className="space-y-1 text-sm">
              <div className="flex items-center gap-2">
                <CheckCircle className="h-4 w-4 text-green-600" />
                <span>At least 8 characters</span>
              </div>
              <div className="flex items-center gap-2">
                <CheckCircle className="h-4 w-4 text-green-600" />
                <span>Contains uppercase letter</span>
              </div>
              <div className="flex items-center gap-2">
                <CheckCircle className="h-4 w-4 text-green-600" />
                <span>Contains lowercase letter</span>
              </div>
              <div className="flex items-center gap-2">
                <CheckCircle className="h-4 w-4 text-green-600" />
                <span>Contains number</span>
              </div>
            </div>
          </div>

          <Button>Update Password</Button>
        </CardContent>
      </Card>

      {/* Two-Factor Authentication */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Smartphone className="h-5 w-5" />
            Two-Factor Authentication
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex items-center justify-between">
            <div className="space-y-0.5">
              <Label>Enable 2FA</Label>
              <p className="text-sm text-muted-foreground">Secure your account with two-factor authentication</p>
            </div>
            <Switch checked={twoFactorEnabled} onCheckedChange={setTwoFactorEnabled} />
          </div>

          {twoFactorEnabled && (
            <Alert>
              <Shield className="h-4 w-4" />
              <AlertDescription>
                Two-factor authentication is enabled. You'll need your authenticator app to sign in.
              </AlertDescription>
            </Alert>
          )}

          {!twoFactorEnabled && (
            <div className="space-y-4">
              <Alert>
                <AlertTriangle className="h-4 w-4" />
                <AlertDescription>
                  Your account is not protected by two-factor authentication. Enable it for better security.
                </AlertDescription>
              </Alert>

              <div className="space-y-2">
                <Label>Setup Methods</Label>
                <div className="grid gap-2">
                  <Button variant="outline" className="justify-start">
                    <Smartphone className="h-4 w-4 mr-2" />
                    Authenticator App (Recommended)
                  </Button>
                  <Button variant="outline" className="justify-start">
                    <Smartphone className="h-4 w-4 mr-2" />
                    SMS Text Message
                  </Button>
                </div>
              </div>
            </div>
          )}
        </CardContent>
      </Card>

      {/* Security Preferences */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Shield className="h-5 w-5" />
            Security Preferences
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex items-center justify-between">
            <div className="space-y-0.5">
              <Label>Login Alerts</Label>
              <p className="text-sm text-muted-foreground">Get notified when someone signs into your account</p>
            </div>
            <Switch checked={loginAlerts} onCheckedChange={setLoginAlerts} />
          </div>

          <div className="flex items-center justify-between">
            <div className="space-y-0.5">
              <Label>Session Timeout</Label>
              <p className="text-sm text-muted-foreground">Automatically log out after 30 minutes of inactivity</p>
            </div>
            <Switch checked={sessionTimeout} onCheckedChange={setSessionTimeout} />
          </div>
        </CardContent>
      </Card>

      {/* Active Sessions */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Eye className="h-5 w-5" />
            Active Sessions
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <p className="text-sm text-muted-foreground">
            These are the devices that are currently signed into your account.
          </p>

          <div className="space-y-3">
            {loginSessions.map((session) => (
              <div key={session.id} className="flex items-center justify-between p-3 border rounded-lg">
                <div className="flex items-center gap-3">
                  <div className="p-2 bg-muted rounded-lg">
                    <Smartphone className="h-4 w-4" />
                  </div>
                  <div>
                    <p className="font-medium">{session.device}</p>
                    <div className="flex items-center gap-2 text-sm text-muted-foreground">
                      <MapPin className="h-3 w-3" />
                      <span>{session.location}</span>
                      <span>•</span>
                      <Clock className="h-3 w-3" />
                      <span>{session.lastActive}</span>
                    </div>
                  </div>
                </div>
                <div className="flex items-center gap-2">
                  {session.current ? (
                    <Badge className="bg-green-100 text-green-800">Current</Badge>
                  ) : (
                    <Button variant="outline" size="sm">
                      Revoke
                    </Button>
                  )}
                </div>
              </div>
            ))}
          </div>

          <Button variant="outline">Sign Out All Other Sessions</Button>
        </CardContent>
      </Card>
    </div>
  )
}
