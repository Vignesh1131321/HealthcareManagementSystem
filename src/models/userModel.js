import mongoose from "mongoose";

const userSchema = new mongoose.Schema({
  username:{
    type:String,
    required:[true,"Please enter a username"],
    unique:true,
  },
  email:{
    type:String,
    required:[true,"Please enter an email"],
    unique:true,
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
  age: {
    type: Number,
    required: false,
  },
  gender: {
    type: String,
    required: false,
  },
  profilePhotoUrl: {
    type: String, // GCS public URL for the profile photo
    required: false,
  },
  password:{
    type:String,
    required:[true,"Please enter a password"],
  },
  isVerified:{
    type:Boolean,
    default:false,
  },
  isAdmin:{
    type:Boolean,
    default:false,
  },
  forgotPasswordToken: String,
  forgotPasswordTokenExpiry:Date,
  verifyToken:String,
  verifyTokenExpiry:Date,
  isCompleteProfile:{
    type:Boolean,
    default:false,
  },
})

const User = mongoose.models.users || mongoose.model("users",userSchema);

export default User;