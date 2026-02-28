// app/api/room/create/route.ts
import { NextResponse } from "next/server";
import Room from "@/models/Room";
import { generateRoomId } from "@/lib/utils";
import { connectToDatabase } from "@/lib/mongodb";

// app/api/room/create/route.ts
export async function POST() {
    try {
        console.log("Attempting to connect to DB..."); // Add this
        await connectToDatabase();

        const roomId = generateRoomId();
        console.log("Generating Room:", roomId); // Add this

        const newRoom = await Room.create({
            roomId,
            ingredients: [],
            status: "lobby",
        });

        return NextResponse.json({ roomId: newRoom.roomId }, { status: 201 });
    } catch (error) {
        console.error("DETAILED ERROR:", error); // This will show in your terminal
        return NextResponse.json({ error: "Failed to create room" }, { status: 500 });
    }
}