import { updateUserSchema } from "@/dataSchemas";
import { createBusinessSchema } from "@/dataSchemas/business";
import { z } from "zod";

export type BusinessFormValues = z.infer<typeof createBusinessSchema>;

export type CurrencyType =
  | "USD"
  | "EUR"
  | "GBP"
  | "NGN"
  | "JPY"
  | "CAD"
  | "AUD";

// Type inference from the schema
export type UpdateUserData = z.infer<typeof updateUserSchema>;
