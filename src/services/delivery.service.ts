import { connectToDatabase } from "@/lib/mongodb";
import ServiceableArea from "@/models/ServiceableArea";
import { ServiceableArea as ServiceableAreaType } from "@/constants/delivery"; // Type usage

export async function findServiceableArea(pincode: string): Promise<ServiceableAreaType | null> {
  await connectToDatabase();
  const area = await ServiceableArea.findOne({ pincode }).lean();
  if (!area) return null;
  
  return {
    pincode: area.pincode,
    city: area.city,
  };
}
