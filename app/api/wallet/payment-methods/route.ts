import { type NextRequest, NextResponse } from "next/server"
import { authenticateRequest } from "@/lib/auth"
import { db } from "@/lib/database"

export async function GET(request: NextRequest) {
  try {
    const auth = await authenticateRequest(request)
    if (!auth) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    const paymentMethods = await db.paymentMethods.findByUserId(auth.userId)
    return NextResponse.json({ paymentMethods })
  } catch (error) {
    console.error("Get payment methods error:", error)
    return NextResponse.json({ error: "Internal server error" }, { status: 500 })
  }
}

export async function POST(request: NextRequest) {
  try {
    const auth = await authenticateRequest(request)
    if (!auth) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    const { type, name, details } = await request.json()

    // Validate input
    if (!type || !name || !details) {
      return NextResponse.json({ error: "All fields are required" }, { status: 400 })
    }

    // Check if this is the first payment method (make it default)
    const existingMethods = await db.paymentMethods.findByUserId(auth.userId)
    const isDefault = existingMethods.length === 0

    const paymentMethod = await db.paymentMethods.create({
      userId: auth.userId,
      type,
      name,
      details,
      isDefault,
      isVerified: type === "card", // Auto-verify cards for demo
    })

    return NextResponse.json({ paymentMethod })
  } catch (error) {
    console.error("Add payment method error:", error)
    return NextResponse.json({ error: "Internal server error" }, { status: 500 })
  }
}
