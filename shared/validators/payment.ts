import { z } from "zod";
import { PaymentGatewayType } from "@prisma/client";

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

// Discriminated union for create operation using Prisma enum values
export const createPaymentAccountSchema = z.discriminatedUnion("gatewayType", [
  basePaymentAccountSchema.extend({
    gatewayType: z.literal(PaymentGatewayType.PAYPAL),
    accountData: paypalAccountSchema,
  }),
  basePaymentAccountSchema.extend({
    gatewayType: z.literal(PaymentGatewayType.WISE),
    accountData: wiseAccountSchema,
  }),
  basePaymentAccountSchema.extend({
    gatewayType: z.literal(PaymentGatewayType.NIGERIAN_BANK),
    accountData: nigerianBankAccountSchema,
  }),
  basePaymentAccountSchema.extend({
    gatewayType: z.literal(PaymentGatewayType.ACH),
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

// Gateway type validation using Prisma enum
export const gatewayTypeSchema = z.nativeEnum(PaymentGatewayType);

// Editable payment account schema for updates
export const editablePaymentAccountSchema = z.object({
  accountName: z.string().min(2, "Account name must be at least 2 characters"),
  accountData: z.record(z.any()),
});

// Type exports
export type ZCreatePaymentAccountInput = z.infer<
  typeof createPaymentAccountSchema
>;
export type ZUpdatePaymentAccountInput = z.infer<
  typeof updatePaymentAccountSchema
>;
export type EditablePaymentAccountData = z.infer<
  typeof editablePaymentAccountSchema
>;

export type GatewayTypeInput = z.infer<typeof gatewayTypeSchema>;

// Gateway-specific data types
export type ZNigerianBankAccountData = z.infer<
  typeof nigerianBankAccountSchema
>;
export type ZPaypalAccountData = z.infer<typeof paypalAccountSchema>;
export type ZWiseAccountData = z.infer<typeof wiseAccountSchema>;
export type ZAchAccountData = z.infer<typeof achAccountSchema>;
