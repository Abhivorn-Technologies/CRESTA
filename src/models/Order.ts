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
    area?: string;
    lat?: number;
    lng?: number;
  };
  paymentMethod: string;
  paymentStatus: string;
  orderStatus: string;
  deliveryPartnerId?: mongoose.Types.ObjectId;
  liveLocation?: {
    lat: number;
    lng: number;
    updatedAt: Date;
  };
  deliveryOtp?: string;
  isOtpVerified?: boolean;
  deliveryCharge?: number;
  distanceKm?: number;
  razorpayOrderId?: string;
  razorpayPaymentId?: string;
  razorpaySignature?: string;
  cancellationInfo?: {
    reason: string;
    date: Date;
    eligibleForRefund: boolean;
    refundAmount: number;
    cancellationFee: number;
  };
  refundDetails?: {
    bankName: string;
    accountHolder: string;
    accountNumber: string;
    ifscCode: string;
    status: string; // 'pending', 'processed'
    submittedAt: Date;
  };
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
      area: String,
      lat: Number,
      lng: Number,
    },
    paymentMethod: {
      type: String,
      default: "card",
    },
    paymentStatus: {
      type: String,
      default: "pending", // pending, completed, failed, refunded
    },
    orderStatus: {
      type: String,
      default: "order_placed", 
      // e.g. order_placed, order_confirmed, preparing, assigned, out_for_delivery, arriving, delivered, cancelled
    },
    deliveryPartnerId: {
      type: Schema.Types.ObjectId,
      ref: "User",
    },
    liveLocation: {
      lat: Number,
      lng: Number,
      updatedAt: Date,
    },
    deliveryOtp: String,
    isOtpVerified: { type: Boolean, default: false },
    deliveryCharge: { type: Number, default: 0 },
    distanceKm: { type: Number, default: 0 },
    razorpayOrderId: String,
    razorpayPaymentId: String,
    razorpaySignature: String,
    cancellationInfo: {
      reason: String,
      date: Date,
      eligibleForRefund: Boolean,
      refundAmount: Number,
      cancellationFee: Number,
    },
    refundDetails: {
      bankName: String,
      accountHolder: String,
      accountNumber: String,
      ifscCode: String,
      status: { type: String, default: 'pending' },
      submittedAt: Date,
    },
  },
  { timestamps: true }
);

// Clear Mongoose cache for HMR
if (mongoose.models.Order) {
  delete mongoose.models.Order;
}

export default mongoose.model<IOrder>("Order", OrderSchema);
