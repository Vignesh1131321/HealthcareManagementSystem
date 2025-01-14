import mongoose from "mongoose";

// Check if the model exists before defining it
const healthRecordSchema = new mongoose.Schema({
  name: { type: String, required: true },
  data: { type: Buffer, required: true },
  contentType: { type: String, required: true },
  userId: { type: String, required: true },
  uploadedAt: { type: Date, default: Date.now },
  textContent: { type: String },
  version: { type: Number, default: 1 }
}, {
  timestamps: true
});

// Create compound index
healthRecordSchema.index({ userId: 1, name: 1, version: 1 }, { unique: true });

// Check if the model exists before compiling it
export const HealthRecord = mongoose.models.HealthRecord || mongoose.model("HealthRecord", healthRecordSchema);