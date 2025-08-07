import { z } from "zod";
import { InvoiceStatus, TaxType, DiscountType } from "@prisma/client";

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
  // Removed total field - will be calculated on server side
});

// Form schema for invoice items array
export const invoiceItemsFormSchema = z.object({
  items: z
    .array(invoiceItemSchema)
    .min(1, "At least one item is required")
    .max(50, "Cannot exceed 50 items per invoice"),
});

// Create invoice schema with status-based validation
export const createInvoiceSchema = z
  .object({
    clientId: z.string().min(1, "Client is required"),
    businessId: z.string().min(1, "Business is required"),
    invoiceNumber: z.string().optional(),
    invoiceDate: z.date().optional(), // Optional for DRAFT
    paymentDueDate: z.date().optional(), // Optional for DRAFT
    items: z.array(invoiceItemSchema).optional().default([]), // Allow empty array for DRAFT
    tax: z.number().min(0, "Tax must be positive").optional().default(0),
    taxType: z.nativeEnum(TaxType).optional().default(TaxType.PERCENTAGE),
    discount: z
      .number()
      .min(0, "Discount must be positive")
      .optional()
      .default(0),
    discountType: z
      .nativeEnum(DiscountType)
      .optional()
      .default(DiscountType.PERCENTAGE),
    status: z.nativeEnum(InvoiceStatus).optional().default(InvoiceStatus.DRAFT),
    paymentAccountId: z.string().optional(), // Optional payment account
    isFavorite: z.boolean().optional().default(false),
    customNote: z.string().optional(),
    lateFeeTerms: z.string().optional(),
  })
  .refine(
    (data) => {
      // DRAFT status validation - very flexible
      if (data.status === InvoiceStatus.DRAFT) {
        return true; // Allow all fields to be optional/empty for DRAFT
      }
      return true;
    },
    {
      message: "Draft validation passed",
      path: ["status"],
    }
  )
  .refine(
    (data) => {
      // SENT status validation - business ready requirements
      if (data.status === InvoiceStatus.SENT) {
        if (!data.invoiceNumber || !data.invoiceDate || !data.paymentDueDate) {
          return false;
        }
        if (!data.items || data.items.length === 0) {
          return false;
        }
        return true;
      }
      return true;
    },
    {
      message:
        "For SENT status: Invoice number, invoice date, payment due date, and items are required",
      path: ["status"],
    }
  )
  .refine(
    (data) => {
      // PAID status validation - all SENT requirements + paidAt
      if (data.status === InvoiceStatus.PAID) {
        if (!data.invoiceNumber || !data.invoiceDate || !data.paymentDueDate) {
          return false;
        }
        if (!data.items || data.items.length === 0) {
          return false;
        }
        // Note: paidAt will be set automatically when status changes to PAID
        return true;
      }
      return true;
    },
    {
      message: "For PAID status: All SENT requirements must be met",
      path: ["status"],
    }
  )
  .refine(
    (data) => {
      // Validate that invoice date is not in the future (only if provided)
      if (data.invoiceDate) {
        const today = new Date();
        today.setHours(23, 59, 59, 999);
        return data.invoiceDate <= today;
      }
      return true;
    },
    {
      message: "Invoice date cannot be in the future",
      path: ["invoiceDate"],
    }
  )
  .refine(
    (data) => {
      // Validate that payment due date is after invoice date (only if both provided)
      if (data.invoiceDate && data.paymentDueDate) {
        return data.paymentDueDate >= data.invoiceDate;
      }
      return true;
    },
    {
      message: "Payment due date must be after or equal to invoice date",
      path: ["paymentDueDate"],
    }
  )
  .refine(
    (data) => {
      // If tax amount exists, taxType must also exist
      if (data.tax && data.tax > 0) {
        return data.taxType !== undefined;
      }
      return true;
    },
    {
      message: "Tax type is required when tax amount is provided",
      path: ["taxType"],
    }
  )
  .refine(
    (data) => {
      // If discount amount exists, discountType must also exist
      if (data.discount && data.discount > 0) {
        return data.discountType !== undefined;
      }
      return true;
    },
    {
      message: "Discount type is required when discount amount is provided",
      path: ["discountType"],
    }
  );

// Update invoice schema with enhanced status-based validation
export const updateInvoiceSchema = z
  .object({
    invoiceId: z.string().min(1, "Invoice ID is required"),
    clientId: z.string().min(1, "Client is required").optional(),
    businessId: z.string().min(1, "Business is required").optional(),
    invoiceNumber: z.string().optional(),
    invoiceDate: z.date().optional(),
    paymentDueDate: z.date().optional(),
    items: z.array(invoiceItemSchema).optional(),
    tax: z.number().min(0, "Tax must be positive").optional(),
    taxType: z.nativeEnum(TaxType).optional(),
    discount: z.number().min(0, "Discount must be positive").optional(),
    discountType: z.nativeEnum(DiscountType).optional(),
    status: z.nativeEnum(InvoiceStatus).optional(),
    paymentAccountId: z.string().optional(),
    isFavorite: z.boolean().optional(),
    customNote: z.string().optional(),
    lateFeeTerms: z.string().optional(),
  })
  .refine(
    (data) => {
      // DRAFT status validation - very flexible
      if (data.status === InvoiceStatus.DRAFT) {
        return true; // Allow all fields to be optional/empty for DRAFT updates
      }
      return true;
    },
    {
      message: "Draft update validation passed",
      path: ["status"],
    }
  )
  .refine(
    (data) => {
      // SENT status validation when updating to SENT
      if (data.status === InvoiceStatus.SENT) {
        // Note: Application-level validation should ensure the invoice has all required fields
        // before allowing status change to SENT. This includes checking the existing invoice
        // data merged with the update data to ensure completeness.
        return true; // Application-level validation will handle this
      }
      return true;
    },
    {
      message:
        "SENT status requires: invoice number, invoice date, payment due date, and items (validated at application level)",
      path: ["status"],
    }
  )
  .refine(
    (data) => {
      // PAID status validation when updating to PAID
      if (data.status === InvoiceStatus.PAID) {
        // Note: Application should validate all SENT requirements are met
        // and will automatically set paidAt timestamp
        return true; // Application-level validation will handle this
      }
      return true;
    },
    {
      message:
        "PAID status requires all SENT requirements to be met first (validated at application level)",
      path: ["status"],
    }
  )
  .refine(
    (data) => {
      // Validate that invoice date is not in the future (only if provided)
      if (data.invoiceDate) {
        const today = new Date();
        today.setHours(23, 59, 59, 999);
        return data.invoiceDate <= today;
      }
      return true;
    },
    {
      message: "Invoice date cannot be in the future",
      path: ["invoiceDate"],
    }
  )
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
  )
  .refine(
    (data) => {
      // If tax amount exists, taxType must also exist
      if (data.tax && data.tax > 0) {
        return data.taxType !== undefined;
      }
      return true;
    },
    {
      message: "Tax type is required when tax amount is provided",
      path: ["taxType"],
    }
  )
  .refine(
    (data) => {
      // If discount amount exists, discountType must also exist
      if (data.discount && data.discount > 0) {
        return data.discountType !== undefined;
      }
      return true;
    },
    {
      message: "Discount type is required when discount amount is provided",
      path: ["discountType"],
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
export type ZCreateInvoiceInput = z.infer<typeof createInvoiceSchema>;
export type ZUpdateInvoiceInput = z.infer<typeof updateInvoiceSchema>;
export type ZUpdateInvoiceStatusInput = z.infer<
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
