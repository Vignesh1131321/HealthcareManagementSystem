import { NextRequest, NextResponse } from "next/server";
import clientPromise from "@/lib/db";

export async function GET(req: NextRequest) {
  const { searchParams } = new URL(req.url);
  const doctorId = searchParams.get('doctorId');

  if (!doctorId) {
    return NextResponse.json(
      { message: "Doctor ID is required" },
      { status: 400 }
    );
  }

  try {
    const client = await clientPromise;
    const db = client.db("your-database-name");
    const appointmentsCollection = db.collection("appointments");

    const appointments = await appointmentsCollection
      .find({ doctorId })
      .sort({ appointmentDate: -1 })
      .toArray();

    return NextResponse.json({ appointments });
  } catch (error) {
    console.error("Database error:", error);
    return NextResponse.json(
      { message: "Error fetching appointments" },
      { status: 500 }
    );
  }
}

export async function PUT(req: NextRequest) {
  const { userId, doctorId, prescription } = await req.json();
  console.log("HI PUTTING info");
  if (!userId || !doctorId || !prescription) {
    return NextResponse.json(
      { message: "Missing required fields" },
      { status: 400 }
    );
  }

  try {
    const client = await clientPromise;
    const db = client.db("your-database-name");
    const appointmentsCollection = db.collection("appointments");

    const result = await appointmentsCollection.updateOne(
      { userId, doctorId },
      { $set: { prescription } }
    );

    if (result.matchedCount === 0) {
      return NextResponse.json(
        { message: "Appointment not found" },
        { status: 404 }
      );
    }

    return NextResponse.json({ message: "Prescription updated successfully" });
  } catch (error) {
    console.error("Database error:", error);
    return NextResponse.json(
      { message: "Error updating prescription" },
      { status: 500 }
    );
  }
}
