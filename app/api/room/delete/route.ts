import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { connectToDatabase } from "@/lib/mongodb";
import Room from "@/models/Room";

export async function DELETE(req: Request) {
  try {
    const session = await getServerSession();

    if (!session?.user?.email) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { roomId } = (await req.json()) as { roomId?: string };

    if (!roomId) {
      return NextResponse.json({ error: "Missing roomId" }, { status: 400 });
    }

    await connectToDatabase();

    const deletedRoom = await Room.findOneAndDelete({
      roomId,
      owner: session.user.email,
    });

    if (!deletedRoom) {
      return NextResponse.json(
        { error: "Room not found or you do not have permission to delete it" },
        { status: 404 }
      );
    }

    return NextResponse.json(
      { success: true, roomId: deletedRoom.roomId },
      { status: 200 }
    );
  } catch (error) {
    console.error("Delete Room API Error:", error);
    return NextResponse.json(
      { error: "Failed to delete room" },
      { status: 500 }
    );
  }
}
