
// import { connect } from "@/dbConfig/dbConfig";
// import Doctor from "@/models/doctor";
// import bcrypt from "bcryptjs";
// import { NextResponse } from "next/server";

// // Type definition for doctor registration data
// interface DoctorRegistrationData {
//   username: string;
//   email: string;
//   password: string;
//   name: string;
//   phoneNumber: string;
//   licenseNumber: string;
//   specialty: string;
//   clinicName: string;
//   placeId: string;
//   location: {
//     type: string;
//     coordinates: [number, number];
//   };
// }

// // Validation function
// function validateDoctorData(data: Partial<DoctorRegistrationData>): string | null {
//   if (!data.email?.match(/^[^\s@]+@[^\s@]+\.[^\s@]+$/)) {
//     return "Invalid email format";
//   }
  
//   if (!data.password || data.password.length < 6) {
//     return "Password must be at least 6 characters long";
//   }
  
//   if (!data.licenseNumber) {
//     return "License number is required";
//   }
  
//   if (!data.phoneNumber?.match(/^\+?[\d\s-]{10,}$/)) {
//     return "Invalid phone number format";
//   }
  
//   return null;
// }

// export async function POST(req: Request) {
//   try {
//     const data = await req.json();
    
//     // Validate the input data
//     const validationError = validateDoctorData(data);
//     if (validationError) {
//       return NextResponse.json(
//         { error: validationError },
//         { status: 400 }
//       );
//     }

//     await connect();

//     // Check if doctor already exists - removed placeId check
//     const existingDoctor = await Doctor.findOne({
//       $or: [
//         { email: data.email },
//         { licenseNumber: data.licenseNumber }
//       ]
//     });

//     if (existingDoctor) {
//       const field = 
//         existingDoctor.email === data.email ? "email" :
//         "license number";  // Simplified since we only check email and license
      
//       return NextResponse.json(
//         { error: `A doctor is already registered with this ${field}` },
//         { status: 400 }
//       );
//     }

//     // Rest of the code remains the same
//     const hashedPassword = await bcrypt.hash(data.password, 10);

//     const doctorData = {
//       ...data,
//       password: hashedPassword,
//       location: {
//         type: "Point",
//         coordinates: data.location.coordinates || [0, 0]
//       }
//     };

//     const newDoctor = new Doctor(doctorData);
//     await newDoctor.save();

//     return NextResponse.json({
//       message: "Doctor registered successfully",
//       doctor: {
//         id: newDoctor._id,
//         name: newDoctor.name,
//         email: newDoctor.email,
//         specialty: newDoctor.specialty,
//         clinicName: newDoctor.clinicName
//       }
//     });

//   } catch (error) {
//     console.error("Doctor signup error:", error);
    
//     if (error.name === 'ValidationError') {
//       const validationErrors = Object.values(error.errors).map((err: any) => err.message);
//       return NextResponse.json(
//         { error: "Validation failed", details: validationErrors },
//         { status: 400 }
//       );
//     }
    
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
import nodemailer from "nodemailer";

// Extended interface to include verification status
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

// Create a temporary storage for OTPs (in production, use Redis or similar)
const otpStorage = new Map<string, { otp: string; timestamp: number; doctorData: any }>();

// Function to generate OTP
function generateOTP(): string {
  return Math.floor(100000 + Math.random() * 900000).toString();
}

// Configure nodemailer
const transporter = nodemailer.createTransport({
  // Replace with your email service configuration
  service: 'gmail',
  auth: {
    user: process.env.EMAIL_USER,
    pass: process.env.EMAIL_PASSWORD
  }
});

// Function to send OTP email
async function sendVerificationEmail(email: string, otp: string) {
  const mailOptions = {
    from: process.env.EMAIL_USER,
    to: email,
    subject: 'Email Verification for Doctor Registration',
    html: `
      <h1>Email Verification</h1>
      <p>Your verification code is: <strong>${otp}</strong></p>
      <p>This code will expire in 10 minutes.</p>
      <p>If you didn't request this verification, please ignore this email.</p>
    `
  };

  await transporter.sendMail(mailOptions);
}

// Initial registration endpoint
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
        { licenseNumber: data.licenseNumber }
      ]
    });

    if (existingDoctor) {
      const field = existingDoctor.email === data.email ? "email" : "license number";
      return NextResponse.json(
        { error: `A doctor is already registered with this ${field}` },
        { status: 400 }
      );
    }

    // Generate and store OTP
    const otp = generateOTP();
    const hashedPassword = await bcrypt.hash(data.password, 10);
    
    const doctorData = {
      ...data,
      password: hashedPassword,
      location: {
        type: "Point",
        coordinates: data.location.coordinates || [0, 0]
      },
      isVerified: false
    };

    // Store OTP with expiration (10 minutes)
    otpStorage.set(data.email, {
      otp,
      timestamp: Date.now(),
      doctorData
    });

    // Send verification email
    await sendVerificationEmail(data.email, otp);

    return NextResponse.json({
      message: "Verification code sent to your email",
      email: data.email
    });

  } catch (error) {
    console.error("Doctor registration error:", error);
    return NextResponse.json(
      { error: "Something went wrong during registration" },
      { status: 500 }
    );
  }
}

// OTP verification endpoint
export async function PUT(req: Request) {
  try {
    const { email, otp } = await req.json();

    const storedData = otpStorage.get(email);
    
    if (!storedData) {
      return NextResponse.json(
        { error: "No pending verification found" },
        { status: 400 }
      );
    }

    // Check if OTP has expired (10 minutes)
    if (Date.now() - storedData.timestamp > 10 * 60 * 1000) {
      otpStorage.delete(email);
      return NextResponse.json(
        { error: "Verification code has expired" },
        { status: 400 }
      );
    }

    // Verify OTP
    if (storedData.otp !== otp) {
      return NextResponse.json(
        { error: "Invalid verification code" },
        { status: 400 }
      );
    }

    // Save verified doctor to database
    const newDoctor = new Doctor({
      ...storedData.doctorData,
      isVerified: true
    });
    await newDoctor.save();

    // Clear OTP storage
    otpStorage.delete(email);

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
    console.error("OTP verification error:", error);
    return NextResponse.json(
      { error: "Something went wrong during verification" },
      { status: 500 }
    );
  }
}

// Resend OTP endpoint
export async function PATCH(req: Request) {
  try {
    const { email } = await req.json();

    const storedData = otpStorage.get(email);
    if (!storedData) {
      return NextResponse.json(
        { error: "No pending registration found" },
        { status: 400 }
      );
    }

    // Generate new OTP
    const newOTP = generateOTP();
    
    // Update storage with new OTP
    otpStorage.set(email, {
      ...storedData,
      otp: newOTP,
      timestamp: Date.now()
    });

    // Send new verification email
    await sendVerificationEmail(email, newOTP);

    return NextResponse.json({
      message: "New verification code sent to your email",
      email
    });

  } catch (error) {
    console.error("Resend OTP error:", error);
    return NextResponse.json(
      { error: "Something went wrong while resending verification code" },
      { status: 500 }
    );
  }
}