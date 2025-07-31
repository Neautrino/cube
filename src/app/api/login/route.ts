import { connectMongo } from "@/db";
import { User } from "@/db/schema";
import bcrypt from "bcryptjs";
import { cookies } from "next/headers";

export async function POST(request: Request) {
  try {
    await connectMongo();

    const { email, password } = await request.json();
    if (!email || !password) return new Response("Email is required", { status: 400 });

    const user = await User.findOne({ email}).populate("role");
    if (!user) return new Response("User not found", { status: 404 });

    const ispasswordValid = await bcrypt.compare(password, user.password);

    if (!ispasswordValid) return new Response("Invalid password", { status: 401 });

    (await cookies()).set("user_id", user._id.toString(), {
      httpOnly: true,
      path: "/",
      sameSite: "lax",
      maxAge: 60 * 60 * 24 * 7, // 7 days
    });

    return new Response(JSON.stringify(user), {
      status: 200,
      headers: { "Content-Type": "application/json" },
    });
  } catch (err) {
    console.error("Login error:", err);
    return new Response("Login failed", { status: 500 });
  }
}
