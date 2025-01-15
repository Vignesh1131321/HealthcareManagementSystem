import { NextRequest, NextResponse } from "next/server";
import clientPromise from "../../../lib/db";
import { ObjectId } from "mongodb";

export async function GET(req) {
    console.log("API hit: get-appointments");
    const doctorId = req.headers.get("doctorId");
    const date = req.headers.get("date");
    console.log("Received doctorId:", doctorId);
    console.log("Received date:", date);

    if (!doctorId || !date) {
        return NextResponse.json(
            { error: "Missing required parameters: doctorId or date" },
            { status: 400 }
        );
    }

    try {
        const client = await clientPromise;
        const db = client.db("your-database-name");
        const appointmentsCollection = db.collection("appointments");
        
        const appointments = await appointmentsCollection
            .find({ 
                doctorId: doctorId,
                date: date // Assuming date is stored in same format
            })
            .toArray();

        console.log("Appointments found:", appointments);
        
        return NextResponse.json({ appointments });
    } catch (error) {
        console.error("Error fetching appointments:", error);
        return NextResponse.json(
            { error: "Failed to fetch appointments" },
            { status: 500 }
        );
    }
}