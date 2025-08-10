import { z } from "zod";

// Gateway-specific validation schemas
export const nigerianBankAccountSchema = z.object({
  bankName: z.string().min(2, "Bank name is required"),
  accountNumber: z
    .string()
    .length(10, "Nigerian bank account number must be 10 digits")
    .regex(/^\d+$/, "Account number must contain only digits"),
  accountName: z.string().min(2, "Account holder name is required"),
});

export const paypalAccountSchema = z.object({
  email: z.string().email("Valid PayPal email is required"),
});

export const wiseAccountSchema = z.object({
  email: z.string().email("Valid Wise email is required"),
});

export const achAccountSchema = z.object({
  routingNumber: z
    .string()
    .length(9, "Routing number must be 9 digits")
    .regex(/^\d+$/, "Routing number must contain only digits"),
  accountNumber: z
    .string()
    .min(4, "Account number must be at least 4 digits")
    .max(17, "Account number must not exceed 17 digits")
    .regex(/^\d+$/, "Account number must contain only digits"),
  accountType: z.enum(["checking", "savings"]),
  bankName: z.string().min(2, "Bank name is required"),
});

// Base schema for common fields
const basePaymentAccountSchema = z.object({
  accountName: z
    .string()
    .min(2, "Account name must be at least 2 characters")
    .max(100, "Account name must not exceed 100 characters"),
  isActive: z.boolean().optional(),
  isDefault: z.boolean().optional(),
});

// Discriminated union for create operation
export const createPaymentAccountSchema = z.discriminatedUnion("gatewayType", [
  basePaymentAccountSchema.extend({
    gatewayType: z.literal("paypal"),
    accountData: paypalAccountSchema,
  }),
  basePaymentAccountSchema.extend({
    gatewayType: z.literal("wise"),
    accountData: wiseAccountSchema,
  }),
  basePaymentAccountSchema.extend({
    gatewayType: z.literal("nigerian-bank"),
    accountData: nigerianBankAccountSchema,
  }),
  basePaymentAccountSchema.extend({
    gatewayType: z.literal("bank-transfer"),
    accountData: achAccountSchema,
  }),
]);

// Update schema for payment accounts
export const updatePaymentAccountSchema = z.object({
  accountName: z
    .string()
    .min(2, "Account name must be at least 2 characters")
    .max(100, "Account name must not exceed 100 characters")
    .optional(),
  isActive: z.boolean().optional(),
  isDefault: z.boolean().optional(),
  accountData: z.record(z.any()).optional(),
});

// Legacy compatibility schemas (keeping for backward compatibility)
export const legacyBasePaymentAccountSchema = z.object({
  gatewayType: z.enum(["stripe", "paypal", "bank"]),
  accountName: z.string().min(2, "Account name must be at least 2 characters"),
  accountData: z.record(z.string()),
  isActive: z.boolean().optional(),
});

export const legacyCreatePaymentAccountSchema =
  legacyBasePaymentAccountSchema.required({
    gatewayType: true,
    accountName: true,
    accountData: true,
  });

export const legacyUpdatePaymentAccountSchema = legacyBasePaymentAccountSchema
  .partial()
  .refine((data) => Object.keys(data).length > 0, {
    message: "At least one field must be provided for update",
  });

export const editablePaymentAccountSchema = z.object({
  accountName: z.string().min(2, "Account name must be at least 2 characters"),
  accountData: z.record(z.string()),
});

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

export const paymentRulesSchema = z.object({
  acceptCreditCards: z.boolean().optional(),
  acceptPayPal: z.boolean().optional(),
  acceptBankTransfers: z.boolean().optional(),
  defaultPaymentTerms: z.string().optional(),
  lateFeePercentage: z.number().min(0).max(100).optional(),
  gracePeriodDays: z.number().min(0).optional(),
});

// Type exports
export type CreatePaymentAccountInput = z.infer<
  typeof createPaymentAccountSchema
>;
export type UpdatePaymentAccountInput = z.infer<
  typeof updatePaymentAccountSchema
>;
export type CreatePaymentAccountData = z.infer<
  typeof legacyCreatePaymentAccountSchema
>;
export type UpdatePaymentAccountData = z.infer<
  typeof legacyUpdatePaymentAccountSchema
>;
export type EditablePaymentAccountData = z.infer<
  typeof editablePaymentAccountSchema
>;
export type PaymentMethodDetailsData = z.infer<
  typeof paymentMethodDetailsSchema
>;
export type PaymentRulesData = z.infer<typeof paymentRulesSchema>;
export type BasePaymentAccountData = z.infer<
  typeof legacyBasePaymentAccountSchema
>;
