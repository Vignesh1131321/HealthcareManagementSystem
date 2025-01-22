import mongoose from 'mongoose';

const doctorSchema = new mongoose.Schema({
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
  password: {
    type: String,
    required: [true, "Please provide a password"],
  },
  name: {
    type: String,
    required: [true, "Please provide your full name"],
  },
  phoneNumber: {
    type: String,
    required: [true, "Please provide a phone number"],
  },
  licenseNumber: {
    type: String,
    required: [true, "Please provide a license number"],
    unique: true,
  },
  specialty: {
    type: String,
    required: [true, "Please provide your specialty"],
  },
  clinicName: {
    type: String,
    required: [true, "Please provide your clinic name"],
  },
  placeId: {
    type: String,
    required: [true, "Place ID is required"],
    
  },
  location: {
    address: String,
    city: String,
    state: String,
    country: String,
    coordinates: {
      lat: Number,
      lng: Number,
    }
  },
  isVerified: {
    type: Boolean,
    default: false,
  },
  createdAt: {
    type: Date,
    default: Date.now,
  }
});

const Doctor = mongoose.models.Doctor || mongoose.model('Doctor', doctorSchema);
export default Doctor;