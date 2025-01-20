import { NextResponse } from 'next/server';
import { connect } from '@/dbConfig/dbConfig';
import Room from '@/models/roomModel';

export async function POST(request) {
  try {
    await connect();
    console.log("POST request received"); // Debug
    const roomId = request.nextUrl.pathname.split('/').slice(-2, -1)[0];
    console.log(`Received request to update room with ID: ${roomId}`); // Debug log
    const { answer } = await request.json();
    console.log(`Updating room with ID: ${roomId} with answer: ${JSON.stringify(answer)}`); // Debug log

    if (!answer) {
      return NextResponse.json({ error: 'Answer data is required' }, { status: 400 });
    }

    const room = await Room.findOneAndUpdate(
      { roomId },
      { $set: { answer } },
      { new: true }
    );

    if (!room) {
      return NextResponse.json({ error: 'Room not found' }, { status: 404 });
    }

    return NextResponse.json({ success: true, room });
  } catch (error) {
    console.error("Error in POST /api/rooms/[roomId]/answer:", error); // Debug log
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}