import { type NextRequest, NextResponse } from "next/server"
import { authenticateRequest } from "@/lib/auth"
import { db } from "@/lib/database"

export async function POST(request: NextRequest, { params }: { params: { id: string } }) {
  try {
    const auth = await authenticateRequest(request)
    if (!auth) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    const success = await db.paymentMethods.setDefault(params.id, auth.userId)

    if (!success) {
      return NextResponse.json({ error: "Payment method not found" }, { status: 404 })
    }

    return NextResponse.json({ message: "Default payment method updated" })
  } catch (error) {
    console.error("Set default payment method error:", error)
    return NextResponse.json({ error: "Internal server error" }, { status: 500 })
  }
}
