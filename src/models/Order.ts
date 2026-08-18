import mongoose, { Schema, Document } from "mongoose";

export interface IOrder extends Document {
  sessionId?: string;
  userId?: mongoose.Types.ObjectId; // Optional for guest checkout
  items: any[];
  totalAmount: number;
  shippingAddress: {
    firstName: string;
    lastName: string;
    email: string;
    phone: string;
    address: string;
    city: string;
    postalCode: string;
  };
  paymentMethod: string;
  paymentStatus: string;
  orderStatus: string;
  createdAt: Date;
  updatedAt: Date;
}

const OrderSchema: Schema = new Schema(
  {
    sessionId: {
      type: String,
      required: false,
      index: true,
    },
    userId: {
      type: Schema.Types.ObjectId,
      ref: "User",
      required: false,
    },
    items: {
      type: Array,
      required: true,
    },
    totalAmount: {
      type: Number,
      required: true,
    },
    shippingAddress: {
      firstName: String,
      lastName: String,
      email: String,
      phone: String,
      address: String,
      city: String,
      postalCode: String,
    },
    paymentMethod: {
      type: String,
      default: "card",
    },
    paymentStatus: {
      type: String,
      default: "pending", // pending, completed, failed
    },
    orderStatus: {
      type: String,
      default: "processing", // processing, shipped, delivered, cancelled
    },
  },
  { timestamps: true }
);

export default mongoose.models.Order || mongoose.model<IOrder>("Order", OrderSchema);
