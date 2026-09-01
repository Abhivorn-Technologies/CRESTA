import mongoose, { Schema, Document } from "mongoose";

export interface IAddress {
  _id?: string;
  fullName: string;
  phone: string;
  street: string;
  apartment?: string;
  city: string;
  state?: string;
  postalCode: string;
  isDefault: boolean;
  lat?: number;
  lng?: number;
  area?: string;
}

export interface IUser extends Document {
  name?: string;
  email?: string;
  phone?: string;
  password?: string;
  role: string;
  addresses: IAddress[];
  createdAt: Date;
  updatedAt: Date;
}

const AddressSchema = new Schema({
  fullName: { type: String, required: true },
  phone: { type: String, required: true },
  street: { type: String, required: true },
  apartment: { type: String },
  city: { type: String, required: true },
  state: { type: String },
  postalCode: { type: String, required: true },
  isDefault: { type: Boolean, default: false },
  lat: { type: Number },
  lng: { type: Number },
  area: { type: String },
});

const UserSchema: Schema = new Schema(
  {
    name: {
      type: String,
      required: false,
    },
    email: {
      type: String,
      required: false,
      unique: true,
      sparse: true,
      lowercase: true,
      trim: true,
    },
    phone: {
      type: String,
      unique: true,
      sparse: true,
    },
    password: {
      type: String,
      required: false,
      select: false,
    },
    role: {
      type: String,
      enum: ["user", "admin", "delivery_partner"],
      default: "user",
    },
    addresses: [AddressSchema],
  },
  { timestamps: true }
);

// Delete the cached model to force Mongoose to recompile it with the new addresses schema
// This fixes a Next.js hot-reload issue where the old schema is cached in memory
if (mongoose.models.User) {
  delete mongoose.models.User;
}

export default mongoose.model<IUser>("User", UserSchema);
