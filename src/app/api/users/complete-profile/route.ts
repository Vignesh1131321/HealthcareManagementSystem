import { connect } from "@/dbConfig/dbConfig";
import User from "@/models/userModel";
import { NextRequest, NextResponse } from "next/server";

export async function POST(request: NextRequest) {
  try {
    await connect();

    const requestData = await request.json();
    const data: any = {};

    // Map the request data to match the user model structure
    data.firstName = requestData.firstName;
    data.lastName = requestData.lastName;
    data.phoneNumber = requestData.phoneNumber;
    data.gender = requestData.gender;

    // Handle address
    data.address = {
      street: requestData.address.street,
      city: requestData.address.city,
      state: requestData.address.state,
      zipCode: requestData.address.zipCode
    };

    // Handle emergency contact
    data.emergencyContact = {
      name: requestData.emergencyContact.name,
      phoneNumber: requestData.emergencyContact.phoneNumber
    };

    // Handle vital stats
    data.vitalStats = {
      weight: requestData.vitalStats.weight,
      height: requestData.vitalStats.height,
      bloodGroup: requestData.vitalStats.bloodGroup,
      bloodPressure: requestData.vitalStats.bloodPressure
    };

    // Set profile completion flag
    data.isCompleteProfile = true;

    console.log("Updating user with data:", data);

    const username = requestData.username;
    if (!username) {
      return NextResponse.json(
        { success: false, message: "Username is required" },
        { status: 400 }
      );
    }

    const user = await User.findOneAndUpdate(
      { username },
      { ...data },
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