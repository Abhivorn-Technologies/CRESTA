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

ProductSchema.pre("save", async function () {
  const Setting = mongoose.model("Setting");
  const settings = await Setting.findOne();
  if (settings && settings.productConstraints) {
    if (this.price < settings.productConstraints.minPrice) {
      throw new Error(`Product price (₹${this.price}) cannot be less than the minimum allowed price (₹${settings.productConstraints.minPrice})`);
    }
    if (this.price > settings.productConstraints.maxPrice) {
      throw new Error(`Product price (₹${this.price}) cannot exceed the maximum allowed price (₹${settings.productConstraints.maxPrice})`);
    }
  }
});

const Product: Model<IProduct> =
  mongoose.models.Product || mongoose.model<IProduct>("Product", ProductSchema);

export default Product;
