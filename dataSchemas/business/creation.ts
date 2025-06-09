import { z } from "zod";
import { commonFields, addressSchema } from "../base/common";

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

export type BusinessType = (typeof BusinessTypes)[keyof typeof BusinessTypes];
