import { NextResponse } from "next/server";
import { connectToDatabase } from "@/lib/mongodb";
import Room from "@/models/Room";
// import { pusherServer } from "@/lib/pusher-server";
import { pusherServer } from "@/lib/pusher";

export async function POST(req: Request) {
    try {
        const { roomId, recipeIndex, voterId } = await req.json();

        if (!voterId) {
            return NextResponse.json({ error: "Voter ID required" }, { status: 400 });
        }

        await connectToDatabase();
        const room = await Room.findOne({ roomId });

        if (!room) return NextResponse.json({ error: "Room not found" }, { status: 404 });

        // 1. Map through recipes to clear any previous votes from this user
        const updatedRecipes = room.recipes.map((recipe: any) => {
            // Ensure votes is an array
            const currentVotes = Array.isArray(recipe.votes) ? recipe.votes : [];

            // Remove the voterId from ALL recipes to reset their state
            const filteredVotes = currentVotes.filter((id: string) => id !== voterId);

            return { ...recipe, votes: filteredVotes };
        });

        // 2. Add the user's vote to the newly selected recipe
        updatedRecipes[recipeIndex].votes.push(voterId);

        // 3. Save the exact updated array to MongoDB
        await Room.updateOne(
            { roomId },
            { $set: { recipes: updatedRecipes } }
        );

        // 4. Trigger Pusher so everyone sees the updated vote counts live
        await pusherServer.trigger(`room-${roomId}`, "vote-updated", updatedRecipes);

        return NextResponse.json({ success: true, recipes: updatedRecipes });
    } catch (error) {
        console.error("Voting API Error:", error);
        return NextResponse.json({ error: "Failed to cast vote" }, { status: 500 });
    }
}