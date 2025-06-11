"use client"

import { useState } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Switch } from "@/components/ui/switch"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Button } from "@/components/ui/button"
import { Bell, Mail, Smartphone, Monitor } from "lucide-react"

export function NotificationSettings() {
  const [emailNotifications, setEmailNotifications] = useState(true)
  const [pushNotifications, setPushNotifications] = useState(true)
  const [smsNotifications, setSmsNotifications] = useState(false)
  const [betUpdates, setBetUpdates] = useState(true)
  const [promotions, setPromotions] = useState(true)
  const [security, setSecurity] = useState(true)
  const [newsletter, setNewsletter] = useState(false)

  return (
    <div className="space-y-6">
      {/* Notification Channels */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Bell className="h-5 w-5" />
            Notification Channels
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <Mail className="h-5 w-5 text-muted-foreground" />
              <div className="space-y-0.5">
                <Label>Email Notifications</Label>
                <p className="text-sm text-muted-foreground">Receive notifications via email</p>
              </div>
            </div>
            <Switch checked={emailNotifications} onCheckedChange={setEmailNotifications} />
          </div>

          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <Monitor className="h-5 w-5 text-muted-foreground" />
              <div className="space-y-0.5">
                <Label>Push Notifications</Label>
                <p className="text-sm text-muted-foreground">Receive notifications in your browser</p>
              </div>
            </div>
            <Switch checked={pushNotifications} onCheckedChange={setPushNotifications} />
          </div>

          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <Smartphone className="h-5 w-5 text-muted-foreground" />
              <div className="space-y-0.5">
                <Label>SMS Notifications</Label>
                <p className="text-sm text-muted-foreground">Receive notifications via text message</p>
              </div>
            </div>
            <Switch checked={smsNotifications} onCheckedChange={setSmsNotifications} />
          </div>
        </CardContent>
      </Card>

      {/* Betting Notifications */}
      <Card>
        <CardHeader>
          <CardTitle>Betting Notifications</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex items-center justify-between">
            <div className="space-y-0.5">
              <Label>Bet Updates</Label>
              <p className="text-sm text-muted-foreground">Get notified when your bets are settled</p>
            </div>
            <Switch checked={betUpdates} onCheckedChange={setBetUpdates} />
          </div>

          <div className="flex items-center justify-between">
            <div className="space-y-0.5">
              <Label>Live Odds Changes</Label>
              <p className="text-sm text-muted-foreground">Notifications when odds change significantly</p>
            </div>
            <Switch defaultChecked />
          </div>

          <div className="flex items-center justify-between">
            <div className="space-y-0.5">
              <Label>Cash Out Opportunities</Label>
              <p className="text-sm text-muted-foreground">Get alerted when cash out becomes available</p>
            </div>
            <Switch defaultChecked />
          </div>

          <div className="space-y-2">
            <Label>Notification Frequency</Label>
            <Select defaultValue="immediate">
              <SelectTrigger>
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="immediate">Immediate</SelectItem>
                <SelectItem value="hourly">Hourly Digest</SelectItem>
                <SelectItem value="daily">Daily Digest</SelectItem>
                <SelectItem value="weekly">Weekly Summary</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </CardContent>
      </Card>

      {/* Account Notifications */}
      <Card>
        <CardHeader>
          <CardTitle>Account Notifications</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex items-center justify-between">
            <div className="space-y-0.5">
              <Label>Security Alerts</Label>
              <p className="text-sm text-muted-foreground">Important security updates and login alerts</p>
            </div>
            <Switch checked={security} onCheckedChange={setSecurity} />
          </div>

          <div className="flex items-center justify-between">
            <div className="space-y-0.5">
              <Label>Account Updates</Label>
              <p className="text-sm text-muted-foreground">Changes to your account and profile</p>
            </div>
            <Switch defaultChecked />
          </div>

          <div className="flex items-center justify-between">
            <div className="space-y-0.5">
              <Label>Payment Notifications</Label>
              <p className="text-sm text-muted-foreground">Deposit and withdrawal confirmations</p>
            </div>
            <Switch defaultChecked />
          </div>
        </CardContent>
      </Card>

      {/* Marketing Notifications */}
      <Card>
        <CardHeader>
          <CardTitle>Marketing & Promotions</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex items-center justify-between">
            <div className="space-y-0.5">
              <Label>Promotional Offers</Label>
              <p className="text-sm text-muted-foreground">Special offers, bonuses, and promotions</p>
            </div>
            <Switch checked={promotions} onCheckedChange={setPromotions} />
          </div>

          <div className="flex items-center justify-between">
            <div className="space-y-0.5">
              <Label>Newsletter</Label>
              <p className="text-sm text-muted-foreground">Weekly newsletter with betting tips and updates</p>
            </div>
            <Switch checked={newsletter} onCheckedChange={setNewsletter} />
          </div>

          <div className="flex items-center justify-between">
            <div className="space-y-0.5">
              <Label>Product Updates</Label>
              <p className="text-sm text-muted-foreground">New features and platform improvements</p>
            </div>
            <Switch defaultChecked />
          </div>
        </CardContent>
      </Card>

      {/* Quiet Hours */}
      <Card>
        <CardHeader>
          <CardTitle>Quiet Hours</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex items-center justify-between">
            <div className="space-y-0.5">
              <Label>Enable Quiet Hours</Label>
              <p className="text-sm text-muted-foreground">Pause non-urgent notifications during specified hours</p>
            </div>
            <Switch />
          </div>

          <div className="grid gap-4 md:grid-cols-2">
            <div className="space-y-2">
              <Label>Start Time</Label>
              <Select defaultValue="22:00">
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="20:00">8:00 PM</SelectItem>
                  <SelectItem value="21:00">9:00 PM</SelectItem>
                  <SelectItem value="22:00">10:00 PM</SelectItem>
                  <SelectItem value="23:00">11:00 PM</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div className="space-y-2">
              <Label>End Time</Label>
              <Select defaultValue="08:00">
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="06:00">6:00 AM</SelectItem>
                  <SelectItem value="07:00">7:00 AM</SelectItem>
                  <SelectItem value="08:00">8:00 AM</SelectItem>
                  <SelectItem value="09:00">9:00 AM</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Save Button */}
      <div className="flex justify-end">
        <Button>Save Notification Settings</Button>
      </div>
    </div>
  )
}
