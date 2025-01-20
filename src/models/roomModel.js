import mongoose from 'mongoose';

const roomSchema = new mongoose.Schema({
  roomId: {
    type: String,
    required: true,
    unique: true
  },
  offer: {
    type: {
      type: String,
      required: true
    },
    sdp: {
      type: String,
      required: true
    }
  },
  answer: {
    type: {
      type: String,
      required: false
    },
    sdp: {
      type: String,
      required: false
    }
  },
  createdAt: {
    type: Date,
    default: Date.now,
    expires: 3600 // Automatically delete after 1 hour
  }
});

// Change from named export to default export
const Room = mongoose.models.Room || mongoose.model('Room', roomSchema);
export default Room;