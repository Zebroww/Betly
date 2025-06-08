import { type NextRequest, NextResponse } from "next/server"
import { authenticateRequest } from "@/lib/auth"
import { db } from "@/lib/database"

interface ValidateBetRequest {
  selections: Array<{
    eventId: string
    market: string
    selection: string
    odds: number
    eventName: string
  }>
  betType: "single" | "accumulator" | "system"
  stakes: Record<string, number>
  systemType?: string
}

export async function POST(request: NextRequest) {
  try {
    const auth = await authenticateRequest(request)
    if (!auth) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    const { selections, betType, stakes, systemType }: ValidateBetRequest = await request.json()

    // Get user balance
    const user = await db.users.findById(auth.userId)
    if (!user) {
      return NextResponse.json({ error: "User not found" }, { status: 404 })
    }

    const validation = {
      isValid: true,
      errors: [] as string[],
      warnings: [] as string[],
      calculations: {
        totalStake: 0,
        potentialWin: 0,
        combinations: 0,
        maxPayout: 0,
      },
      limits: {
        minStake: 1,
        maxStake: 10000,
        maxPayout: 100000,
        userBalance: user.balance,
      },
    }

    // Validate selections
    if (!selections || selections.length === 0) {
      validation.errors.push("At least one selection is required")
      validation.isValid = false
    }

    // Validate bet type
    if (!["single", "accumulator", "system"].includes(betType)) {
      validation.errors.push("Invalid bet type")
      validation.isValid = false
    }

    // Validate selections data
    for (let i = 0; i < selections.length; i++) {
      const selection = selections[i]
      if (!selection.eventId || !selection.market || !selection.selection) {
        validation.errors.push(`Selection ${i + 1}: Missing required data`)
        validation.isValid = false
      }

      if (selection.odds < 1.01 || selection.odds > 1000) {
        validation.errors.push(`Selection ${i + 1}: Odds must be between 1.01 and 1000`)
        validation.isValid = false
      }

      // Check for very high odds
      if (selection.odds > 100) {
        validation.warnings.push(`Selection ${i + 1}: Very high odds (${selection.odds})`)
      }
    }

    // Calculate stakes and potential wins based on bet type
    if (betType === "single") {
      for (const selection of selections) {
        const stakeKey = `${selection.eventId}-${selection.market}`
        const stake = stakes[stakeKey] || 0

        if (stake < validation.limits.minStake) {
          validation.errors.push(`${selection.selection}: Minimum stake is $${validation.limits.minStake}`)
          validation.isValid = false
        }

        if (stake > validation.limits.maxStake) {
          validation.errors.push(`${selection.selection}: Maximum stake is $${validation.limits.maxStake}`)
          validation.isValid = false
        }

        validation.calculations.totalStake += stake
        validation.calculations.potentialWin += stake * selection.odds
      }
    } else if (betType === "accumulator") {
      if (selections.length < 2) {
        validation.errors.push("Accumulator requires at least 2 selections")
        validation.isValid = false
      }

      const accumulatorStake = stakes["accumulator"] || 0
      validation.calculations.totalStake = accumulatorStake

      if (accumulatorStake < validation.limits.minStake) {
        validation.errors.push(`Minimum stake is $${validation.limits.minStake}`)
        validation.isValid = false
      }

      if (accumulatorStake > validation.limits.maxStake) {
        validation.errors.push(`Maximum stake is $${validation.limits.maxStake}`)
        validation.isValid = false
      }

      // Calculate combined odds
      const combinedOdds = selections.reduce((odds, selection) => odds * selection.odds, 1)
      validation.calculations.potentialWin = accumulatorStake * combinedOdds

      // Warn about very high combined odds
      if (combinedOdds > 1000) {
        validation.warnings.push(`Very high combined odds (${combinedOdds.toFixed(2)})`)
      }
    } else if (betType === "system") {
      if (selections.length < 3) {
        validation.errors.push("System bet requires at least 3 selections")
        validation.isValid = false
      }

      if (!systemType) {
        validation.errors.push("System type is required")
        validation.isValid = false
      } else {
        const [systemSize, totalSelections] = systemType.split("/").map(Number)

        if (totalSelections !== selections.length) {
          validation.errors.push("System type doesn't match number of selections")
          validation.isValid = false
        }

        if (systemSize >= totalSelections) {
          validation.errors.push("Invalid system type")
          validation.isValid = false
        }

        validation.calculations.combinations = calculateCombinations(selections.length, systemSize)

        const systemStake = stakes["system"] || 0
        validation.calculations.totalStake = systemStake * validation.calculations.combinations

        if (systemStake < validation.limits.minStake) {
          validation.errors.push(`Minimum stake per combination is $${validation.limits.minStake}`)
          validation.isValid = false
        }

        if (validation.calculations.totalStake > validation.limits.maxStake * 10) {
          validation.errors.push("Total system stake too high")
          validation.isValid = false
        }
      }
    }

    // Check user balance
    if (validation.calculations.totalStake > user.balance) {
      validation.errors.push(
        `Insufficient balance. Required: $${validation.calculations.totalStake.toFixed(2)}, Available: $${user.balance.toFixed(2)}`,
      )
      validation.isValid = false
    }

    // Check maximum payout limits
    if (validation.calculations.potentialWin > validation.limits.maxPayout) {
      validation.errors.push(`Potential win exceeds maximum payout limit of $${validation.limits.maxPayout}`)
      validation.isValid = false
    }

    // Add warnings for large stakes
    if (validation.calculations.totalStake > user.balance * 0.5) {
      validation.warnings.push("This bet uses more than 50% of your balance")
    }

    if (validation.calculations.totalStake > 1000) {
      validation.warnings.push("Large stake amount")
    }

    return NextResponse.json(validation)
  } catch (error) {
    console.error("Validate bet error:", error)
    return NextResponse.json({ error: "Internal server error" }, { status: 500 })
  }
}

function calculateCombinations(n: number, r: number): number {
  if (r > n) return 0
  if (r === 0 || r === n) return 1

  let result = 1
  for (let i = 0; i < r; i++) {
    result = (result * (n - i)) / (i + 1)
  }
  return Math.round(result)
}
