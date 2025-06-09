import { z } from "zod";
import {
  createBusinessApiSchema,
  updateBusinessApiSchema,
  businessFormSchema,
} from "@/dataSchemas/business";

// Business schema-derived types
export type CreateBusinessApiInput = z.infer<typeof createBusinessApiSchema>;
export type UpdateBusinessApiInput = z.infer<typeof updateBusinessApiSchema>;
export type BusinessFormInput = z.infer<typeof businessFormSchema>;

// Business profile and settings
export type BusinessProfileInput = BusinessFormInput;
export type BusinessUpdateValues = UpdateBusinessApiInput;
