import mongoose from "mongoose";
import { HealthRecord } from "../../../models/healthRecord"; // Ensure this points to your HealthRecord model
import { NextResponse } from "next/server";

export const GET = async (request) => {
  try {
    await mongoose.connect(process.env.MONGO_URI);

    const userId = request.headers.get("userId");

    if (!userId) {
      return NextResponse.json({ success: false, error: "UserId missing" });
    }

    const healthRecords = await HealthRecord.find({ userId }).select("name data contentType uploadedAt textContent");

    const formattedRecords = healthRecords.map(record => ({
      name: record.name,
      contentType: record.contentType || "application/octet-stream",
      uploadedAt: record.uploadedAt,
      textContent: record.textContent,
      data: record.data.toString("base64"),
    }));

    return NextResponse.json({ success: true, records: formattedRecords });
  } catch (error) {
    console.error("Error in get-health-records API:", error);
    return NextResponse.json({ success: false, error: "Failed to fetch health records" });
  }
};
