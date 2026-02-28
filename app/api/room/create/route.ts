import { NextResponse } from "next/server";
import Room from "@/models/Room";
import { generateRoomId } from "@/lib/utils";
import { connectToDatabase } from "@/lib/mongodb";
// import { getServerSession } from "next-auth"; // Uncomment when NextAuth is set up

export async function POST(req: Request) {
    try {
        // 1. Extract constraints and creatorName along with password/email
        const { password, creatorEmail, creatorName, constraints } = await req.json();

        // 2. Authentication Check (Future Proofing for Version 1.1)
        // const session = await getServerSession(); 
        // if (!session) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

        if (!password) {
            return NextResponse.json({ error: "Password is required" }, { status: 400 });
        }

        console.log("Connecting to DB...");
        await connectToDatabase();

        const roomId = generateRoomId();
        console.log("Creating Secured Room:", roomId);

        // 3. Create room with ALL details, including constraints
        const newRoomData = {
            roomId,
            password,
            owner: creatorEmail,
            creatorName, // Saving this might be helpful later
            constraints: {
                dietary: constraints?.dietary || "None",
                allergies: constraints?.allergies || "None",
                timeLimit: constraints?.timeLimit || "30 mins"
            },
            ingredients: [],
            recipes: [],
            status: "lobby",
            createdAt: new Date(),
        };

        await Room.collection.insertOne(newRoomData);

        return NextResponse.json({ roomId: newRoomData.roomId }, { status: 201 });
    } catch (error: any) {
        console.error("DETAILED CREATION ERROR:", error);
        return NextResponse.json({
            error: "Failed to create secured room",
            details: error.message
        }, { status: 500 });
    }
}