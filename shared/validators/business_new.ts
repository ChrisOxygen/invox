import { z } from "zod";
import { commonFields, addressSchema } from "./common";

// Business types enum
export const BusinessTypes = {
  SOLE_PROPRIETORSHIP: "Sole Proprietorship",
  PARTNERSHIP: "Partnership",
  LLC: "Limited Liability Company (LLC)",
  CORPORATION: "Corporation",
  S_CORPORATION: "S Corporation",
  NON_PROFIT: "Non-Profit Organization",
  FREELANCER: "Freelancer",
  CONSULTANT: "Consultant",
  OTHER: "Other",
} as const;

const businessTypesArray = Object.values(BusinessTypes);

// Business creation API schema
export const createBusinessApiSchema = z.object({
  businessName: commonFields.businessName,
  businessType: z.enum(businessTypesArray as [string, ...string[]]).optional(),
  email: commonFields.email,
  ...addressSchema.shape,
  phone: commonFields.phone,
  logo: commonFields.url,
});

// Business update API schema
export const updateBusinessApiSchema = createBusinessApiSchema
  .partial()
  .refine((data) => Object.keys(data).length > 0, {
    message: "At least one field must be provided for update",
  });

// Full business profile schema (for onboarding and complete forms)
export const businessProfileSchema = z.object({
  businessName: commonFields.businessName,
  businessType: z.enum(businessTypesArray as [string, ...string[]]).optional(),
  email: commonFields.email,
  ...addressSchema.shape,
  phone: commonFields.phone,
  logo: commonFields.url,
});

// Business form values for React Hook Form (used in onboarding)
export const businessFormSchema = businessProfileSchema.required({
  businessName: true,
  email: true,
});

// Base business schema with all possible fields (legacy compatibility)
export const baseBusinessSchema = z.object({
  businessName: commonFields.businessName,
  businessType: z.string().optional(),
  email: commonFields.email,
  ...addressSchema.shape,
  phone: commonFields.phone,
  logo: commonFields.url,
});

// Business creation schema (used in onboarding) - legacy compatibility
export const createBusinessSchema = baseBusinessSchema.required({
  businessName: true,
  email: true,
});

// Business update schema (used in account management) - legacy compatibility
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
export type BusinessType = (typeof BusinessTypes)[keyof typeof BusinessTypes];
export type CreateBusinessData = z.infer<typeof createBusinessSchema>;
export type UpdateBusinessData = z.infer<typeof updateBusinessSchema>;
export type EditableBusinessData = z.infer<typeof editableBusinessSchema>;
export type BusinessAddressData = z.infer<typeof businessAddressSchema>;
export type BaseBusinessData = z.infer<typeof baseBusinessSchema>;
