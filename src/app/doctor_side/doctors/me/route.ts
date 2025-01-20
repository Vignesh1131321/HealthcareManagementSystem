import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { connect } from "@/dbConfig/dbConfig";
import Doctor from "@/models/doctor";

export async function GET() {
  try {
    const session = await getServerSession(authOptions);
    
    if (!session) {
      return NextResponse.json(
        { error: "Not authenticated" },
        { status: 401 }
      );
    }

    await connect();

    const doctor = await Doctor.findOne({ email: session.user.email });

    if (!doctor) {
      return NextResponse.json(
        { error: "Doctor not found" },
        { status: 404 }
      );
    }

    const doctorData = doctor.toObject();
    delete doctorData.password;

    return NextResponse.json({ 
      message: "Doctor found",
      data: doctorData 
    });

  } catch (error: any) {
    return NextResponse.json(
      { error: error.message },
      { status: 500 }
    );
  }
}