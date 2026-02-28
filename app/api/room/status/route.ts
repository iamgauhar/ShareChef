import { NextResponse } from "next/server";
import { connectToDatabase } from "@/lib/mongodb";
import Room from "@/models/Room";

export async function GET(req: Request) {
    const { searchParams } = new URL(req.url);
    const roomId = searchParams.get("roomId");
    await connectToDatabase();

    const room = await Room.collection.findOne({ roomId });
    if (!room) return NextResponse.json({ error: "Not found" }, { status: 404 });

    return NextResponse.json({
        status: room.status,
        recipes: room.recipes,
        winner: room.winner
    });
}