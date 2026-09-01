import ServiceableArea from "@/models/ServiceableArea";
import { connectToDatabase } from "@/lib/mongodb";

export async function findServiceableArea(pincode: string) {
  await connectToDatabase();
  const area = await ServiceableArea.findOne({ pincode, active: true });
  return area;
}

