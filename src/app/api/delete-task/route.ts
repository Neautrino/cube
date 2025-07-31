import { connectMongo } from "@/db";
import { User } from "@/db/schema";

export async function POST(request: Request) {
    try {
        await connectMongo();

        const body = await request.json();
        const { userId, taskIndex, currentUserId } = body;

        const user = await User.findById(userId).populate("role");
        const currentUser = await User.findById(currentUserId).populate("role");

        if (!user) {
            return new Response("User not found", { status: 404 });
        }

        if (!currentUser) {
            return new Response("Current user not found", { status: 404 });
        }

        // Check if task exists
        if (!user.tasks[taskIndex]) {
            return new Response("Task not found", { status: 404 });
        }

        // Remove task from array
        user.tasks.splice(taskIndex, 1);
        await user.save();

        return new Response(JSON.stringify(user), {
            status: 200,
            headers: { "Content-Type": "application/json" },
        });

    } catch (error) {
        console.error("Error deleting task:", error);
        return new Response("Error deleting task", { status: 500 });
    }
} 