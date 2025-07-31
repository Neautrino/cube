import { connectMongo } from "@/db";
import { User } from "@/db/schema";

interface Role {
  _id: string;
  name: string;
  rank: number;
}

export async function POST(request: Request) {
    try {
        await connectMongo();

        const body = await request.json();
        const { taskName, userId } = body;

        const checkUser = await User.findById(userId).populate("role");

        if (!checkUser) {
            return new Response("User not found", { status: 404 });
        }

        const userRank = (checkUser.role as Role)?.rank;

        if (userRank === undefined) {
            return new Response("Role data missing", { status: 500 });
        }

        checkUser.tasks.push({ name: taskName, isCompleted: false });
        await checkUser.save();

        return new Response(JSON.stringify(checkUser), {
            status: 200,
            headers: { "Content-Type": "application/json" },
        });

    } catch (error) {
        console.error("Error assigning task:", error);
        return new Response("Internal server error", { status: 500 });
    }
}