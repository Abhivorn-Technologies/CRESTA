import mongoose, { Schema, Document } from "mongoose";

export interface IWishlist extends Document {
  sessionId?: string;
  userId?: mongoose.Types.ObjectId;
  items: string[];
  updatedAt: Date;
}

const WishlistSchema: Schema = new Schema(
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
      index: true,
    },
    items: {
      type: [String],
      default: [],
    },
  },
  { timestamps: true }
);

export default mongoose.models.Wishlist || mongoose.model<IWishlist>("Wishlist", WishlistSchema);
