import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { connectToDatabase } from "@/lib/mongodb";
import Room from "@/models/Room";

export async function GET() {
    const session = await getServerSession();
    if (!session?.user?.email) {
        return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    await connectToDatabase();

    // Find rooms where the owner matches the logged-in email
    const rooms = await Room.find({ owner: session.user.email }).sort({ createdAt: -1 });

    return NextResponse.json(rooms);
}