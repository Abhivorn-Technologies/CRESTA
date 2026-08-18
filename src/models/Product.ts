import mongoose, { Document, Model, Schema } from "mongoose";

export interface IProduct extends Document {
  id: string;
  slug: string;
  name: string;
  category: string;
  image: string;
  price: number;
  originalPrice?: number;
  volume: string;
  rating: number;
  reviewCount: number;
  inStock: boolean;
  badges: string[];
  description?: string;
}

const ProductSchema = new Schema<IProduct>(
  {
    id: { type: String, required: true, unique: true },
    slug: { type: String, required: true, unique: true },
    name: { type: String, required: true },
    category: {
      type: String,
      required: true,
    },
    image: { type: String, default: "" },
    price: { type: Number, required: true },
    originalPrice: { type: Number },
    volume: { type: String, required: true },
    rating: { type: Number, default: 0 },
    reviewCount: { type: Number, default: 0 },
    inStock: { type: Boolean, default: true },
    badges: { type: [String], default: [] },
    description: { type: String },
  },
  { timestamps: true }
);

const Product: Model<IProduct> =
  mongoose.models.Product || mongoose.model<IProduct>("Product", ProductSchema);

export default Product;
