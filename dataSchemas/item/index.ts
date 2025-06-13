import { z } from "zod";

// Schema for creating a new item
export const createItemSchema = z.object({
  name: z
    .string()
    .min(1, "Item name is required")
    .max(100, "Item name must be less than 100 characters")
    .trim(),
  description: z
    .string()
    .max(500, "Description must be less than 500 characters")
    .optional()
    .nullable(),
  unitPrice: z
    .number()
    .min(0, "Unit price must be non-negative")
    .optional()
    .nullable(),
});

// Schema for updating an item
export const updateItemSchema = z.object({
  name: z
    .string()
    .min(1, "Item name is required")
    .max(100, "Item name must be less than 100 characters")
    .trim()
    .optional(),
  description: z
    .string()
    .max(500, "Description must be less than 500 characters")
    .optional()
    .nullable(),
  unitPrice: z
    .number()
    .min(0, "Unit price must be non-negative")
    .optional()
    .nullable(),
});
