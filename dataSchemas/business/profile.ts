import { z } from "zod";
import { commonFields, addressSchema } from "../base/common";
import { BusinessTypes } from "./creation";

const businessTypesArray = Object.values(BusinessTypes);

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
