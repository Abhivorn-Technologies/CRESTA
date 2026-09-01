import mongoose, { Schema, Document } from "mongoose";

export interface INotificationHistory extends Document {
  orderId?: mongoose.Types.ObjectId;
  customerId?: mongoose.Types.ObjectId;
  phone: string;
  type: string; // e.g. "order_placed", "otp_sent", "out_for_delivery"
  message: string;
  status: string; // "sent", "failed"
  failureReason?: string;
  createdAt: Date;
  updatedAt: Date;
}

const NotificationHistorySchema = new Schema<INotificationHistory>(
  {
    orderId: {
      type: Schema.Types.ObjectId,
      ref: "Order",
    },
    customerId: {
      type: Schema.Types.ObjectId,
      ref: "User",
    },
    phone: { type: String, required: true },
    type: { type: String, required: true },
    message: { type: String, required: true },
    status: { type: String, required: true, default: "sent" },
    failureReason: { type: String },
  },
  { timestamps: true }
);

export default mongoose.models.NotificationHistory ||
  mongoose.model<INotificationHistory>("NotificationHistory", NotificationHistorySchema);
