import { NextResponse } from "next/server";
import { connectToDatabase } from "@/lib/mongodb";
import Room from "@/models/Room";

export async function POST(req: Request) {
    try {
        const { roomId, password } = await req.json();
        await connectToDatabase();

        // Use the direct collection for the most up-to-date data
        const room = await Room.collection.findOne({ roomId: roomId });

        if (!room) {
            return NextResponse.json({ error: "Room not found" }, { status: 404 });
        }

        // Compare the plain text password (or use bcrypt if you hashed it)
        if (room.password !== password) {
            return NextResponse.json({ error: "Incorrect password" }, { status: 401 });
        }

        // Return the room status so the frontend knows where to start the user
        return NextResponse.json({
            success: true,
            status: room.status
        });

    } catch (error: any) {
        return NextResponse.json({ error: "Join failed" }, { status: 500 });
    }
}