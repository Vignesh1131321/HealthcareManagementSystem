import mongoose from 'mongoose';
import  Prescription  from '../../../models/prescription';
import { NextResponse } from 'next/server';

export const GET = async (request) => {
  try {
    await mongoose.connect(process.env.MONGO_URI);

    const userId = request.headers.get("userId");
    const doctorId = request.headers.get("doctorId");

    // if (!userId || !doctorId) {
    //   return NextResponse.json({ success: false, error: "userId or doctorId missing" });
    // }

    console.log("Fetching prescriptions for user:", userId);
    console.log("Fetching prescriptions for doctor:", doctorId);
    
    const prescriptions = await Prescription.find({ userId, doctorId});

    return NextResponse.json({ success: true, prescriptions });
  } catch (error) {
    console.error(error);
    return NextResponse.json({ success: false, error: "Failed to fetch prescriptions" });
  }
};

export const POST = async (request) => {
  try {
    await mongoose.connect(process.env.MONGO_URI);
    const { prescriptionId, userId, doctorId, medications, notes } = await request.json();

    console.log("Received prescription data:", {
        prescriptionId,
        userId,
        doctorId,
        medications,
        notes
      });

      if (!prescriptionId || !userId || !doctorId || !medications) {
        return NextResponse.json(
          { success: false, error: "Missing required fields" },
          { status: 400 }
        );
      }

    const newPrescription = new Prescription({
      prescriptionId,
      userId,
      doctorId,
      medications,
      notes,
    });

    console.log("Saving prescription:", newPrescription);

    const savedPrescription = await newPrescription.save();
    console.log("Saved prescription:", savedPrescription);

    return NextResponse.json(
      { success: true, prescription: savedPrescription },
      { status: 201 }
    );

    return NextResponse.json({ success: true, message: "Prescription saved successfully" });
  } catch (error) {
    console.error(error);
    return NextResponse.json({ success: false, error: "Failed to save prescription" });
  }
};
