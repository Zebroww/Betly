import { type NextRequest, NextResponse } from "next/server"
import { authenticateRequest } from "@/lib/auth"
import { db } from "@/lib/database"
import { stripe } from "@/lib/stripe"

export async function POST(request: NextRequest) {
  try {
    const auth = await authenticateRequest(request)
    if (!auth) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    const { setupIntentId } = await request.json()

    if (!setupIntentId) {
      return NextResponse.json({ error: "Setup intent ID is required" }, { status: 400 })
    }

    // Retrieve setup intent from Stripe
    const setupIntent = await stripe.setupIntents.retrieve(setupIntentId)

    if (setupIntent.status !== "succeeded") {
      return NextResponse.json({ error: "Setup intent not succeeded" }, { status: 400 })
    }

    // Get payment method details
    const paymentMethod = await stripe.paymentMethods.retrieve(setupIntent.payment_method as string)

    if (paymentMethod.type !== "card" || !paymentMethod.card) {
      return NextResponse.json({ error: "Only card payment methods are supported" }, { status: 400 })
    }

    // Check if this payment method already exists
    const existingMethod = await db.paymentMethods.findByStripePaymentMethodId(paymentMethod.id)
    if (existingMethod) {
      return NextResponse.json({ error: "Payment method already exists" }, { status: 409 })
    }

    // Check if this is the first payment method (make it default)
    const existingMethods = await db.paymentMethods.findByUserId(auth.userId)
    const isDefault = existingMethods.length === 0

    // Save payment method to database
    const savedMethod = await db.paymentMethods.create({
      userId: auth.userId,
      type: "card",
      name: `${paymentMethod.card.brand.charAt(0).toUpperCase() + paymentMethod.card.brand.slice(1)} ****${
        paymentMethod.card.last4
      }`,
      details: `**** **** **** ${paymentMethod.card.last4}`,
      isDefault,
      isVerified: true,
      stripePaymentMethodId: paymentMethod.id,
      limits: {
        min: 10,
        max: 5000,
        daily: 10000,
      },
    })

    return NextResponse.json({
      paymentMethod: savedMethod,
      message: "Payment method saved successfully",
    })
  } catch (error) {
    console.error("Save payment method error:", error)
    return NextResponse.json({ error: "Internal server error" }, { status: 500 })
  }
}
