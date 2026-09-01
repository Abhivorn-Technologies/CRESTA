import mongoose from 'mongoose';
import { connectToDatabase } from './src/lib/mongodb';
import { SiteImage } from './src/models/SiteImage';

async function run() {
  await connectToDatabase();
  const img = await SiteImage.findOne({ key: 'about-mission' });
  if (img) {
    console.log("Prefix found:");
    console.log(img.imageBase64.substring(0, 50));
  } else {
    console.log("Image not found");
  }
  process.exit(0);
}

run();
