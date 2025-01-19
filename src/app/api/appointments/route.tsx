import { NextRequest, NextResponse } from "next/server";
import clientPromise from "../../../lib/db";
import { ObjectId } from "mongodb";

export async function GET(req:any) {
    const doctorId = req.headers.get("doctorId");

    if (!doctorId) {
        return NextResponse.json(
            { error: "Missing required parameter: doctorId" },
            { status: 400 }
        );
    }

    try {
        const client = await clientPromise;
        const db = client.db("healthcare_db");
        const appointmentsCollection = db.collection("appointments");
        
        const appointments = await appointmentsCollection
            .find({ doctorId: doctorId })
            .toArray();

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

export async function POST(req:any) {
    try {
        const body = await req.json();
        const { patientId, doctorId, date, time, location, notes } = body;

        if (!patientId || !doctorId || !date || !time) {
            return NextResponse.json(
                { error: "Missing required fields" },
                { status: 400 }
            );
        }

        const client = await clientPromise;
        const db = client.db("healthcare_db");
        const appointmentsCollection = db.collection("appointments");

        const newAppointment = {
            patientId,
            doctorId,
            date: new Date(date),
            time,
            location,
            notes,
            status: "pending",
            createdAt: new Date(),
            updatedAt: new Date()
        };

        const result = await appointmentsCollection.insertOne(newAppointment);

        return NextResponse.json(
            { 
                success: true, 
                appointment: { ...newAppointment, _id: result.insertedId } 
            },
            { status: 201 }
        );
    } catch (error) {
        console.error("Database error:", error);
        return NextResponse.json(
            { error: "Internal server error" },
            { status: 500 }
        );
    }
}

export async function PUT(req:any) {
    try {
        const { searchParams } = new URL(req.url);
        const appointmentId = searchParams.get('id');
        
        if (!appointmentId) {
            return NextResponse.json(
                { error: "Appointment ID is required" },
                { status: 400 }
            );
        }

        const body = await req.json();
        const { status, date, time, location, notes } = body;

        const client = await clientPromise;
        const db = client.db("healthcare_db");
        const appointmentsCollection = db.collection("appointments");

        const updateData = {
            ...(status && { status }),
            ...(date && { date: new Date(date) }),
            ...(time && { time }),
            ...(location && { location }),
            ...(notes && { notes }),
            updatedAt: new Date()
        };

        const result = await appointmentsCollection.findOneAndUpdate(
            { _id: new ObjectId(appointmentId) },
            { $set: updateData },
            { returnDocument: 'after' }
        );

        if (!result) {
            return NextResponse.json(
                { error: "Appointment not found" },
                { status: 404 }
            );
        }

        return NextResponse.json(
            { success: true, appointment: result },
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

export async function DELETE(req:any) {
    try {
        const { searchParams } = new URL(req.url);
        const appointmentId = searchParams.get('id');

        if (!appointmentId) {
            return NextResponse.json(
                { error: "Appointment ID is required" },
                { status: 400 }
            );
        }

        const client = await clientPromise;
        const db = client.db("healthcare_db");
        const appointmentsCollection = db.collection("appointments");

        const result = await appointmentsCollection.deleteOne({
            _id: new ObjectId(appointmentId)
        });

        if (result.deletedCount === 0) {
            return NextResponse.json(
                { error: "Appointment not found" },
                { status: 404 }
            );
        }

        return NextResponse.json(
            { success: true, message: "Appointment deleted successfully" },
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