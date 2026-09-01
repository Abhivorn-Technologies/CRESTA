import mongoose, { Document, Model, Schema } from "mongoose";

export interface IServiceableArea extends Document {
  pincode: string;
  city: string;
  area: string;
  active: boolean;
  distanceKm: number;
  lat: number;
  lng: number;
}

const ServiceableAreaSchema = new Schema<IServiceableArea>(
  {
    pincode: { type: String, required: true },
    city: { type: String, required: true },
    area: { type: String, required: true },
    active: { type: Boolean, default: true },
    distanceKm: { type: Number, required: true },
    lat: { type: Number },
    lng: { type: Number },
  },
  { timestamps: true }
);

const ServiceableArea: Model<IServiceableArea> =
  mongoose.models.ServiceableArea ||
  mongoose.model<IServiceableArea>("ServiceableArea", ServiceableAreaSchema);

export default ServiceableArea;
