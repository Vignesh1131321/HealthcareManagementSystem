import { NextRequest, NextResponse } from "next/server";
import clientPromise from "../../../lib/db";

export async function GET(req) {

    // Retrieve query parameters
    const { searchParams } = new URL(req.url);
    const doctorId = searchParams.get("doctorId");
    const date = searchParams.get("date");

    if (!doctorId || !date) {
        return NextResponse.json(
            { success: false,error: "Missing required parameters: doctorId or date" },
            { status: 406 }
        );
    }

    try {
        const client = await clientPromise;
        const db = client.db("your-database-name");
        const appointmentsCollection = db.collection("appointments");

        // Query the database
        const appointments = await appointmentsCollection
            .find({ 
                doctorId: doctorId,
                appointmentDate: date // Ensure the format matches your DB storage
            })
            .toArray();

        

        return NextResponse.json({ appointments });
    } catch (error) {
        console.error("Error fetching appointments:", error);
        return NextResponse.json(
            {success: false, error: "Failed to fetch appointments" },
            { status: 500 }
        );
    }
}
