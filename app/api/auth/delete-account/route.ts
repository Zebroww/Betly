import { type NextRequest, NextResponse } from "next/server"
import { authenticateRequest } from "@/lib/auth"
import { db } from "@/lib/database"
import { stripe } from "@/lib/stripe"
import { connectToDatabase } from "@/lib/mongodb"
import { ObjectId } from "mongodb"
import { cookies } from "next/headers"

export async function DELETE(request: NextRequest) {
  try {
    const auth = await authenticateRequest(request)
    if (!auth) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    const user = await db.users.findById(auth.userId)
    if (!user) {
      return NextResponse.json({ error: "User not found" }, { status: 404 })
    }

    // Check if user has pending bets or transactions
    const pendingBets = await db.bets.findByUserId(auth.userId)
    const hasPendingBets = pendingBets.some((bet) => bet.status === "pending")

    if (hasPendingBets) {
      return NextResponse.json(
        { error: "Cannot delete account with pending bets. Please wait for all bets to be settled." },
        { status: 400 },
      )
    }

    // Check for positive balance
    if (user.balance > 0 || user.bonusBalance > 0) {
      return NextResponse.json(
        { error: "Cannot delete account with remaining balance. Please withdraw all funds first." },
        { status: 400 },
      )
    }

    // Start deletion process
    console.log(`Starting account deletion for user: ${auth.userId}`)

    try {
      // Get database connection
      const { db: database } = await connectToDatabase()
      const userObjectId = new ObjectId(auth.userId)

      // 1. Delete Stripe customer and payment methods if they exist
      if (user.stripeCustomerId) {
        try {
          await stripe.customers.del(user.stripeCustomerId)
          console.log(`Deleted Stripe customer: ${user.stripeCustomerId}`)
        } catch (stripeError) {
          console.error("Error deleting Stripe customer:", stripeError)
          // Continue with deletion even if Stripe cleanup fails
        }
      }

      // 2. Delete payment methods from database
      const paymentMethodsResult = await database.collection("paymentMethods").deleteMany({ userId: auth.userId })
      console.log(`Deleted ${paymentMethodsResult.deletedCount} payment methods`)

      // 3. Delete transactions
      const transactionsResult = await database.collection("transactions").deleteMany({ userId: auth.userId })
      console.log(`Deleted ${transactionsResult.deletedCount} transactions`)

      // 4. Delete bets
      const betsResult = await database.collection("bets").deleteMany({ userId: auth.userId })
      console.log(`Deleted ${betsResult.deletedCount} bets`)

      // 5. Finally delete the user account using ObjectId
      const userResult = await database.collection("users").deleteOne({ _id: userObjectId })

      if (userResult.deletedCount === 0) {
        throw new Error("Failed to delete user from database")
      }

      console.log("Successfully deleted user account from database")

      // Clear the auth token cookie on the server side as well
      cookies().delete("auth-token")

      return NextResponse.json({
        message: "Account successfully deleted",
        deletedAt: new Date().toISOString(),
        deletedData: {
          user: 1,
          bets: betsResult.deletedCount,
          transactions: transactionsResult.deletedCount,
          paymentMethods: paymentMethodsResult.deletedCount,
        },
      })
    } catch (deletionError) {
      console.error("Error during account deletion:", deletionError)
      return NextResponse.json(
        {
          error: "Failed to delete account. Please contact support.",
          details: deletionError instanceof Error ? deletionError.message : "Unknown error",
        },
        { status: 500 },
      )
    }
  } catch (error) {
    console.error("Delete account error:", error)
    return NextResponse.json({ error: "Internal server error" }, { status: 500 })
  }
}
