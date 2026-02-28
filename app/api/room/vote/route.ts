import { NextResponse } from "next/server";
import { connectToDatabase } from "@/lib/mongodb";
import Room from "@/models/Room";
import { pusherServer } from "@/lib/pusher";

export async function POST(req: Request) {
    try {
        const { roomId, recipeTitle } = await req.json();
        await connectToDatabase();

        // 1. Direct MongoDB Update to ensure it finds the nested recipe title
        const updateResult = await Room.collection.findOneAndUpdate(
            {
                roomId: roomId,
                "recipes.title": recipeTitle
            },
            {
                $inc: { "recipes.$.votes": 1 }
            },
            { returnDocument: 'after' } // Returns the updated document
        );

        // In the MongoDB driver, the document is inside 'value' or it's the object itself
        const updatedRoom = updateResult;

        if (!updatedRoom) {
            console.error("VOTE FAILED: Room or Recipe Title not found", { roomId, recipeTitle });
            return NextResponse.json({ error: "Recipe not found" }, { status: 404 });
        }

        // 2. Broadcast the updated recipes to everyone in the room
        await pusherServer.trigger(`room-${roomId}`, "vote-updated", updatedRoom.recipes);

        console.log(`✅ Vote registered for: ${recipeTitle} in Room: ${roomId}`);
        return NextResponse.json(updatedRoom.recipes);

    } catch (error: any) {
        console.error("VOTE API CRASHED:", error.message);
        return NextResponse.json({
            error: "Server Error",
            details: error.message
        }, { status: 500 });
    }
}