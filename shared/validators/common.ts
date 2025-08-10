import { z } from "zod";

// Common field validation patterns
export const commonFields = {
  email: z.string().email("Valid email is required"),

  phone: z
    .string()
    .regex(/^[\+]?[1-9][\d]{0,15}$/, "Invalid phone number format")
    .optional()
    .or(z.literal("")),

  businessName: z
    .string()
    .min(2, "Business name must be at least 2 characters")
    .max(100, "Business name must not exceed 100 characters"),

  name: z
    .string()
    .min(2, "Name must be at least 2 characters")
    .max(50, "Name must not exceed 50 characters"),

  password: z
    .string()
    .min(8, "Password must be at least 8 characters")
    .regex(
      /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)/,
      "Password must contain at least one uppercase letter, one lowercase letter, and one number"
    ),

  url: z.string().url("Must be a valid URL").optional().or(z.literal("")),

  currency: z
    .string()
    .regex(/^\d+(\.\d{1,2})?$/, "Must be a valid number")
    .optional()
    .or(z.literal("")),
};

// Address validation schema
export const addressSchema = z.object({
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
});
