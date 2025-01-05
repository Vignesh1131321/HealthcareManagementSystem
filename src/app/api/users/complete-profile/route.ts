import { connect } from "@/dbConfig/dbConfig";
import User from "@/models/userModel";
import { NextRequest, NextResponse } from "next/server";

export async function POST(request: NextRequest) {
  try {
    await connect();
    
    const formData = await request.formData();
    const data: any = {};
    
    // Parse form data
    for (const [key, value] of formData.entries()) {
      try {
        data[key] = JSON.parse(value as string);
      } catch {
        data[key] = value;
      }
    }

    const userId = data._id;
    delete data._id; // Remove _id from update data

    const user = await User.findByIdAndUpdate(
      userId,
      {
        ...data,
        isCompleteProfile: true
      },
      { new: true }
    );

    if (!user) {
      return NextResponse.json(
        { success: false, message: "User not found" },
        { status: 404 }
      );
    }

    return NextResponse.json({ 
      success: true, 
      data: user 
    });

  } catch (error: any) {
    console.error("Complete profile error:", error);
    return NextResponse.json(
      { success: false, message: error.message },
      { status: 500 }
    );
  }
}