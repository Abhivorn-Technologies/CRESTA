import mongoose, { Document, Model, Schema } from "mongoose";

export interface IServiceableArea extends Document {
  pincode: string;
  city: string;
}

const ServiceableAreaSchema = new Schema<IServiceableArea>(
  {
    pincode: { type: String, required: true, unique: true },
    city: { type: String, required: true },
  },
  { timestamps: true }
);

const ServiceableArea: Model<IServiceableArea> =
  mongoose.models.ServiceableArea ||
  mongoose.model<IServiceableArea>("ServiceableArea", ServiceableAreaSchema);

export default ServiceableArea;
