import mongoose, { Document, Model, Schema } from "mongoose";

export interface IOtp extends Document {
  email?: string;
  phone?: string;
  otp: string;
  createdAt: Date;
}

const OtpSchema = new Schema<IOtp>({
  email: {
    type: String,
    required: false,
  },
  phone: {
    type: String,
    required: false,
  },
  otp: {
    type: String,
    required: true,
  },
  createdAt: {
    type: Date,
    default: Date.now,
    expires: 300, // Automatically delete document after 5 minutes (300 seconds)
  }
});

const Otp: Model<IOtp> = mongoose.models.Otp || mongoose.model<IOtp>("Otp", OtpSchema);

export default Otp;
