import mongoose from "mongoose";
import { HealthRecord } from "../../../models/healthRecord";
import { NextResponse } from "next/server";
import pdfParse from "pdf-parse";

// Make sure this file is named route.js and is in the correct directory:
// app/api/upload-health-record/route.js

async function extractTextFromPDF(buffer) {
  try {
    const data = await pdfParse(buffer);
    return data.text.trim();
  } catch (error) {
    console.error("Error extracting text from PDF:", error);
    return '';
  }
}

export async function POST(request) {
  try {
    await mongoose.connect(process.env.MONGO_URI);

    const data = await request.formData();
    const file = data.get("file");
    const userId = data.get("userId");

    if (!file || !userId) {
      return NextResponse.json({
        success: false,
        message: "File or userId missing",
      }, { status: 400 });
    }

    const bufferData = await file.arrayBuffer();
    const buffer = Buffer.from(bufferData);

    let textContent = '';
    if (file.type === 'application/pdf') {
      console.log('Attempting to extract text from PDF...');
      textContent = await extractTextFromPDF(buffer);
      console.log('Extracted text length:', textContent.length);
    }

    const latestRecord = await HealthRecord.findOne({ userId, name: file.name }).sort({ version: -1 });
    const version = latestRecord ? latestRecord.version + 1 : 1;

    const newHealthRecord = new HealthRecord({
      name: file.name,
      data: buffer,
      contentType: file.type,
      userId,
      uploadedAt: new Date(),
      textContent,
      version,
    });

    await newHealthRecord.save();

    return NextResponse.json({
      success: true,
      message: "Successfully uploaded health record",
      record: {
        name: newHealthRecord.name,
        uploadedAt: newHealthRecord.uploadedAt,
        version: newHealthRecord.version,
        hasText: !!textContent,
        textLength: textContent.length,
      }
    }, { status: 200 });
  } catch (error) {
    console.error("Error uploading health record:", error);
    return NextResponse.json({
      success: false,
      message: "Upload failed due to a server error.",
    }, { status: 500 });
  }
}