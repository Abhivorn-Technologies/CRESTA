import mongoose, { Document, Schema } from 'mongoose';

export interface ISiteImage extends Document {
  key: string;
  imageBase64: string;
  updatedAt: Date;
}

const SiteImageSchema = new Schema<ISiteImage>(
  {
    key: { type: String, required: true, unique: true },
    imageBase64: { type: String, required: true },
  },
  { timestamps: true }
);

export const SiteImage = mongoose.models.SiteImage || mongoose.model<ISiteImage>('SiteImage', SiteImageSchema);
