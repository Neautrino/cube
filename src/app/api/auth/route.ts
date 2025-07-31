import { cookies } from "next/headers";
import { connectMongo } from "@/db";
import { User } from "@/db/schema";

export async function GET() {
  try {
    const cookieStore = await cookies();
    const userId = cookieStore.get("user_id");

    if (!userId) {
      return new Response(JSON.stringify({ authenticated: false }), {
        status: 401,
        headers: { "Content-Type": "application/json" },
      });
    }

    // Verify the user exists in the database
    await connectMongo();
    const user = await User.findById(userId.value).populate("role");
    
    if (!user) {
      return new Response(JSON.stringify({ authenticated: false }), {
        status: 401,
        headers: { "Content-Type": "application/json" },
      });
    }

    return new Response(JSON.stringify({ 
      authenticated: true, 
      user: {
        _id: user._id,
        name: user.name,
        email: user.email,
        role: user.role
      }
    }), {
      status: 200,
      headers: { "Content-Type": "application/json" },
    });
  } catch (error) {
    console.error("Auth check error:", error);
    return new Response(JSON.stringify({ authenticated: false }), {
      status: 500,
      headers: { "Content-Type": "application/json" },
    });
  }
} 