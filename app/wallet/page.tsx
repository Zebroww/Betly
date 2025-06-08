import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { WalletOverview } from "@/components/wallet-overview"
import { TransactionHistory } from "@/components/transaction-history"
import { PaymentMethods } from "@/components/payment-methods"

export default function WalletPage() {
  return (
    <div className="flex-1 space-y-6 p-6">
      <div>
        <h1 className="text-3xl font-bold tracking-tight">Wallet</h1>
        <p className="text-muted-foreground">Manage your funds, view transactions, and payment methods.</p>
      </div>

      <Tabs defaultValue="overview" className="w-full">
        <TabsList className="grid w-full grid-cols-3">
          <TabsTrigger value="overview">Overview</TabsTrigger>
          <TabsTrigger value="transactions">Transactions</TabsTrigger>
          <TabsTrigger value="methods">Payment Methods</TabsTrigger>
        </TabsList>

        <TabsContent value="overview" className="space-y-6">
          <WalletOverview />
        </TabsContent>

        <TabsContent value="transactions" className="space-y-6">
          <TransactionHistory />
        </TabsContent>

        <TabsContent value="methods" className="space-y-6">
          <PaymentMethods />
        </TabsContent>
      </Tabs>
    </div>
  )
}
