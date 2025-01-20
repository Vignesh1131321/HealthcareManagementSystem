import { NextResponse } from 'next/server';
import { connect } from '@/dbConfig/dbConfig';
import Room from '@/models/roomModel';

export async function GET(request) {
  try {
    await connect();
    const roomId = request.nextUrl.pathname.split('/').pop();
    console.log(`Fetching room with ID: ${roomId}`); // Debug log
    console.log(`hi hello`); // Debug log
    
    const room = await Room.findOne({ roomId });
    if (!room) {
      return NextResponse.json({ error: 'Room not found' }, { status: 404 });
    }
    return NextResponse.json(room);
  } catch (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}

export async function POST(request) {
  try {
    console.log("POST request received"); // Debug
    await connect();
    const roomId = request.nextUrl.pathname.split('/').pop();
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
    console.error("Error in POST /api/rooms/[roomId]:", error); // Debug log
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}