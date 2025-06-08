"use client"

import { useState } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { CreditCard, Smartphone, Building, Plus, Trash2, Star, Shield, Clock } from "lucide-react"

interface PaymentMethod {
  id: string
  type: "card" | "bank" | "ewallet"
  name: string
  details: string
  isDefault: boolean
  isVerified: boolean
  lastUsed?: string
  limits?: {
    min: number
    max: number
    daily: number
  }
}

export function PaymentMethods() {
  const [paymentMethods, setPaymentMethods] = useState<PaymentMethod[]>([
    {
      id: "1",
      type: "card",
      name: "Visa Credit Card",
      details: "**** **** **** 1234",
      isDefault: true,
      isVerified: true,
      lastUsed: "2024-01-20",
      limits: { min: 10, max: 5000, daily: 10000 },
    },
    {
      id: "2",
      type: "ewallet",
      name: "PayPal",
      details: "john@example.com",
      isDefault: false,
      isVerified: true,
      lastUsed: "2024-01-17",
      limits: { min: 5, max: 2500, daily: 5000 },
    },
    {
      id: "3",
      type: "bank",
      name: "Bank Transfer",
      details: "Chase Bank ****5678",
      isDefault: false,
      isVerified: false,
      limits: { min: 50, max: 10000, daily: 25000 },
    },
  ])

  const [isAddingMethod, setIsAddingMethod] = useState(false)

  const getMethodIcon = (type: string) => {
    switch (type) {
      case "card":
        return <CreditCard className="h-5 w-5" />
      case "ewallet":
        return <Smartphone className="h-5 w-5" />
      case "bank":
        return <Building className="h-5 w-5" />
      default:
        return <CreditCard className="h-5 w-5" />
    }
  }

  const setAsDefault = (id: string) => {
    setPaymentMethods((methods) =>
      methods.map((method) => ({
        ...method,
        isDefault: method.id === id,
      })),
    )
  }

  const removeMethod = (id: string) => {
    setPaymentMethods((methods) => methods.filter((method) => method.id !== id))
  }

  const AddPaymentMethodDialog = () => (
    <Dialog open={isAddingMethod} onOpenChange={setIsAddingMethod}>
      <DialogTrigger asChild>
        <Button className="w-full">
          <Plus className="h-4 w-4 mr-2" />
          Add Payment Method
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>Add Payment Method</DialogTitle>
        </DialogHeader>
        <div className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="method-type">Payment Method Type</Label>
            <Select>
              <SelectTrigger>
                <SelectValue placeholder="Select payment method" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="card">Credit/Debit Card</SelectItem>
                <SelectItem value="bank">Bank Transfer</SelectItem>
                <SelectItem value="paypal">PayPal</SelectItem>
                <SelectItem value="skrill">Skrill</SelectItem>
                <SelectItem value="neteller">Neteller</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div className="space-y-2">
            <Label htmlFor="card-number">Card Number</Label>
            <Input id="card-number" placeholder="1234 5678 9012 3456" />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="expiry">Expiry Date</Label>
              <Input id="expiry" placeholder="MM/YY" />
            </div>
            <div className="space-y-2">
              <Label htmlFor="cvv">CVV</Label>
              <Input id="cvv" placeholder="123" />
            </div>
          </div>

          <div className="space-y-2">
            <Label htmlFor="cardholder">Cardholder Name</Label>
            <Input id="cardholder" placeholder="John Doe" />
          </div>

          <div className="flex gap-2">
            <Button className="flex-1" onClick={() => setIsAddingMethod(false)}>
              Add Method
            </Button>
            <Button variant="outline" onClick={() => setIsAddingMethod(false)}>
              Cancel
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  )

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle>Payment Methods</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          {paymentMethods.map((method) => (
            <div key={method.id} className="flex items-center justify-between p-4 border rounded-lg">
              <div className="flex items-center gap-4">
                <div className="p-2 bg-muted rounded-lg">{getMethodIcon(method.type)}</div>
                <div className="space-y-1">
                  <div className="flex items-center gap-2">
                    <p className="font-medium">{method.name}</p>
                    {method.isDefault && (
                      <Badge variant="secondary">
                        <Star className="h-3 w-3 mr-1" />
                        Default
                      </Badge>
                    )}
                    {method.isVerified ? (
                      <Badge className="bg-green-100 text-green-800">
                        <Shield className="h-3 w-3 mr-1" />
                        Verified
                      </Badge>
                    ) : (
                      <Badge variant="outline">
                        <Clock className="h-3 w-3 mr-1" />
                        Pending
                      </Badge>
                    )}
                  </div>
                  <p className="text-sm text-muted-foreground">{method.details}</p>
                  {method.lastUsed && (
                    <p className="text-xs text-muted-foreground">
                      Last used: {new Date(method.lastUsed).toLocaleDateString()}
                    </p>
                  )}
                  {method.limits && (
                    <p className="text-xs text-muted-foreground">
                      Limits: ${method.limits.min} - ${method.limits.max} (Daily: ${method.limits.daily})
                    </p>
                  )}
                </div>
              </div>
              <div className="flex items-center gap-2">
                {!method.isDefault && (
                  <Button variant="outline" size="sm" onClick={() => setAsDefault(method.id)}>
                    Set Default
                  </Button>
                )}
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => removeMethod(method.id)}
                  className="text-red-600 hover:text-red-700"
                >
                  <Trash2 className="h-4 w-4" />
                </Button>
              </div>
            </div>
          ))}

          <AddPaymentMethodDialog />
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Supported Payment Methods</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            <div className="flex items-center gap-2 p-3 border rounded-lg">
              <CreditCard className="h-5 w-5" />
              <span className="text-sm">Visa</span>
            </div>
            <div className="flex items-center gap-2 p-3 border rounded-lg">
              <CreditCard className="h-5 w-5" />
              <span className="text-sm">Mastercard</span>
            </div>
            <div className="flex items-center gap-2 p-3 border rounded-lg">
              <Smartphone className="h-5 w-5" />
              <span className="text-sm">PayPal</span>
            </div>
            <div className="flex items-center gap-2 p-3 border rounded-lg">
              <Smartphone className="h-5 w-5" />
              <span className="text-sm">Skrill</span>
            </div>
            <div className="flex items-center gap-2 p-3 border rounded-lg">
              <Smartphone className="h-5 w-5" />
              <span className="text-sm">Neteller</span>
            </div>
            <div className="flex items-center gap-2 p-3 border rounded-lg">
              <Building className="h-5 w-5" />
              <span className="text-sm">Bank Transfer</span>
            </div>
            <div className="flex items-center gap-2 p-3 border rounded-lg">
              <Smartphone className="h-5 w-5" />
              <span className="text-sm">Apple Pay</span>
            </div>
            <div className="flex items-center gap-2 p-3 border rounded-lg">
              <Smartphone className="h-5 w-5" />
              <span className="text-sm">Google Pay</span>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
