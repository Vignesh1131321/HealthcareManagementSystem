import mongoose from 'mongoose';

const roomSchema = new mongoose.Schema({
  roomId: { 
    type: String, 
    required: true, 
    unique: true 
  },
  userId: {
    type: String,
    ref: 'User',
    required: true
  },
  doctorId: {
    type: String,
    ref: 'Doctor',
    required: true
  },
  isActive: {
    type: Boolean,
    default: true
  },
  createdAt: { 
    type: Date, 
    default: Date.now,
    expires: 3600 // Room expires after 1 hour
  }
});

export default mongoose.models.Room || mongoose.model('Room', roomSchema);