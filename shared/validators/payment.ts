import * as z from "zod";

// Base payment account schema
export const basePaymentAccountSchema = z.object({
  gatewayType: z.enum(["stripe", "paypal", "bank"]),
  accountName: z.string().min(2, "Account name must be at least 2 characters"),
  accountData: z.record(z.string()),
  isActive: z.boolean().optional(),
});

// Payment account creation schema
export const createPaymentAccountSchema = basePaymentAccountSchema.required({
  gatewayType: true,
  accountName: true,
  accountData: true,
});

// Payment account update schema
export const updatePaymentAccountSchema = basePaymentAccountSchema
  .partial()
  .refine((data) => Object.keys(data).length > 0, {
    message: "At least one field must be provided for update",
  });

// Editable payment account schema (for account management)
export const editablePaymentAccountSchema = z.object({
  accountName: z.string().min(2, "Account name must be at least 2 characters"),
  accountData: z.record(z.string()),
});

// Payment method details for onboarding
export const paymentMethodDetailsSchema = z.object({
  stripe: z
    .object({
      publicKey: z.string().optional(),
      secretKey: z.string().optional(),
      webhookSecret: z.string().optional(),
    })
    .optional(),
  paypal: z
    .object({
      clientId: z.string().optional(),
      clientSecret: z.string().optional(),
      environment: z.enum(["sandbox", "production"]).optional(),
    })
    .optional(),
  bank: z
    .object({
      accountName: z.string().optional(),
      accountNumber: z.string().optional(),
      routingNumber: z.string().optional(),
      bankName: z.string().optional(),
    })
    .optional(),
});

// Payment rules schema
export const paymentRulesSchema = z.object({
  acceptCreditCards: z.boolean().optional(),
  acceptPayPal: z.boolean().optional(),
  acceptBankTransfers: z.boolean().optional(),
  defaultPaymentTerms: z.string().optional(),
  lateFeePercentage: z.number().min(0).max(100).optional(),
  gracePeriodDays: z.number().min(0).optional(),
});

// Type exports
export type CreatePaymentAccountData = z.infer<
  typeof createPaymentAccountSchema
>;
export type UpdatePaymentAccountData = z.infer<
  typeof updatePaymentAccountSchema
>;
export type EditablePaymentAccountData = z.infer<
  typeof editablePaymentAccountSchema
>;
export type PaymentMethodDetailsData = z.infer<
  typeof paymentMethodDetailsSchema
>;
export type PaymentRulesData = z.infer<typeof paymentRulesSchema>;
export type BasePaymentAccountData = z.infer<typeof basePaymentAccountSchema>;
