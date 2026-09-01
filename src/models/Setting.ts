import mongoose, { Document, Schema } from 'mongoose';

export interface ISetting extends Document {
  profile: {
    firstName: string;
    lastName: string;
    email: string;
    avatar?: string;
  };
  store: {
    name: string;
    description: string;
    contactEmail: string;
    contactPhone: string;
    location: string;
  };
  notifications: {
    orderAlerts: boolean;
    stockAlerts: boolean;
    newsletterSubscribers: boolean;
  };
  localization: {
    currency: string;
    timezone: string;
  };
  delivery: {
    primaryLocation: string;
    maxDistanceKm: number;
    freeDeliveryThreshold: number;
  };
  tax: {
    gstPercentage: number;
  };
  productConstraints: {
    minPrice: number;
    maxPrice: number;
  };
  cancellation: {
    windowMinutes: number;
  };
}

const SettingSchema = new Schema<ISetting>(
  {
    profile: {
      firstName: { type: String, default: 'Admin' },
      lastName: { type: String, default: 'User' },
      email: { type: String, default: 'admin@cresta.com' },
      avatar: { type: String, default: '' },
    },
    store: {
      name: { type: String, default: 'Cresta Ice Creams' },
      description: { type: String, default: 'Premium Ice Cream Delivery' },
      contactEmail: { type: String, default: 'hello@cresta.com' },
      contactPhone: { type: String, default: '9000199047' },
      location: { type: String, default: 'Aparna Cinemas, Nallagandla, Hyderabad (17°27\'59.7"N 78°18\'36.0"E)' },
    },
    notifications: {
      orderAlerts: { type: Boolean, default: true },
      stockAlerts: { type: Boolean, default: true },
      newsletterSubscribers: { type: Boolean, default: false },
    },
    localization: {
      currency: { type: String, default: 'INR' },
      timezone: { type: String, default: 'Asia/Kolkata' },
    },
    delivery: {
      primaryLocation: { type: String, default: 'Nallagandla – Aparna Neo Mall' },
      maxDistanceKm: { type: Number, default: 20 },
      freeDeliveryThreshold: { type: Number, default: 500 },
    },
    tax: {
      gstPercentage: { type: Number, default: 5 },
    },
    productConstraints: {
      minPrice: { type: Number, default: 78 },
      maxPrice: { type: Number, default: 3300 },
    },
    cancellation: {
      windowMinutes: { type: Number, default: 5 },
    }
  },
  { timestamps: true }
);

export const Setting = mongoose.models.Setting || mongoose.model<ISetting>('Setting', SettingSchema);
