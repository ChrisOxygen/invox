import { z } from "zod";

// Client creation schema
export const createClientSchema = z.object({
  BusinessName: z
    .string()
    .min(1, "Business name is required")
    .max(100, "Business name too long"),
  email: z.string().email("Invalid email address"),
  contactPersonName: z.string().optional(),
  phone: z.string().optional(),
  address: z.string().optional(),
  city: z.string().optional(),
  state: z.string().optional(),
  zipCode: z.string().optional(),
  country: z.string().optional(),
});

// Client update schema
export const updateClientSchema = createClientSchema.partial();

// Inferred types with Z prefix for local use
export type ZCreateClientInput = z.infer<typeof createClientSchema>;
export type ZUpdateClientInput = z.infer<typeof updateClientSchema>;
