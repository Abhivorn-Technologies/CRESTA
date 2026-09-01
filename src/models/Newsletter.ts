import { Schema, model, models, type InferSchemaType } from "mongoose";

const newsletterSchema = new Schema(
  {
    email: {
      type: String,
      required: true,
      unique: true,
      lowercase: true,
      trim: true,
    },
    subscribed: {
      type: Boolean,
      default: true,
    },
  },
  { timestamps: true }
);

export type Newsletter = InferSchemaType<typeof newsletterSchema>;

export default models.Newsletter || model("Newsletter", newsletterSchema);
