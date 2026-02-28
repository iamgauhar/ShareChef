export const dynamic = "force-dynamic"; // Kills Next.js caching

import { NextResponse } from "next/server";
import { connectToDatabase } from "@/lib/mongodb";
import Room from "@/models/Room";

export async function GET(req: Request) {
    try {
        const { searchParams } = new URL(req.url);
        const roomId = searchParams.get("roomId");

        if (!roomId) {
            return NextResponse.json({ error: "Missing roomId" }, { status: 400 });
        }

        await connectToDatabase();

        // ADDED .lean() HERE - This fixes the serialization issue!
        const room = await Room.findOne({ roomId }).lean();

        if (!room) {
            return NextResponse.json({ error: "Room not found" }, { status: 404 });
        }

        // Now 'room' is a plain object, and constraints will easily pass through
        return NextResponse.json({
            status: room.status,
            recipes: room.recipes || [],
            winner: room.winner || null,
            constraints: room.constraints || null, // Safely send the constraints
            owner: room.owner
        }, { status: 200 });

    } catch (error: any) {
        console.error("Status API Error:", error);
        return NextResponse.json({ error: "Failed to fetch room status" }, { status: 500 });
    }
}