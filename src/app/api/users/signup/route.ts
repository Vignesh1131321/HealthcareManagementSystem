// import {connect} from "@/dbConfig/dbConfig";
// import User from "@/models/userModel";
// import bcrypt from "bcryptjs";
// import { NextResponse } from "next/server";

// export async function POST(req: Request) {
//   try {
//     const { username, email, password } = await req.json();
//     await connect();

//     // Check if the user already exists
//     const existingUser = await User.findOne({ email });
//     if (existingUser) {
//       return NextResponse.json({ error: "User already exists" }, { status: 400 });
//     }

//     // Hash the password
//     const hashedPassword = await bcrypt.hash(password, 10);

//     // Save the user to the database
//     const newUser = new User({ username, email, password: hashedPassword });
//     await newUser.save();

//     return NextResponse.json({ message: "User registered successfully" });
//   } catch (error) {
//     console.error("Signup error:", error);
//     return NextResponse.json({ error: "Something went wrong" }, { status: 500 });
//   }
// }



import { connect } from "@/dbConfig/dbConfig";
import User from "@/models/userModel";
import bcrypt from "bcryptjs";
import { NextResponse } from "next/server";
import nodemailer from "nodemailer";

// Interface for user registration data
interface UserRegistrationData {
  username: string;
  email: string;
  password: string;
}

// Validation function
function validateUserData(data: Partial<UserRegistrationData>): string | null {
  if (!data.email?.match(/^[^\s@]+@[^\s@]+\.[^\s@]+$/)) {
    return "Invalid email format";
  }
  
  if (!data.password || data.password.length < 6) {
    return "Password must be at least 6 characters long";
  }
  
  if (!data.username) {
    return "Username is required";
  }
  
  return null;
}

// Temporary storage for OTPs (use Redis in production)
const otpStorage = new Map<string, { otp: string; timestamp: number; userData: any }>();

// Generate OTP
function generateOTP(): string {
  return Math.floor(100000 + Math.random() * 900000).toString();
}

// Configure nodemailer
const transporter = nodemailer.createTransport({
  service: 'gmail',
  auth: {
    user: process.env.EMAIL_USER,
    pass: process.env.EMAIL_PASSWORD
  }
});

// Send verification email
async function sendVerificationEmail(email: string, otp: string) {
  const mailOptions = {
    from: process.env.EMAIL_USER,
    to: email,
    subject: 'Email Verification for Registration',
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
    
    // Validate input data
    const validationError = validateUserData(data);
    if (validationError) {
      return NextResponse.json(
        { error: validationError },
        { status: 400 }
      );
    }

    await connect();

    // Check if user exists
    const existingUser = await User.findOne({ email: data.email });
    if (existingUser) {
      return NextResponse.json(
        { error: "User already exists with this email" },
        { status: 400 }
      );
    }

    // Generate and store OTP
    const otp = generateOTP();
    const hashedPassword = await bcrypt.hash(data.password, 10);
    
    const userData = {
      ...data,
      password: hashedPassword,
      isVerified: false
    };

    // Store OTP with expiration (10 minutes)
    otpStorage.set(data.email, {
      otp,
      timestamp: Date.now(),
      userData
    });

    // Send verification email
    await sendVerificationEmail(data.email, otp);

    return NextResponse.json({
      message: "Verification code sent to your email",
      email: data.email
    });

  } catch (error) {
    console.error("User registration error:", error);
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

    // Check OTP expiration (10 minutes)
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

    // Save verified user to database
    const newUser = new User({
      ...storedData.userData,
      isVerified: true
    });
    await newUser.save();

    // Clear OTP storage
    otpStorage.delete(email);

    return NextResponse.json({
      message: "User registered successfully",
      user: {
        id: newUser._id,
        username: newUser.username,
        email: newUser.email
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