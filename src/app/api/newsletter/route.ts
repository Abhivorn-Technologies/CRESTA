import { NextRequest } from "next/server";
import { connectToDatabase } from "@/lib/mongodb";
import Newsletter from "@/models/Newsletter";
import { newsletterSchema } from "@/lib/validations/newsletter";
import { apiError, apiSuccess } from "@/lib/api-response";

export async function POST(request: NextRequest) {
  const body = await request.json().catch(() => null);
  const parsed = newsletterSchema.safeParse(body);

  if (!parsed.success) {
    return apiError("Validation failed", 422, parsed.error.flatten().fieldErrors);
  }

  try {
    await connectToDatabase();
    await Newsletter.findOneAndUpdate(
      { email: parsed.data.email },
      { email: parsed.data.email, subscribed: true },
      { upsert: true, new: true, setDefaultsOnInsert: true }
    );

    return apiSuccess("Subscribed successfully. Thank you for joining us!");
  } catch (error) {
    console.error("Newsletter subscription failed", error);
    return apiError("Something went wrong. Please try again later.", 500);
  }
}
