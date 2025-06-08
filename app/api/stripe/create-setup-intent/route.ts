import { type NextRequest, NextResponse } from "next/server"
import { authenticateRequest } from "@/lib/auth"
import { db } from "@/lib/database"
import { createSetupIntent, createStripeCustomer } from "@/lib/stripe"

export async function POST(request: NextRequest) {
  try {
    const auth = await authenticateRequest(request)
    if (!auth) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    // Get user
    const user = await db.users.findById(auth.userId)
    if (!user) {
      return NextResponse.json({ error: "User not found" }, { status: 404 })
    }

    // Create or get Stripe customer
    let stripeCustomerId = user.stripeCustomerId
    if (!stripeCustomerId) {
      const customer = await createStripeCustomer(user.email, `${user.firstName} ${user.lastName}`)
      stripeCustomerId = customer.id
      await db.users.updateStripeCustomerId(auth.userId, stripeCustomerId)
    }

    // Create setup intent for saving payment method
    const setupIntent = await createSetupIntent(stripeCustomerId)

    return NextResponse.json({
      clientSecret: setupIntent.client_secret,
      setupIntentId: setupIntent.id,
    })
  } catch (error) {
    console.error("Create setup intent error:", error)
    return NextResponse.json({ error: "Internal server error" }, { status: 500 })
  }
}
