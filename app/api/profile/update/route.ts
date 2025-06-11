import { type NextRequest, NextResponse } from "next/server"
import { authenticateRequest } from "@/lib/auth"
import { db } from "@/lib/database"

export async function PUT(request: NextRequest) {
  try {
    const auth = await authenticateRequest(request)
    if (!auth) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    const updates = await request.json()

    // Validate email format if email is being updated
    if (updates.email) {
      const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
      if (!emailRegex.test(updates.email)) {
        return NextResponse.json({ error: "Invalid email format" }, { status: 400 })
      }

      // Check if email is already taken by another user
      const existingUser = await db.users.findByEmail(updates.email.toLowerCase())
      if (existingUser && existingUser.id !== auth.userId) {
        return NextResponse.json({ error: "Email already in use" }, { status: 409 })
      }
    }

    // Remove sensitive fields that shouldn't be updated via this endpoint
    const { password, balance, bonusBalance, stripeCustomerId, ...allowedUpdates } = updates

    // Update user profile
    await db.users.updateProfile(auth.userId, allowedUpdates)

    // Fetch updated user data
    const updatedUser = await db.users.findById(auth.userId)
    if (!updatedUser) {
      return NextResponse.json({ error: "User not found" }, { status: 404 })
    }

    // Remove password from response
    const { password: _, ...userWithoutPassword } = updatedUser

    return NextResponse.json({
      user: userWithoutPassword,
      message: "Profile updated successfully",
    })
  } catch (error) {
    console.error("Profile update error:", error)
    return NextResponse.json({ error: "Internal server error" }, { status: 500 })
  }
}
