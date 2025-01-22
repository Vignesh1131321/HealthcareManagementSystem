import { NextResponse } from "next/server";
import { connect } from "@/dbConfig/dbConfig";
import Room from "@/models/roomModel";

export async function GET(req) {
  try {
    await connect();
    console.log("Hi in backend");
    
    const userId = req.headers.get("userId");
    const doctorId = req.headers.get("doctorId");
    console.log("userId", userId);
    console.log("doctorId", doctorId);
    
    if (!doctorId || !userId) {
      return NextResponse.json(
        { error: "Doctor ID and User ID are required" },
        { status: 400 }
      );
    }

    // Find active room with matching IDs
    const room = await Room.findOne({
      doctorId,
      userId,
      isActive: true  // Assuming you want to check for active rooms only
    });

    if (!room) {
      return NextResponse.json(
        { 
          error: "No scheduled meeting found",
          message: "Please schedule a meeting with the doctor first"
        },
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