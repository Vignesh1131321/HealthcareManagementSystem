import mongoose from "mongoose";
import { HealthRecord } from "../../../models/healthRecord";
import { NextResponse } from "next/server";

export const POST = async (request) => {
  try {
    // Connect to the MongoDB database
    await mongoose.connect(process.env.MONGO_URI);

    // Parse form data from the request
    const data = await request.formData();
    const file = data.get("file");
    const userId = data.get("userId");

    // Validate input data
    if (!file || !userId) {
      return NextResponse.json({
        success: false,
        message: "File or userId missing",
      });
    }

    // Convert file to buffer for storage
    const bufferData = await file.arrayBuffer();
    const buffer = Buffer.from(bufferData);

    // Create a new health record
    const newHealthRecord = new HealthRecord({
      name: file.name,
      data: buffer,
      contentType: file.type,
      userId,
      uploadedAt: new Date(), // Ensure uploadedAt is explicitly added
    });

    // Save the record to the database
    await newHealthRecord.save();

    // Return success response
    return NextResponse.json({
      success: true,
      message: "Successfully uploaded health record",
      record: {
        name: newHealthRecord.name,
        uploadedAt: newHealthRecord.uploadedAt,
      },
    });
  } catch (error) {
    // Handle duplicate key error
    if (error.code === 11000) {
      console.error("Duplicate health record error:", error);
      return NextResponse.json({
        success: false,
        message: "A health record with the same name already exists for this user.",
      });
    }

    // Handle other errors
    console.error("Error uploading health record:", error);
    return NextResponse.json({
      success: false,
      message: "Upload failed due to a server error.",
    });
  }
};
