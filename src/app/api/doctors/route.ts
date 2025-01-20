// import { connect } from "@/dbConfig/dbConfig";
// import Doctor from "@/models/doctor";
// import bcrypt from "bcryptjs";
// import { NextResponse } from "next/server";

// export async function POST(req: Request) {
//   try {
//     const {
//       username,
//       email,
//       password,
//       name,
//       phoneNumber,
//       licenseNumber,
//       specialty,
//       clinicName,
//       placeId,
//       location
//     } = await req.json();

//     await connect();

//     // Check if doctor already exists
//     const existingDoctor = await Doctor.findOne({
//       $or: [
//         { email },
//         { licenseNumber },
//         { placeId }
//       ]
//     });

//     if (existingDoctor) {
//       return NextResponse.json(
//         { error: "Doctor already registered with this email, license number, or location" },
//         { status: 400 }
//       );
//     }

//     // Hash the password
//     const hashedPassword = await bcrypt.hash(password, 10);

//     // Save the doctor to the database
//     const newDoctor = new Doctor({
//       username,
//       email,
//       password: hashedPassword,
//       name,
//       phoneNumber,
//       licenseNumber,
//       specialty,
//       clinicName,
//       placeId,
//       location
//     });

//     await newDoctor.save();

//     return NextResponse.json({
//       message: "Doctor registered successfully",
//       doctor: {
//         id: newDoctor._id,
//         name: newDoctor.name,
//         email: newDoctor.email
//       }
//     });

//   } catch (error) {
//     console.error("Doctor signup error:", error);
//     return NextResponse.json(
//       { error: "Something went wrong during registration" },
//       { status: 500 }
//     );
//   }
// }

import { connect } from "@/dbConfig/dbConfig";
import Doctor from "@/models/doctor";
import bcrypt from "bcryptjs";
import { NextResponse } from "next/server";

// Type definition for doctor registration data
interface DoctorRegistrationData {
  username: string;
  email: string;
  password: string;
  name: string;
  phoneNumber: string;
  licenseNumber: string;
  specialty: string;
  clinicName: string;
  placeId: string;
  location: {
    type: string;
    coordinates: [number, number];
  };
}

// Validation function
function validateDoctorData(data: Partial<DoctorRegistrationData>): string | null {
  if (!data.email?.match(/^[^\s@]+@[^\s@]+\.[^\s@]+$/)) {
    return "Invalid email format";
  }
  
  if (!data.password || data.password.length < 6) {
    return "Password must be at least 6 characters long";
  }
  
  if (!data.licenseNumber) {
    return "License number is required";
  }
  
  if (!data.phoneNumber?.match(/^\+?[\d\s-]{10,}$/)) {
    return "Invalid phone number format";
  }
  
  return null;
}

export async function POST(req: Request) {
  try {
    const data = await req.json();
    
    // Validate the input data
    const validationError = validateDoctorData(data);
    if (validationError) {
      return NextResponse.json(
        { error: validationError },
        { status: 400 }
      );
    }

    await connect();

    // Check if doctor already exists
    const existingDoctor = await Doctor.findOne({
      $or: [
        { email: data.email },
        { licenseNumber: data.licenseNumber },
        { placeId: data.placeId }
      ]
    });

    if (existingDoctor) {
      const field = 
        existingDoctor.email === data.email ? "email" :
        existingDoctor.licenseNumber === data.licenseNumber ? "license number" :
        "location";
      
      return NextResponse.json(
        { error: `A doctor is already registered with this ${field}` },
        { status: 400 }
      );
    }

    // Hash the password
    const hashedPassword = await bcrypt.hash(data.password, 10);

    // Prepare doctor data with proper location format
    const doctorData = {
      ...data,
      password: hashedPassword,
      location: {
        type: "Point",
        coordinates: data.location.coordinates || [0, 0]
      }
    };

    // Create and save the new doctor
    const newDoctor = new Doctor(doctorData);
    await newDoctor.save();

    // Return success response without sensitive information
    return NextResponse.json({
      message: "Doctor registered successfully",
      doctor: {
        id: newDoctor._id,
        name: newDoctor.name,
        email: newDoctor.email,
        specialty: newDoctor.specialty,
        clinicName: newDoctor.clinicName
      }
    });

  } catch (error) {
    console.error("Doctor signup error:", error);
    
    // Handle mongoose validation errors
    if (error.name === 'ValidationError') {
      const validationErrors = Object.values(error.errors).map((err: any) => err.message);
      return NextResponse.json(
        { error: "Validation failed", details: validationErrors },
        { status: 400 }
      );
    }
    
    return NextResponse.json(
      { error: "Something went wrong during registration" },
      { status: 500 }
    );
  }
}