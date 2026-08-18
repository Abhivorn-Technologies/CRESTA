import { NextRequest } from "next/server";
import { findServiceableArea } from "@/services/delivery.service";
import { pincodeSchema } from "@/lib/validations/pincode";
import { apiError, apiSuccess } from "@/lib/api-response";

export async function GET(request: NextRequest) {
  const pincode = request.nextUrl.searchParams.get("pincode") ?? "";
  const parsed = pincodeSchema.safeParse({ pincode });

  if (!parsed.success) {
    return apiError(
      parsed.error.flatten().fieldErrors.pincode?.[0] ?? "Invalid pincode",
      422
    );
  }

  const area = await findServiceableArea(parsed.data.pincode);

  if (!area) {
    return apiSuccess("This pincode is not serviceable yet", {
      serviceable: false,
    });
  }

  return apiSuccess(`We deliver to ${area.city}!`, {
    serviceable: true,
    city: area.city,
  });
}
