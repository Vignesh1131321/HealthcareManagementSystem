import { NextResponse } from 'next/server';
import { connect } from '@/dbConfig/dbConfig';
import Room from '@/models/roomModel';

export async function POST(request) {
  try {
    await connect();
    const { roomId, offer } = await request.json();
    console.log(`Creating room with ID: ${roomId}`); // Debug log
    const room = new Room({ roomId, offer });
    await room.save();
    return NextResponse.json({ success: true, room });
  } catch (error) {
    console.error("Error in POST /api/rooms/create:", error); // Debug log
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}