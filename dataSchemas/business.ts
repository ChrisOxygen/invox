import { z } from "zod";

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

// Payment terms enum
export const PaymentTerms = {
  NET_15: "Net 15",
  NET_30: "Net 30",
  NET_45: "Net 45",
  NET_60: "Net 60",
  DUE_ON_RECEIPT: "Due on Receipt",
  CASH_ON_DELIVERY: "Cash on Delivery",
} as const;

const paymentTermsArray = Object.values(PaymentTerms);

// Base business validation schema
const baseBusinessSchema = z.object({
  businessName: z
    .string()
    .min(2, "Business name must be at least 2 characters")
    .max(100, "Business name must not exceed 100 characters"),
  businessType: z.enum(businessTypesArray as [string, ...string[]]).optional(),
  email: z.string().email("Valid email is required"),
  addressLine1: z
    .string()
    .max(255, "Address line 1 must not exceed 255 characters")
    .optional(),
  addressLine2: z
    .string()
    .max(255, "Address line 2 must not exceed 255 characters")
    .optional(),
  city: z.string().max(100, "City must not exceed 100 characters").optional(),
  state: z.string().max(50, "State must not exceed 50 characters").optional(),
  zipCode: z
    .string()
    .regex(/^[0-9]{5}(-[0-9]{4})?$/, "Invalid ZIP code format")
    .optional()
    .or(z.literal("")),
  phone: z
    .string()
    .regex(/^[\+]?[1-9][\d]{0,15}$/, "Invalid phone number format")
    .optional()
    .or(z.literal("")),
  logo: z.string().url("Logo must be a valid URL").optional().or(z.literal("")),
  defaultPaymentTerms: z
    .enum(paymentTermsArray as [string, ...string[]])
    .optional(),
  defaultLateFee: z
    .string()
    .regex(/^\d+(\.\d{1,2})?$/, "Late fee must be a valid number")
    .optional()
    .or(z.literal("")),
  defaultInvoiceNotes: z
    .string()
    .max(1000, "Invoice notes must not exceed 1000 characters")
    .optional(),
});

// Create business schema (requires businessName and email)
export const createBusinessSchema = baseBusinessSchema.required({
  businessName: true,
  email: true,
});

// Update business schema (all fields optional but at least one required)
export const updateBusinessSchema = baseBusinessSchema
  .partial()
  .refine((data) => Object.keys(data).length > 0, {
    message: "At least one field must be provided for update",
  });

// Type exports
export type CreateBusinessInput = z.infer<typeof createBusinessSchema>;
export type UpdateBusinessInput = z.infer<typeof updateBusinessSchema>;
export type BusinessType = (typeof BusinessTypes)[keyof typeof BusinessTypes];
export type PaymentTerm = (typeof PaymentTerms)[keyof typeof PaymentTerms];
