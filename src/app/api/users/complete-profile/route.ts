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
      switch(key) {
        case "age":
          data[key] = parseInt(value as string, 10);
          break;
        case "emergencyContactName":
          if (!data.emergencyContact) data.emergencyContact = {};
          data.emergencyContact.name = value;
          break;
        case "emergencyContactPhone":
          if (!data.emergencyContact) data.emergencyContact = {};
          data.emergencyContact.phoneNumber = value;
          break;
        case "street":
          if (!data.address) data.address = {};
          data.address.street = value;
          break;
        case "city":
          if (!data.address) data.address = {};
          data.address.city = value;
          break;
        case "state":
          if (!data.address) data.address = {};
          data.address.state = value;
          break;
        case "zipCode":
          if (!data.address) data.address = {};
          data.address.zipCode = value;
          break;
        default:
          data[key] = value;
      }
    }

    const username = data.username;
    if (!username) {
      return NextResponse.json(
        { success: false, message: "Username is required" },
        { status: 400 }
      );
    }

    console.log("Updating user with username:", username, "with data:", data);

    const user = await User.findOneAndUpdate(
      { username },
      {
        ...data,
        isCompleteProfile: true,
      },
      { new: true }
    );

    if (!user) {
      console.error("User not found with username:", username);
      return NextResponse.json(
        { success: false, message: "User not found" },
        { status: 404 }
      );
    }

    return NextResponse.json({
      success: true,
      data: user,
    });
  } catch (error: any) {
    console.error("Complete profile error:", error);
    return NextResponse.json(
      { success: false, message: error.message },
      { status: 500 }
    );
  }
}