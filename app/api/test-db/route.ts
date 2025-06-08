import { NextResponse } from "next/server"
import { connectToDatabase } from "@/lib/mongodb"

export async function GET() {
  try {
    console.log("Testing MongoDB connection...")

    // Test basic connection
    const { db, client } = await connectToDatabase()
    console.log("✓ Connected to MongoDB")

    // Test database operations
    const stats = await db.stats()
    console.log("✓ Database stats retrieved")

    // Test collections access
    const collections = await db.listCollections().toArray()
    console.log(
      "✓ Collections listed:",
      collections.map((c) => c.name),
    )

    // Test a simple write operation
    const testCollection = db.collection("connection_test")
    const testDoc = {
      timestamp: new Date(),
      test: "MongoDB connection test",
      success: true,
    }

    const insertResult = await testCollection.insertOne(testDoc)
    console.log("✓ Test document inserted:", insertResult.insertedId)

    // Test read operation
    const retrievedDoc = await testCollection.findOne({ _id: insertResult.insertedId })
    console.log("✓ Test document retrieved")

    // Clean up test document
    await testCollection.deleteOne({ _id: insertResult.insertedId })
    console.log("✓ Test document cleaned up")

    return NextResponse.json({
      success: true,
      message: "MongoDB connection and operations successful",
      details: {
        database: stats.db,
        collections: stats.collections,
        dataSize: stats.dataSize,
        indexSize: stats.indexSize,
        availableCollections: collections.map((c) => c.name),
        testOperations: {
          insert: "✓ Success",
          read: "✓ Success",
          delete: "✓ Success",
        },
      },
      timestamp: new Date().toISOString(),
    })
  } catch (error) {
    console.error("❌ Database connection error:", error)

    return NextResponse.json(
      {
        success: false,
        message: "MongoDB connection failed",
        error: error instanceof Error ? error.message : "Unknown error",
        details: {
          errorType: error instanceof Error ? error.constructor.name : "Unknown",
          stack: error instanceof Error ? error.stack : undefined,
        },
        timestamp: new Date().toISOString(),
      },
      { status: 500 },
    )
  }
}
