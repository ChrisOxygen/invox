import { z } from 'zod'

export const ZUpdateBusinessInfoSchema = z.object({
  businessName: z.string().optional(),
  address: z.string().optional(),
  city: z.string().optional(),
  state: z.string().optional(),
  zipCode: z.string().optional(),
  country: z.string().optional(),
  phone: z.string().optional(),
  email: z.union([z.literal(''), z.email()]).optional(),
  website: z.union([z.literal(''), z.url()]).optional(),
  taxNumber: z.string().optional(),
  rcNumber: z.string().optional(),
})

export const ZUpdateBrandingSchema = z.object({
  logoUrl: z.string().optional(),
  brandColor: z
    .string()
    .regex(/^#[0-9A-Fa-f]{6}$/, 'Must be a valid hex color')
    .optional(),
})

export const ZUpdateInvoiceDefaultsSchema = z.object({
  currency: z.enum(['NGN', 'USD', 'GBP', 'EUR', 'CAD', 'AUD']).optional(),
  invoicePrefix: z
    .string()
    .min(1)
    .max(10)
    .regex(/^[A-Z0-9-]+$/i, 'Only letters, numbers, and hyphens allowed')
    .optional(),
})

export const ZUpdatePasswordSchema = z
  .object({
    currentPassword: z.string().min(8, 'Must be at least 8 characters'),
    newPassword: z.string().min(8, 'Must be at least 8 characters'),
    confirmPassword: z.string().min(8, 'Must be at least 8 characters'),
  })
  .refine((data) => data.newPassword === data.confirmPassword, {
    message: 'Passwords do not match',
    path: ['confirmPassword'],
  })

export const ZUpdateProfileSchema = z.object({
  businessName: z.string().optional(),
  address: z.string().optional(),
  city: z.string().optional(),
  state: z.string().optional(),
  zipCode: z.string().optional(),
  country: z.string().optional(),
  phone: z.string().optional(),
  email: z.union([z.literal(''), z.email()]).optional(),
  website: z.union([z.literal(''), z.url()]).optional(),
  taxNumber: z.string().optional(),
  rcNumber: z.string().optional(),
  logoUrl: z.string().optional(),
  brandColor: z
    .string()
    .regex(/^#[0-9A-Fa-f]{6}$/, 'Must be a valid hex color')
    .optional(),
  currency: z.enum(['NGN', 'USD', 'GBP', 'EUR', 'CAD', 'AUD']).optional(),
  invoicePrefix: z
    .string()
    .min(1)
    .max(10)
    .regex(/^[A-Z0-9-]+$/i, 'Only letters, numbers, and hyphens allowed')
    .optional(),
})

export type ZUpdateBusinessInfo = z.infer<typeof ZUpdateBusinessInfoSchema>
export type ZUpdateBranding = z.infer<typeof ZUpdateBrandingSchema>
export type ZUpdateInvoiceDefaults = z.infer<typeof ZUpdateInvoiceDefaultsSchema>
export type ZUpdatePassword = z.infer<typeof ZUpdatePasswordSchema>
export type ZUpdateProfile = z.infer<typeof ZUpdateProfileSchema>
