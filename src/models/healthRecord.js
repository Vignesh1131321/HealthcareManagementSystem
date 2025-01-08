import mongoose from "mongoose";

const healthRecordSchema = new mongoose.Schema({
  name: { type: String, required: true },
  data: { type: Buffer }, // Optional, used if data is stored directly in the DB
  filePath: { type: String }, // Path for external file storage
  contentType: { type: String, required: true },
  userId: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
  version: { type: Number, default: 1 }, // For versioning health records
  tags: { type: [String], default: [] }, // Tags for categorization
  encrypted: { type: Boolean, default: false }, // Flag for encrypted data
  uploadedAt: { type: Date, default: Date.now },
});

// Ensure the combination of userId, name, and version is unique
healthRecordSchema.index({ userId: 1, name: 1, version: 1 }, { unique: true });

export const HealthRecord = mongoose.model("HealthRecord", healthRecordSchema);
