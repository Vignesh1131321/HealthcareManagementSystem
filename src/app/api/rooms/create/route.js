import { NextResponse } from "next/server";
import { connect } from "@/dbConfig/dbConfig";
import Room from "@/models/roomModel";
import mongoose from 'mongoose';

export async function POST(req) {
  try {
    await mongoose.connect(process.env.MONGO_URI);
    
    // Get data from request headers
    const { roomId, userId, doctorId } = await req.json();

    console.log("userId ", userId);
    console.log("doctorId ", doctorId);
    console.log("roomId ", roomId);
    // Validate required fields
    if (!roomId || !userId || !doctorId) {
      return NextResponse.json({ 
        error: "Room ID, User ID and Doctor ID are required" 
      }, { status: 400 });
    }

    // Create new room
    const newRoom = await Room.create({
      roomId,
      userId,
      doctorId,
      isActive: true
    });

    return NextResponse.json({
      message: "Room created successfully",
      room: newRoom
    }, { status: 201 });

  } catch (error) {
    console.error("Error creating room:", error);
    return NextResponse.json({ 
      error: "Failed to create room" 
    }, { status: 500 });
  }
}