import { NextResponse } from "next/server";
import { connect } from "@/dbConfig/dbConfig";
import Room from "@/models/roomModel";

export async function GET(req) {
  try {
    await connect();
    console.log("Hi in backend");
    // Get URL parameters
    const userId = req.headers.get("userId");
    const doctorId = req.headers.get("doctorId");
    console.log("userId", userId);
    console.log("doctorId", doctorId);
    
    if (!doctorId || !userId) {
      return NextResponse.json(
        { error: "doctorId and userId are required" },
        { status: 400 }
      );
    }

    // Find room with matching IDs
    const room = await Room.findOne({
      doctorId,
      userId,
    //   isActive: true
    });

    if (!room) {
      return NextResponse.json(
        { error: "Room not found or unauthorized" },
        { status: 406 }
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