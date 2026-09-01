import { z } from "zod";

export const pincodeSchema = z.object({
  pincode: z
    .string()
    .trim()
    .regex(/^\d{6}$/, "Enter a valid 6-digit pincode"),
});

export type PincodeInput = z.infer<typeof pincodeSchema>;
