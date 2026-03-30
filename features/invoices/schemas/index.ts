import { z } from 'zod'

export const ZInvoiceItemSchema = z.object({
  description: z.string().min(1, 'Description is required'),
  quantity: z.number().positive('Quantity must be positive'),
  unitPrice: z.number().min(0, 'Unit price must be non-negative'),
  subtotal: z.number().min(0),
})

export const ZCreateInvoiceSchema = z.object({
  clientId: z.string().min(1, 'Client is required'),
  issueDate: z.string().min(1, 'Issue date is required'),
  dueDate: z.string().min(1, 'Due date is required'),
  currency: z.string().default('NGN'),
  taxRate: z.number().min(0).max(100).default(0),
  taxType: z.enum(['PERCENTAGE', 'FIXED']).default('PERCENTAGE'),
  discount: z.number().min(0).default(0),
  discountType: z.enum(['PERCENTAGE', 'FIXED']).default('PERCENTAGE'),
  subtotal: z.number().min(0).default(0),
  taxAmount: z.number().min(0).default(0),
  discountAmount: z.number().min(0).default(0),
  total: z.number().min(0).default(0),
  notes: z.string().optional(),
  internalNotes: z.string().optional(),
  items: z.array(ZInvoiceItemSchema).min(1, 'At least one item is required'),
})

// Form-only schema — omits server-computed totals so the resolver has no input/output mismatch
export const ZInvoiceFormInputSchema = ZCreateInvoiceSchema.omit({
  subtotal: true,
  taxAmount: true,
  discountAmount: true,
  total: true,
})

export const ZUpdateInvoiceSchema = ZCreateInvoiceSchema.extend({
  id: z.string().min(1),
}).partial({ items: true, clientId: true, issueDate: true, dueDate: true })

export const ZCreatePaymentSchema = z.object({
  amount: z.number().positive('Amount must be greater than 0'),
  datePaid: z.string().min(1, 'Date is required'),
  method: z.enum(['BANK_TRANSFER', 'CASH', 'PAYPAL', 'WISE', 'PAYSTACK', 'FLUTTERWAVE', 'OTHER']),
  note: z.string().optional(),
})

export const ZUpdateInvoiceStatusSchema = z.object({
  status: z.enum(['DRAFT', 'SENT', 'PAID', 'PARTIAL', 'OVERDUE', 'CANCELLED']),
})

export type ZCreateInvoice = z.infer<typeof ZCreateInvoiceSchema>
export type ZUpdateInvoice = z.infer<typeof ZUpdateInvoiceSchema>
export type ZInvoiceFormInput = z.input<typeof ZInvoiceFormInputSchema>
export type ZCreatePayment = z.infer<typeof ZCreatePaymentSchema>
export type ZInvoiceItem = z.infer<typeof ZInvoiceItemSchema>
export type ZUpdateInvoiceStatus = z.infer<typeof ZUpdateInvoiceStatusSchema>
