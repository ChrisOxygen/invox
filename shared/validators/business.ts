import * as z from "zod";
import { commonFields, addressSchema } from "@/dataSchemas/base/common";

// Base business schema with all possible fields
export const baseBusinessSchema = z.object({
  businessName: commonFields.businessName,
  businessType: z.string().optional(),
  email: commonFields.email,
  ...addressSchema.shape,
  phone: commonFields.phone,
  logo: commonFields.url,
});

// Business creation schema (used in onboarding)
export const createBusinessSchema = baseBusinessSchema.required({
  businessName: true,
  email: true,
});

// Business update schema (used in account management)
export const updateBusinessSchema = baseBusinessSchema
  .partial()
  .refine((data) => Object.keys(data).length > 0, {
    message: "At least one field must be provided for update",
  });

// Editable business fields schema (subset for account editing)
export const editableBusinessSchema = z.object({
  addressLine1: z.string().optional(),
  addressLine2: z.string().optional(),
  city: z.string().optional(),
  state: z.string().optional(),
  zipCode: z.string().optional(),
  phone: z.string().optional(),
});

// Business address only schema (reusable component)
export const businessAddressSchema = z.object({
  addressLine1: z.string().optional(),
  addressLine2: z.string().optional(),
  city: z.string().optional(),
  state: z.string().optional(),
  zipCode: z.string().optional(),
});

// Type exports
export type CreateBusinessData = z.infer<typeof createBusinessSchema>;
export type UpdateBusinessData = z.infer<typeof updateBusinessSchema>;
export type EditableBusinessData = z.infer<typeof editableBusinessSchema>;
export type BusinessAddressData = z.infer<typeof businessAddressSchema>;
export type BaseBusinessData = z.infer<typeof baseBusinessSchema>;
