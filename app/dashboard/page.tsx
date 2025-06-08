import { BalanceCard } from "@/components/balance-card"
import { StatsCards } from "@/components/stats-cards"
import { YourBets } from "@/components/your-bets"

export default function DashboardPage() {
  return (
    <div className="flex-1 space-y-6 p-6">
      <div>
        <h1 className="text-3xl font-bold tracking-tight">Dashboard</h1>
        <p className="text-muted-foreground">Welcome back! Here's your betting overview.</p>
      </div>

      <BalanceCard />
      <StatsCards />
      <YourBets />
    </div>
  )
}
