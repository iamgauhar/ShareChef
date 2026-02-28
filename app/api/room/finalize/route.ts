import { NextResponse } from "next/server";
import { connectToDatabase } from "@/lib/mongodb";
import Room from "@/models/Room";
import { pusherServer } from "@/lib/pusher";

export async function POST(req: Request) {
    try {
        const { roomId } = await req.json();
        await connectToDatabase();

        // 1. Fetch directly from collection to avoid Mongoose schema lag
        const room = await Room.collection.findOne({ roomId: roomId });

        if (!room || !room.recipes || room.recipes.length === 0) {
            console.error("FINALIZE FAILED: Room found but no recipes in DB", { roomId });
            return NextResponse.json({ error: "No recipes found in this room" }, { status: 404 });
        }

        // 2. Sort recipes by votes and pick the top one
        const sortedRecipes = [...room.recipes].sort((a, b) => (b.votes || 0) - (a.votes || 0));
        const winner = sortedRecipes[0];

        // 3. Update room status and save the winner
        await Room.collection.updateOne(
            { roomId: roomId },
            {
                $set: {
                    status: "completed",
                    winner: winner
                }
            }
        );

        // 4. Notify everyone via Pusher
        await pusherServer.trigger(`room-${roomId}`, "recipe-finalized", winner);

        return NextResponse.json({ winner });
    } catch (error: any) {
        console.error("FINALIZE API CRASHED:", error.message);
        return NextResponse.json({ error: "Finalize failed", details: error.message }, { status: 500 });
    }
}