import mongoose, { Document, Model, Schema } from "mongoose";

export interface INutrition {
  servingSize: string;
  calories: string;
  fat: string;
  sugars: string;
  protein: string;
  allergens: string;
}

export interface IProduct extends Document {
  id: string;
  slug: string;
  name: string;
  category: string;
  image: string;
  price: number;
  originalPrice?: number;
  volume?: string;
  rating: number;
  reviewCount: number;
  inStock: boolean;
  badges: string[];
  description?: string;
  nutrition?: INutrition;
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
    volume: { type: String, default: "" },
    rating: { type: Number, default: 0 },
    reviewCount: { type: Number, default: 0 },
    inStock: { type: Boolean, default: true },
    badges: { type: [String], default: [] },
    description: { type: String },
    nutrition: { type: Schema.Types.Mixed, default: null },
  },
  { timestamps: true }
);

ProductSchema.pre("save", async function () {
  try {
    const { Setting } = await import("@/models/Setting");
    const settings = await Setting.findOne();
    if (settings && settings.productConstraints) {
      if (typeof settings.productConstraints.minPrice === "number" && this.price < settings.productConstraints.minPrice) {
        throw new Error(`Product price (₹${this.price}) cannot be less than the minimum allowed price (₹${settings.productConstraints.minPrice})`);
      }
      if (typeof settings.productConstraints.maxPrice === "number" && this.price > settings.productConstraints.maxPrice) {
        throw new Error(`Product price (₹${this.price}) cannot exceed the maximum allowed price (₹${settings.productConstraints.maxPrice})`);
      }
    }
  } catch (err: any) {
    if (err?.message && err.message.includes("cannot")) {
      throw err;
    }
    // If settings model is not loaded or DB is initializing, don't crash product save
  }
});

// Delete stale cached model in development/hot-reload to ensure updated schema takes effect
if (mongoose.models && mongoose.models.Product) {
  delete (mongoose.models as any).Product;
}

const Product: Model<IProduct> = mongoose.model<IProduct>("Product", ProductSchema);

export default Product;
