import { NextResponse } from "next/server";
import { connectToDatabase } from "@/lib/mongodb";
import Product from "@/models/Product";
import Category from "@/models/Category";
import ServiceableArea from "@/models/ServiceableArea";
import User from "@/models/User";
import { mockProducts } from "@/data/products";
import bcrypt from "bcryptjs";

export async function GET() {
  try {
    await connectToDatabase();

    // Clear existing data to avoid duplicates during seeding
    await Product.deleteMany({});
    await Category.deleteMany({});
    await ServiceableArea.deleteMany({});

    // Seed products
    const productsToInsert = mockProducts.map(p => ({
      ...p,
      slug: p.name.toLowerCase().replace(/\s+/g, '-'),
    }));
    await Product.insertMany(productsToInsert);

    // Extract unique categories and assign an image from a product
    const categoryMap = new Map();
    for (const p of mockProducts) {
      if (!categoryMap.has(p.category)) {
        categoryMap.set(p.category, {
          label: p.category,
          slug: p.category.toLowerCase().replace(/\s+/g, '-'),
          image: p.image,
          description: `Explore our premium ${p.category}`,
        });
      }
    }
    const categoriesToInsert = Array.from(categoryMap.values());
    await Category.insertMany(categoriesToInsert);

    // Seed Serviceable Areas
    const areasToInsert = [
      { pincode: "500019", city: "Hyderabad", area: "Nallagandla", active: true, distanceKm: 2, lat: 17.4740, lng: 78.3120 },
      { pincode: "500019", city: "Hyderabad", area: "Lingampally", active: true, distanceKm: 3, lat: 17.4855, lng: 78.3195 },
      { pincode: "500019", city: "Hyderabad", area: "Serilingampally", active: true, distanceKm: 2.5, lat: 17.4810, lng: 78.3150 },
      { pincode: "500046", city: "Hyderabad", area: "Gopanpally", active: true, distanceKm: 5, lat: 17.4560, lng: 78.3090 },
      { pincode: "502032", city: "Hyderabad", area: "Tellapur", active: true, distanceKm: 6, lat: 17.4580, lng: 78.2930 },
      { pincode: "500050", city: "Hyderabad", area: "Chandanagar", active: true, distanceKm: 7, lat: 17.4980, lng: 78.3300 },
      { pincode: "500049", city: "Hyderabad", area: "Madinaguda", active: true, distanceKm: 8, lat: 17.4960, lng: 78.3450 },
      { pincode: "500049", city: "Hyderabad", area: "Hafeezpet", active: true, distanceKm: 9, lat: 17.4870, lng: 78.3530 },
      { pincode: "500049", city: "Hyderabad", area: "Miyapur", active: true, distanceKm: 10, lat: 17.4990, lng: 78.3610 },
      { pincode: "502032", city: "Hyderabad", area: "Osman Nagar", active: true, distanceKm: 8, lat: 17.4500, lng: 78.2800 },
      { pincode: "500084", city: "Hyderabad", area: "Kondapur", active: true, distanceKm: 11, lat: 17.4620, lng: 78.3580 },
      { pincode: "500032", city: "Hyderabad", area: "Gachibowli", active: true, distanceKm: 12, lat: 17.4400, lng: 78.3480 },
      { pincode: "500032", city: "Hyderabad", area: "Nanakramguda", active: true, distanceKm: 14, lat: 17.4180, lng: 78.3380 },
      { pincode: "500032", city: "Hyderabad", area: "Financial District", active: true, distanceKm: 15, lat: 17.4120, lng: 78.3410 },
      { pincode: "500075", city: "Hyderabad", area: "Manikonda", active: true, distanceKm: 17, lat: 17.4040, lng: 78.3840 },
      { pincode: "500075", city: "Hyderabad", area: "Kokapet", active: true, distanceKm: 16, lat: 17.3980, lng: 78.3260 },
      { pincode: "500075", city: "Hyderabad", area: "Narsingi", active: true, distanceKm: 18, lat: 17.3910, lng: 78.3450 },
      { pincode: "500008", city: "Hyderabad", area: "Khajaguda", active: true, distanceKm: 16, lat: 17.4150, lng: 78.3620 },
      { pincode: "502300", city: "Hyderabad", area: "Kollur", active: true, distanceKm: 14, lat: 17.4200, lng: 78.2500 },
      { pincode: "500090", city: "Hyderabad", area: "Bachupally", active: true, distanceKm: 19, lat: 17.5450, lng: 78.3860 },
    ];
    await ServiceableArea.insertMany(areasToInsert);

    // Seed Driver Account
    const driverEmail = "driver@crestaglobal.com";
    const existingDriver = await User.findOne({ email: driverEmail });
    if (!existingDriver) {
      const hashedPassword = await bcrypt.hash("driver123", 10);
      await User.create({
        name: "Test Driver",
        email: driverEmail,
        password: hashedPassword,
        role: "delivery_partner",
        addresses: [],
      });
    }

    return NextResponse.json({ message: "Database seeded successfully" });
  } catch (error) {
    console.error("Seeding error:", error);
    return NextResponse.json({ error: "Failed to seed database" }, { status: 500 });
  }
}
