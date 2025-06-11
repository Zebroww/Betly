import { ObjectId } from "mongodb"
import { connectToDatabase } from "./mongodb"

export interface DatabaseUser {
  _id?: ObjectId
  id?: string
  email: string
  firstName: string
  lastName: string
  password: string
  balance: number
  bonusBalance: number
  stripeCustomerId?: string
  createdAt: Date
  phone?: string
  dateOfBirth?: string
  address?: string
  city?: string
  country?: string
  bio?: string
  timezone?: string
  isVerified?: boolean
  accountLevel?: string
}

export interface DatabaseBet {
  _id?: ObjectId
  id?: string
  userId: string
  event: string
  selection: string
  odds: number
  stake: number
  potentialWin: number
  status: "pending" | "won" | "lost" | "void" | "cashed_out"
  date: Date
  sport: string
  league: string
  betType: "single" | "accumulator" | "system"
  cashOutValue?: number
  settledAt?: Date
  profit?: number
}

export interface DatabaseTransaction {
  _id?: ObjectId
  id?: string
  userId: string
  type: "deposit" | "withdrawal" | "bet" | "win" | "bonus" | "transfer"
  amount: number
  status: "completed" | "pending" | "failed" | "cancelled"
  date: Date
  description: string
  method?: string
  reference: string
  stripePaymentIntentId?: string
  stripePaymentMethodId?: string
}

export interface DatabasePaymentMethod {
  _id?: ObjectId
  id?: string
  userId: string
  type: "card" | "bank" | "ewallet"
  name: string
  details: string
  isDefault: boolean
  isVerified: boolean
  lastUsed?: Date
  stripePaymentMethodId?: string
  limits?: {
    min: number
    max: number
    daily: number
  }
}

// Helper function to convert MongoDB document to our format
function convertDocument<T extends { _id?: ObjectId; id?: string }>(doc: T): T {
  if (doc._id) {
    doc.id = doc._id.toString()
    delete doc._id
  }
  return doc
}

