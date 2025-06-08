import { BettingMarkets } from "@/components/betting-markets"

export default function BettingPage() {
  return (
    <div className="flex-1 space-y-6 p-6">
      <div>
        <h1 className="text-3xl font-bold tracking-tight">Live Betting</h1>
        <p className="text-muted-foreground">Place bets on live and upcoming sports events with competitive odds.</p>
      </div>

      <BettingMarkets />
    </div>
  )
}
