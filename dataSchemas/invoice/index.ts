import { z } from "zod";

// Base invoice item schema
export const invoiceItemSchema = z.object({
  id: z.string().optional(), // Optional for new items
  description: z
    .string()
    .min(1, "Description is required")
    .max(200, "Description must not exceed 200 characters"),
  quantity: z
    .number()
    .min(1, "Quantity must be at least 1")
    .max(9999, "Quantity cannot exceed 9999"),
  unitPrice: z
    .number()
    .min(0.01, "Unit price must be at least $0.01")
    .max(999999.99, "Unit price cannot exceed $999,999.99"),
  totalAmount: z.number().min(0, "Total amount cannot be negative"),
});

// Form schema for invoice items array
export const invoiceItemsFormSchema = z.object({
  items: z
    .array(invoiceItemSchema)
    .min(1, "At least one item is required")
    .max(50, "Cannot exceed 50 items per invoice"),
});

// Input type for creating/updating invoice items
export type InvoiceItemInput = z.infer<typeof invoiceItemSchema>;
export type InvoiceItemsFormInput = z.infer<typeof invoiceItemsFormSchema>;

// Item description options for searchable dropdown
export const commonItemDescriptions = [
  "Consulting Services",
  "Design Services",
  "Development Services",
  "Project Management",
  "Content Writing",
  "SEO Services",
  "Marketing Consultation",
  "Data Analysis",
  "Training Session",
  "Technical Support",
  "Website Maintenance",
  "Logo Design",
  "Graphic Design",
  "Video Editing",
  "Photography Session",
  "Translation Services",
  "Legal Consultation",
  "Accounting Services",
  "Software License",
  "Hardware Setup",
] as const;

export type CommonItemDescription = (typeof commonItemDescriptions)[number];
