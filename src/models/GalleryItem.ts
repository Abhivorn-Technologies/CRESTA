import mongoose, { Document, Schema } from 'mongoose';

export interface IGalleryItem extends Document {
  type: 'image' | 'video';
  title: string;
  caption: string;
  src: string;
  order: number;
  createdAt: Date;
  updatedAt: Date;
}

const GalleryItemSchema = new Schema<IGalleryItem>(
  {
    type: { type: String, enum: ['image', 'video'], required: true },
    title: { type: String, required: true, trim: true },
    caption: { type: String, default: '', trim: true },
    src: { type: String, required: true },
    order: { type: Number, default: 0 },
  },
  { timestamps: true }
);

export const GalleryItem = mongoose.models.GalleryItem || mongoose.model<IGalleryItem>('GalleryItem', GalleryItemSchema);
