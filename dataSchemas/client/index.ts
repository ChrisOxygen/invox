import { z } from "zod";

// Client validation schemas
export const createClientSchema = z.object({
  BusinessName: z.string().min(1, "Business name is required").max(255),
  contactPersonName: z.string().optional(),
  address: z.string().optional(),
  email: z.string().email("Invalid email format"),
});

export const updateClientSchema = z.object({
  BusinessName: z
    .string()
    .min(1, "Business name is required")
    .max(255)
    .optional(),
  contactPersonName: z.string().optional(),
  address: z.string().optional(),
  email: z.string().email("Invalid email format").optional(),
});

export const clientIdSchema = z.string().min(1, "Client ID is required");
