import mongoose from "mongoose"

const MONGODB_URI = process.env.DATABASE_URL

if (!MONGODB_URI) {
  throw new Error("Missing DATABASE_URL in environment")
}

let isConnected = false

export async function connectMongo() {
  if (isConnected) return

  await mongoose.connect(MONGODB_URI || "")
  isConnected = true
  console.log("MongoDB connected successfully")
}