export const db = {
  users: {
    create: async (userData: Omit<DatabaseUser, "_id" | "id" | "createdAt">): Promise<DatabaseUser> => {
      const { db } = await connectToDatabase()
      const user: Omit<DatabaseUser, "_id" | "id"> = {
        ...userData,
        createdAt: new Date(),
      }

      const result = await db.collection("users").insertOne(user)
      const createdUser = await db.collection("users").findOne({ _id: result.insertedId })

      return convertDocument(createdUser as DatabaseUser)
    },

    findByEmail: async (email: string): Promise<DatabaseUser | null> => {
      const { db } = await connectToDatabase()
      const user = await db.collection("users").findOne({ email })
      return user ? convertDocument(user as DatabaseUser) : null
    },

    findById: async (id: string): Promise<DatabaseUser | null> => {
      const { db } = await connectToDatabase()
      const user = await db.collection("users").findOne({ _id: new ObjectId(id) })
      return user ? convertDocument(user as DatabaseUser) : null
    },

    updateBalance: async (userId: string, newBalance: number, newBonusBalance?: number): Promise<void> => {
      const { db } = await connectToDatabase()
      const updateData: any = { balance: newBalance }
      if (newBonusBalance !== undefined) {
        updateData.bonusBalance = newBonusBalance
      }

      await db.collection("users").updateOne({ _id: new ObjectId(userId) }, { $set: updateData })
    },

    updateProfile: async (userId: string, updates: Partial<DatabaseUser>): Promise<void> => {
      const { db } = await connectToDatabase()

      // Convert email to lowercase if provided
      if (updates.email) {
        updates.email = updates.email.toLowerCase()
      }

      await db
        .collection("users")
        .updateOne({ _id: new ObjectId(userId) }, { $set: { ...updates, updatedAt: new Date() } })
    },

    updateStripeCustomerId: async (userId: string, stripeCustomerId: string): Promise<void> => {
      const { db } = await connectToDatabase()
      await db.collection("users").updateOne({ _id: new ObjectId(userId) }, { $set: { stripeCustomerId } })
    },
  },

  bets: {
    create: async (betData: Omit<DatabaseBet, "_id" | "id">): Promise<DatabaseBet> => {
      const { db } = await connectToDatabase()
      const result = await db.collection("bets").insertOne(betData)
      const createdBet = await db.collection("bets").findOne({ _id: result.insertedId })

      return convertDocument(createdBet as DatabaseBet)
    },

    findByUserId: async (userId: string): Promise<DatabaseBet[]> => {
      const { db } = await connectToDatabase()
      const bets = await db.collection("bets").find({ userId }).sort({ date: -1 }).toArray()

      return bets.map((bet) => convertDocument(bet as DatabaseBet))
    },

    findById: async (id: string): Promise<DatabaseBet | null> => {
      const { db } = await connectToDatabase()
      const bet = await db.collection("bets").findOne({ _id: new ObjectId(id) })
      return bet ? convertDocument(bet as DatabaseBet) : null
    },

    update: async (id: string, updates: Partial<DatabaseBet>): Promise<DatabaseBet | null> => {
      const { db } = await connectToDatabase()
      const result = await db
        .collection("bets")
        .findOneAndUpdate({ _id: new ObjectId(id) }, { $set: updates }, { returnDocument: "after" })

      return result ? convertDocument(result as DatabaseBet) : null
    },

    getStats: async (
      userId: string,
    ): Promise<{
      totalBets: number
      wonBets: number
      lostBets: number
      pendingBets: number
      totalStaked: number
      totalProfit: number
    }> => {
      const { db } = await connectToDatabase()
      const bets = await db.collection("bets").find({ userId }).toArray()

      const totalBets = bets.length
      const wonBets = bets.filter((bet) => bet.status === "won").length
      const lostBets = bets.filter((bet) => bet.status === "lost").length
      const pendingBets = bets.filter((bet) => bet.status === "pending").length
      const totalStaked = bets.reduce((sum, bet) => sum + bet.stake, 0)
      const totalProfit = bets.reduce((sum, bet) => sum + (bet.profit || 0), 0)

      return {
        totalBets,
        wonBets,
        lostBets,
        pendingBets,
        totalStaked,
        totalProfit,
      }
    },
  },

  transactions: {
    create: async (transactionData: Omit<DatabaseTransaction, "_id" | "id">): Promise<DatabaseTransaction> => {
      const { db } = await connectToDatabase()
      const result = await db.collection("transactions").insertOne(transactionData)
      const createdTransaction = await db.collection("transactions").findOne({ _id: result.insertedId })

      return convertDocument(createdTransaction as DatabaseTransaction)
    },

    findByUserId: async (userId: string, limit?: number): Promise<DatabaseTransaction[]> => {
      const { db } = await connectToDatabase()
      let query = db.collection("transactions").find({ userId }).sort({ date: -1 })

      if (limit) {
        query = query.limit(limit)
      }

      const transactions = await query.toArray()
      return transactions.map((transaction) => convertDocument(transaction as DatabaseTransaction))
    },

    findByType: async (userId: string, type: string): Promise<DatabaseTransaction[]> => {
      const { db } = await connectToDatabase()
      const transactions = await db.collection("transactions").find({ userId, type }).sort({ date: -1 }).toArray()

      return transactions.map((transaction) => convertDocument(transaction as DatabaseTransaction))
    },

    findByStripePaymentIntent: async (paymentIntentId: string): Promise<DatabaseTransaction | null> => {
      const { db } = await connectToDatabase()
      const transaction = await db.collection("transactions").findOne({ stripePaymentIntentId: paymentIntentId })
      return transaction ? convertDocument(transaction as DatabaseTransaction) : null
    },

    updateStatus: async (id: string, status: string): Promise<void> => {
      const { db } = await connectToDatabase()
      await db.collection("transactions").updateOne({ _id: new ObjectId(id) }, { $set: { status } })
    },
  },

  paymentMethods: {
    create: async (methodData: Omit<DatabasePaymentMethod, "_id" | "id">): Promise<DatabasePaymentMethod> => {
      const { db } = await connectToDatabase()

      // If this is set as default, unset all other defaults for this user
      if (methodData.isDefault) {
        await db.collection("paymentMethods").updateMany({ userId: methodData.userId }, { $set: { isDefault: false } })
      }

      const result = await db.collection("paymentMethods").insertOne(methodData)
      const createdMethod = await db.collection("paymentMethods").findOne({ _id: result.insertedId })

      return convertDocument(createdMethod as DatabasePaymentMethod)
    },

    findByUserId: async (userId: string): Promise<DatabasePaymentMethod[]> => {
      const { db } = await connectToDatabase()
      const methods = await db
        .collection("paymentMethods")
        .find({ userId })
        .sort({ isDefault: -1, lastUsed: -1 })
        .toArray()

      return methods.map((method) => convertDocument(method as DatabasePaymentMethod))
    },

    delete: async (id: string, userId: string): Promise<boolean> => {
      const { db } = await connectToDatabase()
      const result = await db.collection("paymentMethods").deleteOne({
        _id: new ObjectId(id),
        userId,
      })

      return result.deletedCount > 0
    },

    setDefault: async (id: string, userId: string): Promise<boolean> => {
      const { db } = await connectToDatabase()

      // First, unset all defaults for this user
      await db.collection("paymentMethods").updateMany({ userId }, { $set: { isDefault: false } })

      // Then set the specified method as default
      const result = await db
        .collection("paymentMethods")
        .updateOne({ _id: new ObjectId(id), userId }, { $set: { isDefault: true } })

      return result.modifiedCount > 0
    },

    findByStripePaymentMethodId: async (stripePaymentMethodId: string): Promise<DatabasePaymentMethod | null> => {
      const { db } = await connectToDatabase()
      const method = await db.collection("paymentMethods").findOne({ stripePaymentMethodId })
      return method ? convertDocument(method as DatabasePaymentMethod) : null
    },
  },
}
