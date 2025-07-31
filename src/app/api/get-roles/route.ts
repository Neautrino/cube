import { connectMongo } from "@/db"
import { Role } from "@/db/schema"

export async function GET() {
  try {
    await connectMongo()
    const roles = await Role.find().sort({ rank: 1 }) // Optional: sort by rank
    return new Response(JSON.stringify(roles), {
      headers: { "Content-Type": "application/json" },
      status: 200
    })
  } catch (err) {
    console.error(err)
    return new Response("Failed to fetch roles", { status: 500 })
  }
}
