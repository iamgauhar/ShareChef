import { NextResponse } from "next/server";
import { connectToDatabase } from "@/lib/mongodb";
import Room from "@/models/Room";
import { pusherServer } from "@/lib/pusher";
import { groq } from "@/lib/llama";

export async function POST(req: Request) {
    try {
        const { roomId } = await req.json();
        await connectToDatabase();

        // 1. Fetch current room and check ingredients
        const room = await Room.findOne({ roomId });
        if (!room || !room.ingredients || room.ingredients.length === 0) {
            return NextResponse.json({ error: "No ingredients found" }, { status: 400 });
        }

        const ingredientList = room.ingredients.map((i: any) => i.name).join(", ");

        // 2. Generate 3 Recipes using Llama 3.3
        const prompt = `Act as a Michelin-star chef. Create 3 distinct recipes using: ${ingredientList}.
        You MUST return a JSON object with EXACTLY this structure:
        {
          "recipes": [
            { "title": "Recipe Name", "description": "Short catchy description", "steps": ["step 1", "step 2"], "prepTime": "20 mins" },
            { "title": "Recipe Name", "description": "...", "steps": ["...", "..."], "prepTime": "..." },
            { "title": "Recipe Name", "description": "...", "steps": ["...", "..."], "prepTime": "..." }
          ]
        }`;

        const chatCompletion = await groq.chat.completions.create({
            messages: [{ role: "user", content: prompt }],
            model: "llama-3.3-70b-versatile",
            response_format: { type: "json_object" },
            temperature: 0.8,
        });

        const responseContent = chatCompletion.choices[0]?.message?.content ?? "";
        if (!responseContent) throw new Error("AI returned empty content");

        const parsedData = JSON.parse(responseContent);

        // Ensure we have an array
        const rawRecipes = parsedData.recipes || (Array.isArray(parsedData) ? parsedData : null);

        if (!rawRecipes || !Array.isArray(rawRecipes)) {
            throw new Error("AI response format invalid: Could not find recipes array");
        }

        // 3. Prepare data for MongoDB
        const recipesWithVotes = rawRecipes.map((r: any) => ({
            title: r.title || "Untitled Recipe",
            description: r.description || "",
            steps: Array.isArray(r.steps) ? r.steps : [],
            prepTime: r.prepTime || "20-30 mins",
            votes: 0
        }));

        // 4. DIRECT MONGODB UPDATE (Bypasses Mongoose Schema Caching)
        // This ensures the 'recipes' field is created even if the schema is acting up
        const updateResult = await Room.collection.updateOne(
            { roomId: roomId },
            {
                $set: {
                    recipes: recipesWithVotes,
                    status: "voting",
                    winner: null,
                    updatedAt: new Date()
                }
            }
        );

        if (updateResult.matchedCount === 0) {
            return NextResponse.json({ error: "Room not found in database" }, { status: 404 });
        }

        // 5. Broadcast to all users via Pusher
        await pusherServer.trigger(`room-${roomId}`, "voting-started", {
            recipes: recipesWithVotes
        });

        console.log(`✅ Successfully generated and stored 3 recipes for Room: ${roomId}`);

        return NextResponse.json({ recipes: recipesWithVotes });

    } catch (error: any) {
        console.error("LLAMA GENERATION ERROR:", error.message);
        return NextResponse.json({
            error: "Chef failed to generate options",
            details: error.message
        }, { status: 500 });
    }
}