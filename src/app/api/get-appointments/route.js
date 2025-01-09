import { NextRequest, NextResponse } from "next/server";
import clientPromise from "../../../lib/db";
import { ObjectId } from "mongodb";

export async function GET(req) {
    console.log("API hit: get-appointments");
    const userId = req.headers.get("userId");
    console.log("Received userId:", userId);

    if (!userId) {
        return NextResponse.json(
            { error: "Missing required parameter: userId" },
            { status: 400 }
        );
    }

    try {
        const client = await clientPromise;
        const db = client.db("your-database-name");
        const appointmentsCollection = db.collection("appointments");
        const appointments = await appointmentsCollection
            .find({ userId: userId }) // Use userId as a string if stored that way
            .toArray();

        console.log("Appointments found:", appointments);
        // if (!appointments || appointments.length === 0) {
        //     return NextResponse.json(
        //         { message: "No appointments found for the given user." },
        //         { status: 404 }
        //     );
        // }
        return NextResponse.json(
            { success: true, appointments },
            { status: 200 }
        );
    } catch (error) {
        console.error("Database error:", error);
        return NextResponse.json(
            { error: "Internal server error" },
            { status: 500 }
        );
    }
}
