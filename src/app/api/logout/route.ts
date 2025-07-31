import { cookies } from "next/headers";

export async function POST() {
  try {
    const cookieStore = await cookies();
    
    // Clear the user_id cookie
    cookieStore.delete("user_id");

    return new Response(JSON.stringify({ message: "Logged out successfully" }), {
      status: 200,
      headers: { "Content-Type": "application/json" },
    });
  } catch (error) {
    console.error("Logout error:", error);
    return new Response(JSON.stringify({ message: "Logout failed" }), {
      status: 500,
      headers: { "Content-Type": "application/json" },
    });
  }
} 