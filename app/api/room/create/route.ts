import { NextResponse } from "next/server";
import Room from "@/models/Room";
import { generateRoomId } from "@/lib/utils";
import { connectToDatabase } from "@/lib/mongodb";
// import { getServerSession } from "next-auth"; // Uncomment when NextAuth is set up

export async function POST(req: Request) {
    try {
        // 1. Get password and creator info from request
        const { password, creatorName } = await req.json();

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

        // 3. Create room with password and owner details
        // We use direct collection update to ensure 'password' field is saved 
        // even if the Mongoose schema is still updating in the background.
        const newRoomData = {
            roomId,
            password, // Guest will use this to join
            owner: creatorName || "Authorized Chef", // Track who created it
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