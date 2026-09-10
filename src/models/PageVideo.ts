import mongoose from 'mongoose';

const PageVideoSchema = new mongoose.Schema(
  {
    key: { type: String, required: true, unique: true },
    path: { type: String, required: true }, // e.g. "/videos/<key>.mp4"
    updatedAt: { type: Date, default: Date.now },
  },
  { timestamps: true }
);

export const PageVideo = mongoose.models.PageVideo || mongoose.model('PageVideo', PageVideoSchema);
