import { connectMongo } from "@/db" 
import { User } from "@/db/schema" 

interface Role {
  _id: string;
  name: string;
  rank: number;
}

export async function DELETE(request: Request) {
  try {
    await connectMongo()

    const body = await request.json()
    const { userId } = body

    const userToDelete = await User.findById(userId).populate("role")

    if (!userToDelete) {
      return new Response("User to delete not found", { status: 404 })
    }

    await User.deleteOne({ _id: userId })

    return new Response(JSON.stringify({ message: "User deleted" }), {
      status: 200,
      headers: {
        "Content-Type": "application/json",
      },
    })
  } catch (error) {
    console.error("Error deleting user:", error)
    return new Response("Error deleting user", { status: 500 })
  }
}
