"use client"

import { useState } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Switch } from "@/components/ui/switch"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { Target, Shield, Clock, AlertTriangle, DollarSign } from "lucide-react"

export function BettingSettings() {
  const [dailyLimit, setDailyLimit] = useState("500")
  const [weeklyLimit, setWeeklyLimit] = useState("2000")
  const [monthlyLimit, setMonthlyLimit] = useState("5000")
  const [autoAcceptOdds, setAutoAcceptOdds] = useState(false)
  const [quickBet, setQuickBet] = useState(true)
  const [responsibleGambling, setResponsibleGambling] = useState(true)

  return (
    <div className="space-y-6">
      {/* Betting Limits */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Shield className="h-5 w-5" />
            Betting Limits
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <Alert>
            <Shield className="h-4 w-4" />
            <AlertDescription>
              Set limits to help manage your betting activity. These limits are designed to promote responsible
              gambling.
            </AlertDescription>
          </Alert>

          <div className="grid gap-4 md:grid-cols-3">
            <div className="space-y-2">
              <Label htmlFor="dailyLimit">Daily Limit ($)</Label>
              <Input
                id="dailyLimit"
                type="number"
                value={dailyLimit}
                onChange={(e) => setDailyLimit(e.target.value)}
                placeholder="500"
              />
              <p className="text-xs text-muted-foreground">Maximum you can bet per day</p>
            </div>

            <div className="space-y-2">
              <Label htmlFor="weeklyLimit">Weekly Limit ($)</Label>
              <Input
                id="weeklyLimit"
                type="number"
                value={weeklyLimit}
                onChange={(e) => setWeeklyLimit(e.target.value)}
                placeholder="2000"
              />
              <p className="text-xs text-muted-foreground">Maximum you can bet per week</p>
            </div>

            <div className="space-y-2">
              <Label htmlFor="monthlyLimit">Monthly Limit ($)</Label>
              <Input
                id="monthlyLimit"
                type="number"
                value={monthlyLimit}
                onChange={(e) => setMonthlyLimit(e.target.value)}
                placeholder="5000"
              />
              <p className="text-xs text-muted-foreground">Maximum you can bet per month</p>
            </div>
          </div>

          <div className="space-y-2">
            <Label>Single Bet Limit</Label>
            <Select defaultValue="1000">
              <SelectTrigger>
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="100">$100</SelectItem>
                <SelectItem value="500">$500</SelectItem>
                <SelectItem value="1000">$1,000</SelectItem>
                <SelectItem value="5000">$5,000</SelectItem>
                <SelectItem value="unlimited">Unlimited</SelectItem>
              </SelectContent>
            </Select>
            <p className="text-xs text-muted-foreground">Maximum amount for a single bet</p>
          </div>
        </CardContent>
      </Card>

      {/* Betting Preferences */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Target className="h-5 w-5" />
            Betting Preferences
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex items-center justify-between">
            <div className="space-y-0.5">
              <Label>Auto-Accept Odds Changes</Label>
              <p className="text-sm text-muted-foreground">Automatically accept better odds when placing bets</p>
            </div>
            <Switch checked={autoAcceptOdds} onCheckedChange={setAutoAcceptOdds} />
          </div>

          <div className="flex items-center justify-between">
            <div className="space-y-0.5">
              <Label>Quick Bet</Label>
              <p className="text-sm text-muted-foreground">Enable one-click betting with predefined stakes</p>
            </div>
            <Switch checked={quickBet} onCheckedChange={setQuickBet} />
          </div>

          <div className="space-y-2">
            <Label>Default Stake Amount</Label>
            <Select defaultValue="25">
              <SelectTrigger>
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="10">$10</SelectItem>
                <SelectItem value="25">$25</SelectItem>
                <SelectItem value="50">$50</SelectItem>
                <SelectItem value="100">$100</SelectItem>
                <SelectItem value="custom">Custom</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div className="space-y-2">
            <Label>Odds Format</Label>
            <Select defaultValue="decimal">
              <SelectTrigger>
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="decimal">Decimal (2.50)</SelectItem>
                <SelectItem value="fractional">Fractional (3/2)</SelectItem>
                <SelectItem value="american">American (+150)</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </CardContent>
      </Card>

      {/* Cash Out Settings */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <DollarSign className="h-5 w-5" />
            Cash Out Settings
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex items-center justify-between">
            <div className="space-y-0.5">
              <Label>Auto Cash Out</Label>
              <p className="text-sm text-muted-foreground">
                Automatically cash out when profit reaches a certain amount
              </p>
            </div>
            <Switch />
          </div>

          <div className="space-y-2">
            <Label>Auto Cash Out Threshold</Label>
            <Select defaultValue="50">
              <SelectTrigger>
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="25">25% Profit</SelectItem>
                <SelectItem value="50">50% Profit</SelectItem>
                <SelectItem value="75">75% Profit</SelectItem>
                <SelectItem value="100">100% Profit</SelectItem>
                <SelectItem value="custom">Custom Amount</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div className="flex items-center justify-between">
            <div className="space-y-0.5">
              <Label>Cash Out Notifications</Label>
              <p className="text-sm text-muted-foreground">Get notified when cash out opportunities become available</p>
            </div>
            <Switch defaultChecked />
          </div>
        </CardContent>
      </Card>

      {/* Responsible Gambling */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Clock className="h-5 w-5" />
            Responsible Gambling
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex items-center justify-between">
            <div className="space-y-0.5">
              <Label>Reality Check</Label>
              <p className="text-sm text-muted-foreground">Receive reminders about time spent betting</p>
            </div>
            <Switch checked={responsibleGambling} onCheckedChange={setResponsibleGambling} />
          </div>

          <div className="space-y-2">
            <Label>Reality Check Interval</Label>
            <Select defaultValue="60">
              <SelectTrigger>
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="30">Every 30 minutes</SelectItem>
                <SelectItem value="60">Every hour</SelectItem>
                <SelectItem value="120">Every 2 hours</SelectItem>
                <SelectItem value="disabled">Disabled</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div className="space-y-2">
            <Label>Session Time Limit</Label>
            <Select defaultValue="240">
              <SelectTrigger>
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="120">2 hours</SelectItem>
                <SelectItem value="240">4 hours</SelectItem>
                <SelectItem value="480">8 hours</SelectItem>
                <SelectItem value="unlimited">No limit</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <Alert variant="destructive">
            <AlertTriangle className="h-4 w-4" />
            <AlertDescription>
              If you feel you may have a gambling problem, please seek help. Visit our responsible gambling page for
              resources and support.
            </AlertDescription>
          </Alert>
        </CardContent>
      </Card>

      {/* Favorite Sports */}
      <Card>
        <CardHeader>
          <CardTitle>Favorite Sports & Leagues</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="space-y-2">
            <Label>Preferred Sports</Label>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-2">
              {["Football", "Basketball", "Tennis", "Baseball", "Soccer", "Hockey", "Golf", "Boxing"].map((sport) => (
                <label key={sport} className="flex items-center space-x-2">
                  <input type="checkbox" className="rounded" defaultChecked={sport === "Football"} />
                  <span className="text-sm">{sport}</span>
                </label>
              ))}
            </div>
          </div>

          <div className="space-y-2">
            <Label>Favorite Leagues</Label>
            <div className="space-y-2">
              <Select defaultValue="nfl">
                <SelectTrigger>
                  <SelectValue placeholder="Select primary league" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="nfl">NFL</SelectItem>
                  <SelectItem value="nba">NBA</SelectItem>
                  <SelectItem value="mlb">MLB</SelectItem>
                  <SelectItem value="premier">Premier League</SelectItem>
                  <SelectItem value="champions">Champions League</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Save Button */}
      <div className="flex justify-end">
        <Button>Save Betting Settings</Button>
      </div>
    </div>
  )
}
