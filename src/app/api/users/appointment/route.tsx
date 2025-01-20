import { NextRequest, NextResponse } from "next/server";
import clientPromise from "../../../../lib/db";
import axios from "axios";

// Replace this with your actual Google Places API Key
const GOOGLE_PLACES_API_KEY = "AIzaSyCToBERY0q2_g0TDBXe5IXCRoFp8cdB2Y4";

// Handler for POST requests
export async function POST(req: NextRequest) {
    const body = await req.json();
    const { userId, identity, doctorId, doctorName, specialty, date, time } = body;

    if (!doctorId || !doctorName || !date || !time) {
        return NextResponse.json(
            { message: "Missing required fields." },
            { status: 400 }
        );
    }

    try {
        const client = await clientPromise;
        const db = client.db("appointments"); // Replace with your database name
        const appointmentsCollection = db.collection("appointments");

        await appointmentsCollection.insertOne({
            userId,
            identity,
            doctorId,
            doctorName,
            specialty,
            appointmentDate: date,
            appointmentTime: time,
            createdAt: new Date(),
        });

        return NextResponse.json(
            { message: "Appointment successfully booked." },
            { status: 201 }
        );
    } catch (error) {
        console.error("Database error:", error);
        return NextResponse.json(
            { message: "Error saving appointment." },
            { status: 500 }
        );
    }
}

// Handler for GET requests
export async function GET(req: NextRequest) {
    const { searchParams } = new URL(req.url);
    const placeId = searchParams.get('placeId');

    if (!placeId) {
        return NextResponse.json(
            { error: "Invalid or missing placeId parameter." },
            { status: 400 }
        );
    }

    try {
        const response = await axios.get(
            `https://maps.googleapis.com/maps/api/place/details/json`,
            {
                params: {
                    place_id: placeId,
                    key: GOOGLE_PLACES_API_KEY,
                    fields: "reviews",
                },
            }
        );

        if (response.data && response.data.result) {
            const reviews = response.data.result.reviews || [];
            return NextResponse.json({ reviews });
        } else {
            return NextResponse.json(
                { error: "No reviews found for this place." },
                { status: 404 }
            );
        }
    } catch (error) {
        console.error("Error fetching Google reviews:", error);
        return NextResponse.json(
            { error: "Internal server error." },
            { status: 500 }
        );
    }
}