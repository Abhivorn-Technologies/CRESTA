import { NextRequest } from "next/server";
import { findServiceableArea } from "@/services/delivery.service";
import { pincodeSchema } from "@/lib/validations/pincode";
import { apiError, apiSuccess } from "@/lib/api-response";

export async function GET(request: NextRequest) {
  const pincode = request.nextUrl.searchParams.get("pincode") ?? "";
  const areaName = request.nextUrl.searchParams.get("area") ?? "";
  const parsed = pincodeSchema.safeParse({ pincode });

  if (!parsed.success) {
    return apiError(
      parsed.error.flatten().fieldErrors.pincode?.[0] ?? "Invalid pincode",
      422
    );
  }

  // Find area by pincode and name if possible, or just pincode
  let area = null;
  const { connectToDatabase } = await import("@/lib/mongodb");
  await connectToDatabase();
  const ServiceableArea = (await import("@/models/ServiceableArea")).default;
  
  if (areaName) {
    area = await ServiceableArea.findOne({ pincode: parsed.data.pincode, area: areaName, active: true });
  }
  if (!area) {
    area = await ServiceableArea.findOne({ pincode: parsed.data.pincode, active: true });
  }

  if (!area) {
    return apiSuccess("This pincode is not serviceable yet", {
      serviceable: false,
    });
  }

  return apiSuccess(`We deliver to ${area.area || area.city}!`, {
    serviceable: true,
    city: area.city,
    area: area.area,
    distanceKm: area.distanceKm,
  });
}
