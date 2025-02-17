import { NextResponse } from "next/server";
import { connect } from "@/dbConfig/dbConfig";
import Room from "@/models/roomModel";

export async function GET(req) {
  try {
    await connect();
    
    // Get URL parameters
    const url = new URL(req.url);
    const doctorId = url.searchParams.get("doctorId");
    const userId = url.searchParams.get("userId");
    const roomId = url.pathname.split('/').pop();

    if (!doctorId || !userId) {
      return NextResponse.json(
        { error: "doctorId and userId are required" },
        { status: 400 }
      );
    }

    // Find room with matching IDs
    const room = await Room.findOne({
      roomId,
      doctorId,
      userId,
      isActive: true
    });

    if (!room) {
      return NextResponse.json(
        { error: "Room not found or unauthorized" },
        { status: 404 }
      );
    }

    return NextResponse.json({ 
      message: "Room found",
      roomId: room.roomId 
    });

  } catch (error) {
    console.error("Error fetching room:", error);
    return NextResponse.json(
      { error: "Failed to fetch room" },
      { status: 500 }
    );
  }
}