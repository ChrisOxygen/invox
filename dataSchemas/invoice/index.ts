import { z } from "zod";
import { InvoiceStatus } from "@prisma/client";

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
  total: z.number().min(0, "Total amount cannot be negative"),
});

// Form schema for invoice items array
export const invoiceItemsFormSchema = z.object({
  items: z
    .array(invoiceItemSchema)
    .min(1, "At least one item is required")
    .max(50, "Cannot exceed 50 items per invoice"),
});

// Create invoice schema
export const createInvoiceSchema = z
  .object({
    clientId: z.string().min(1, "Client is required"),
    invoiceNumber: z.string().optional(),
    invoiceDate: z.date({
      required_error: "Invoice date is required",
    }),
    paymentDueDate: z.date({
      required_error: "Payment due date is required",
    }),
    items: z.array(invoiceItemSchema).min(1, "At least one item is required"),
    subtotal: z.number().min(0, "Subtotal must be positive"),
    taxes: z.number().min(0, "Taxes must be positive"),
    discount: z.number().min(0, "Discount must be positive").optional(),
    total: z.number().min(0, "Total must be positive"),
    acceptedPaymentMethods: z.string().min(1, "Payment methods are required"),
    customNote: z.string().optional(),
    lateFeeText: z.string().optional(),
  })
  .refine(
    (data) => {
      // Validate that invoice date is not in the future
      const today = new Date();
      today.setHours(23, 59, 59, 999);
      return data.invoiceDate <= today;
    },
    {
      message: "Invoice date cannot be in the future",
      path: ["invoiceDate"],
    }
  )
  .refine(
    (data) => {
      // Validate that payment due date is after invoice date
      return data.paymentDueDate >= data.invoiceDate;
    },
    {
      message: "Payment due date must be after or equal to invoice date",
      path: ["paymentDueDate"],
    }
  );

// Update invoice schema
export const updateInvoiceSchema = z
  .object({
    invoiceId: z.string().min(1, "Invoice ID is required"),
    clientId: z.string().min(1, "Client is required").optional(),
    invoiceDate: z.date().optional(),
    paymentDueDate: z.date().optional(),
    items: z
      .array(invoiceItemSchema)
      .min(1, "At least one item is required")
      .optional(),
    subtotal: z.number().min(0, "Subtotal must be positive").optional(),
    taxes: z.number().min(0, "Taxes must be positive").optional(),
    discount: z.number().min(0, "Discount must be positive").optional(),
    total: z.number().min(0, "Total must be positive").optional(),
    acceptedPaymentMethods: z
      .string()
      .min(1, "Payment methods are required")
      .optional(),
    customNote: z.string().optional(),
    lateFeeText: z.string().optional(),
  })
  .refine(
    (data) => {
      // If both dates are provided, validate their relationship
      if (data.invoiceDate && data.paymentDueDate) {
        return data.paymentDueDate >= data.invoiceDate;
      }
      return true;
    },
    {
      message: "Payment due date must be after or equal to invoice date",
      path: ["paymentDueDate"],
    }
  );

// Update invoice status schema
export const updateInvoiceStatusSchema = z.object({
  invoiceId: z.string().min(1, "Invoice ID is required"),
  status: z.nativeEnum(InvoiceStatus, {
    required_error: "Status is required",
    invalid_type_error: "Invalid status",
  }),
});

// Invoice filters schema
export const invoiceFiltersSchema = z
  .object({
    status: z.nativeEnum(InvoiceStatus).optional(),
    clientId: z.string().optional(),
    dateFrom: z.date().optional(),
    dateTo: z.date().optional(),
    dueDateFrom: z.date().optional(),
    dueDateTo: z.date().optional(),
    searchQuery: z.string().optional(), // For searching client name or invoice number
  })
  .refine(
    (data) => {
      // Validate date ranges
      if (data.dateFrom && data.dateTo) {
        return data.dateTo >= data.dateFrom;
      }
      return true;
    },
    {
      message: "End date must be after or equal to start date",
      path: ["dateTo"],
    }
  )
  .refine(
    (data) => {
      // Validate due date ranges
      if (data.dueDateFrom && data.dueDateTo) {
        return data.dueDateTo >= data.dueDateFrom;
      }
      return true;
    },
    {
      message: "Due end date must be after or equal to due start date",
      path: ["dueDateTo"],
    }
  );

// Pagination schema
export const paginationSchema = z.object({
  page: z.number().min(1, "Page must be at least 1").optional().default(1),
  limit: z
    .number()
    .min(1, "Limit must be at least 1")
    .max(100, "Limit cannot exceed 100")
    .optional()
    .default(10),
  sortBy: z
    .enum(["invoiceDate", "paymentDueDate", "subtotal", "createdAt"])
    .optional()
    .default("createdAt"),
  sortOrder: z.enum(["asc", "desc"]).optional().default("desc"),
});

// Delete invoice schema
export const deleteInvoiceSchema = z.object({
  invoiceId: z.string().min(1, "Invoice ID is required"),
});

// Input type for creating/updating invoice items
export type InvoiceItemInput = z.infer<typeof invoiceItemSchema>;
export type InvoiceItemsFormInput = z.infer<typeof invoiceItemsFormSchema>;

// Export input types
export type CreateInvoiceInput = z.infer<typeof createInvoiceSchema>;
export type UpdateInvoiceInput = z.infer<typeof updateInvoiceSchema>;
export type UpdateInvoiceStatusInput = z.infer<
  typeof updateInvoiceStatusSchema
>;
export type InvoiceFiltersInput = z.infer<typeof invoiceFiltersSchema>;
export type PaginationInput = z.infer<typeof paginationSchema>;
export type DeleteInvoiceInput = z.infer<typeof deleteInvoiceSchema>;

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
