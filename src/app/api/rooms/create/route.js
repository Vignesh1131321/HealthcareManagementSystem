// src/app/api/rooms/create/route.js
import mongoose from "mongoose";
import Room from "@/models/roomModel";

export async function POST(req) {
  try {
    await mongoose.connect(process.env.MONGO_URI);

    const { roomId } = await req.json();
    if (!roomId) {
      return new Response(JSON.stringify({ error: "Room ID is required" }), { status: 400 });
    }

    const newRoom = await Room.create({ roomId });
    return new Response(JSON.stringify({ message: "Room created", room: newRoom }), { status: 201 });
  } catch (error) {
    console.error("Error creating room:", error);
    return new Response(JSON.stringify({ error: "Failed to create room" }), { status: 500 });
  }
}