import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { YourBets } from "@/components/your-bets"
import { BetAnalytics } from "@/components/bet-analytics"

export default function BetsPage() {
  return (
    <div className="flex-1 space-y-6 p-6">
      <div>
        <h1 className="text-3xl font-bold tracking-tight">Your Bets</h1>
        <p className="text-muted-foreground">Track your betting history, performance, and analytics.</p>
      </div>

      <Tabs defaultValue="bets" className="w-full">
        <TabsList className="grid w-full grid-cols-2">
          <TabsTrigger value="bets">Bet History</TabsTrigger>
          <TabsTrigger value="analytics">Analytics</TabsTrigger>
        </TabsList>

        <TabsContent value="bets" className="space-y-6">
          <YourBets />
        </TabsContent>

        <TabsContent value="analytics" className="space-y-6">
          <BetAnalytics />
        </TabsContent>
      </Tabs>
    </div>
  )
}
