"use client"

import { useState } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Switch } from "@/components/ui/switch"
import { Label } from "@/components/ui/label"
import { Button } from "@/components/ui/button"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { Eye, Shield, Users, Cookie, Download, Trash2 } from "lucide-react"

export function PrivacySettings() {
  const [profileVisibility, setProfileVisibility] = useState("private")
  const [dataCollection, setDataCollection] = useState(true)
  const [marketingCookies, setMarketingCookies] = useState(false)
  const [analyticsTracking, setAnalyticsTracking] = useState(true)

  return (
    <div className="space-y-6">
      {/* Profile Privacy */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Eye className="h-5 w-5" />
            Profile Privacy
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="space-y-2">
            <Label>Profile Visibility</Label>
            <Select value={profileVisibility} onValueChange={setProfileVisibility}>
              <SelectTrigger>
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="public">Public - Anyone can see your profile</SelectItem>
                <SelectItem value="friends">Friends Only - Only approved friends</SelectItem>
                <SelectItem value="private">Private - Only you can see your profile</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div className="flex items-center justify-between">
            <div className="space-y-0.5">
              <Label>Show Betting Statistics</Label>
              <p className="text-sm text-muted-foreground">Allow others to see your win rate and betting performance</p>
            </div>
            <Switch />
          </div>

          <div className="flex items-center justify-between">
            <div className="space-y-0.5">
              <Label>Show Recent Activity</Label>
              <p className="text-sm text-muted-foreground">Display your recent bets and wins on your profile</p>
            </div>
            <Switch />
          </div>

          <div className="flex items-center justify-between">
            <div className="space-y-0.5">
              <Label>Allow Friend Requests</Label>
              <p className="text-sm text-muted-foreground">Let other users send you friend requests</p>
            </div>
            <Switch defaultChecked />
          </div>
        </CardContent>
      </Card>

      {/* Data & Cookies */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Cookie className="h-5 w-5" />
            Data & Cookies
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex items-center justify-between">
            <div className="space-y-0.5">
              <Label>Essential Cookies</Label>
              <p className="text-sm text-muted-foreground">Required for the website to function properly</p>
            </div>
            <Switch checked disabled />
          </div>

          <div className="flex items-center justify-between">
            <div className="space-y-0.5">
              <Label>Analytics Tracking</Label>
              <p className="text-sm text-muted-foreground">Help us improve our service by tracking usage patterns</p>
            </div>
            <Switch checked={analyticsTracking} onCheckedChange={setAnalyticsTracking} />
          </div>

          <div className="flex items-center justify-between">
            <div className="space-y-0.5">
              <Label>Marketing Cookies</Label>
              <p className="text-sm text-muted-foreground">Personalize ads and promotional content</p>
            </div>
            <Switch checked={marketingCookies} onCheckedChange={setMarketingCookies} />
          </div>

          <div className="flex items-center justify-between">
            <div className="space-y-0.5">
              <Label>Data Collection for Improvements</Label>
              <p className="text-sm text-muted-foreground">
                Allow us to collect anonymized data to improve our services
              </p>
            </div>
            <Switch checked={dataCollection} onCheckedChange={setDataCollection} />
          </div>
        </CardContent>
      </Card>

      {/* Communication Preferences */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Users className="h-5 w-5" />
            Communication Preferences
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex items-center justify-between">
            <div className="space-y-0.5">
              <Label>Contact from Support</Label>
              <p className="text-sm text-muted-foreground">Allow customer support to contact you for assistance</p>
            </div>
            <Switch defaultChecked />
          </div>

          <div className="flex items-center justify-between">
            <div className="space-y-0.5">
              <Label>Third-party Communications</Label>
              <p className="text-sm text-muted-foreground">Receive communications from our trusted partners</p>
            </div>
            <Switch />
          </div>

          <div className="flex items-center justify-between">
            <div className="space-y-0.5">
              <Label>Research Participation</Label>
              <p className="text-sm text-muted-foreground">Participate in surveys and research studies</p>
            </div>
            <Switch />
          </div>
        </CardContent>
      </Card>

      {/* Data Rights */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Shield className="h-5 w-5" />
            Your Data Rights
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <Alert>
            <Shield className="h-4 w-4" />
            <AlertDescription>
              You have the right to access, correct, or delete your personal data. Learn more about your privacy rights
              in our Privacy Policy.
            </AlertDescription>
          </Alert>

          <div className="space-y-3">
            <div className="flex justify-between items-center p-3 border rounded-lg">
              <div>
                <p className="font-medium">Download Your Data</p>
                <p className="text-sm text-muted-foreground">Get a copy of all your personal data</p>
              </div>
              <Button variant="outline" size="sm">
                <Download className="h-4 w-4 mr-2" />
                Request
              </Button>
            </div>

            <div className="flex justify-between items-center p-3 border rounded-lg">
              <div>
                <p className="font-medium">Correct Your Data</p>
                <p className="text-sm text-muted-foreground">Update or correct your personal information</p>
              </div>
              <Button variant="outline" size="sm">
                Edit Profile
              </Button>
            </div>

            <div className="flex justify-between items-center p-3 border rounded-lg border-red-200">
              <div>
                <p className="font-medium">Delete Your Data</p>
                <p className="text-sm text-muted-foreground">Permanently delete your account and all data</p>
              </div>
              <Button variant="outline" size="sm" className="text-red-600 border-red-200">
                <Trash2 className="h-4 w-4 mr-2" />
                Delete
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Privacy Policy */}
      <Card>
        <CardHeader>
          <CardTitle>Privacy Information</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="space-y-2">
            <p className="text-sm text-muted-foreground">Last updated: January 15, 2024</p>
            <div className="flex gap-2">
              <Button variant="outline" size="sm">
                View Privacy Policy
              </Button>
              <Button variant="outline" size="sm">
                View Cookie Policy
              </Button>
              <Button variant="outline" size="sm">
                View Terms of Service
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Save Button */}
      <div className="flex justify-end">
        <Button>Save Privacy Settings</Button>
      </div>
    </div>
  )
}
