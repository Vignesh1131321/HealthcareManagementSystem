import mongoose from 'mongoose';

const userSchema = new mongoose.Schema({
  username: {
    type: String,
    required: [true, "Please provide a username"],
    unique: true,
  },
  email: {
    type: String,
    required: [true, "Please provide an email"],
    unique: true,
  },
  firstName: {
    type: String,
    required: false,
  },
  lastName: {
    type: String,
    required: false,
  },
  phoneNumber: {
    type: String,
    required: false,
  },
  emergencyContact: {
    name: {
      type: String,
      required: false,
    },
    phoneNumber: {
      type: String,
      required: false,
    },
  },
  address: {
    street: {
      type: String,
      required: false,
    },
    city: {
      type: String,
      required: false,
    },
    state: {
      type: String,
      required: false,
    },
    zipCode: {
      type: String,
      required: false,
    },
  },
  gender: {
    type: String,
    enum: ['male', 'female', 'other'],
    required: false,
  },
  vitalStats: {
    weight: {
      type: String,
      required: false,
    },
    height: {
      type: String,
      required: false,
    },
    bloodGroup: {
      type: String,
      enum: ['A+', 'A-', 'B+', 'B-', 'O+', 'O-', 'AB+', 'AB-'],
      required: false,
    },
    bloodPressure: {
      type: String,
      required: false,
    },
  },
  profilePhotoUrl: {
    type: String,
    required: false,
  },
  password: {
    type: String,
    required: [true, "Please provide a password"],
  },
  isVerified: {
    type: Boolean,
    default: false,
  },
  isCompleteProfile: {
    type: Boolean,
    default: false,
  },
  forgotPasswordToken: String,
  forgotPasswordTokenExpiry: Date,
  verifyToken: String,
  verifyTokenExpiry: Date,
});

const User = mongoose.models.User || mongoose.model("User", userSchema);
export default User;