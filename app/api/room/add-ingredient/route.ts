import { NextResponse } from "next/server";
import { connectToDatabase } from "@/lib/mongodb";
import Room from "@/models/Room";
import { pusherServer } from "@/lib/pusher";

export async function POST(req: Request) {
    try {
        const { roomId, ingredient, addedBy } = await req.json();
        await connectToDatabase();

        const updatedRoom = await Room.findOneAndUpdate(
            { roomId },
            { $push: { ingredients: { name: ingredient, addedBy } } },
            { new: true }
        );

        // Trigger Pusher event
        await pusherServer.trigger(`room-${roomId}`, "ingredient-added", {
            name: ingredient,
            addedBy,
        });

        return NextResponse.json(updatedRoom, { status: 200 });
    } catch (error) {
        return NextResponse.json({ error: "Failed to add ingredient" }, { status: 500 });
    }
}