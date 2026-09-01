const mongoose = require('mongoose');
const dotenv = require('dotenv');

dotenv.config({ path: '.env.local' });

const MONGODB_URI = process.env.MONGODB_URI;

if (!MONGODB_URI) {
  throw new Error("MONGODB_URI is not defined in .env.local");
}

const ServiceableAreaSchema = new mongoose.Schema(
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

const ServiceableArea = mongoose.models.ServiceableArea || mongoose.model("ServiceableArea", ServiceableAreaSchema);

const areasToSeed = [
  { area: "Nallagandla", pincode: "500019", lat: 17.4666, lng: 78.3100 },
  { area: "Nallagandla - Aparna Neo Mall", pincode: "500019", lat: 17.4665816, lng: 78.3099937 },
  { area: "Lingampally", pincode: "500019", lat: 17.4834, lng: 78.3182 },
  { area: "Serilingampally", pincode: "500019", lat: 17.4833, lng: 78.3150 },
  { area: "Gopanpally", pincode: "500046", lat: 17.4520, lng: 78.3075 },
  { area: "Tellapur", pincode: "502032", lat: 17.4552, lng: 78.2917 },
  { area: "Chandanagar", pincode: "500050", lat: 17.4984, lng: 78.3242 },
  { area: "Madinaguda", pincode: "500049", lat: 17.4975, lng: 78.3371 },
  { area: "Hafeezpet", pincode: "500049", lat: 17.4828, lng: 78.3475 },
  { area: "Miyapur", pincode: "500049", lat: 17.4933, lng: 78.3414 },
  { area: "Osman Nagar", pincode: "502032", lat: 17.4390, lng: 78.2861 },
  { area: "Kondapur", pincode: "500084", lat: 17.4622, lng: 78.3568 },
  { area: "Gachibowli", pincode: "500032", lat: 17.4401, lng: 78.3489 },
  { area: "Nanakramguda", pincode: "500032", lat: 17.4144, lng: 78.3437 },
  { area: "Financial District", pincode: "500032", lat: 17.4150, lng: 78.3440 },
  { area: "Manikonda", pincode: "500075", lat: 17.3986, lng: 78.3970 },
  { area: "Kokapet", pincode: "500075", lat: 17.3912, lng: 78.3262 },
  { area: "Narsingi", pincode: "500075", lat: 17.3878, lng: 78.3441 },
  { area: "Khajaguda", pincode: "500008", lat: 17.4111, lng: 78.3752 },
  { area: "Kollur", pincode: "502300", lat: 17.4556, lng: 78.2327 },
  { area: "Bachupally", pincode: "500090", lat: 17.5255, lng: 78.3855 },
];

async function seed() {
  try {
    await mongoose.connect(MONGODB_URI);
    console.log("Connected to MongoDB");

    await ServiceableArea.deleteMany({});
    console.log("Cleared old areas");

    const docs = areasToSeed.map((a) => ({
      ...a,
      city: "Hyderabad",
      active: true,
      distanceKm: 5 // Default simulation
    }));

    await ServiceableArea.insertMany(docs);
    console.log(`Seeded ${docs.length} areas successfully!`);
    
    mongoose.connection.close();
  } catch (error) {
    console.error("Seed error:", error);
    mongoose.connection.close();
  }
}

seed();
