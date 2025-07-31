import { connectMongo } from "@/db"
import { User } from "@/db/schema"

export async function GET() {
  try {
    await connectMongo()
    const users = await User.find().populate("role")
    return new Response(JSON.stringify(users), {
      headers: { "Content-Type": "application/json" },
      status: 200
    })
  } catch (err) {
    console.error(err)
    return new Response("Failed to fetch users", { status: 500 })
  }
}
