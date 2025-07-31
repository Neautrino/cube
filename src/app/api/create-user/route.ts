import { connectMongo } from "@/db";
import { Role, User } from "@/db/schema";
import bcrypt from "bcryptjs";

interface UserRole {
  _id: string;
  name: string;
  rank: number;
}

export async function POST(request: Request) {
    try {
        await connectMongo();
        const body = await request.json();
        const { name, email, roleId, password } = body;

        const getRole = await Role.findOne({
            _id: roleId
        });

        if (!getRole) {
            return new Response("Role not exist", { status: 404 });
        }

        const salt = await bcrypt.genSalt(10);
        const hashedPassword = await bcrypt.hash(password, salt);

        const newUser = await User.create({
            name,
            email,
            password: hashedPassword,
            role: roleId,
            tasks: []
        });

        return new Response(JSON.stringify(newUser), {
            status: 201,
            headers: {
                "Content-Type": "application/json"
            }
        });
    } catch (error) {
        console.error("Error creating user:", error);
        return new Response("Error creating user", { status: 500 });
    }
}