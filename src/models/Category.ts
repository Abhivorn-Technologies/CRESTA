import mongoose, { Document, Model, Schema } from "mongoose";


export interface ICategory extends Document {
  slug: string;
  label: string;
  description: string;
  image: string;
}

const CategorySchema = new Schema<ICategory>(
  {
    slug: { type: String, required: true, unique: true },
    label: { type: String, required: true },
    description: { type: String, default: "" },
    image: { type: String, default: "" },
  },
  { timestamps: true }
);

const Category: Model<ICategory> =
  mongoose.models.Category || mongoose.model<ICategory>("Category", CategorySchema);

export default Category;
