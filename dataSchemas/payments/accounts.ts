import { z } from "zod";
import {
  nigerianBankAccountSchema,
  paypalAccountSchema,
  wiseAccountSchema,
  achAccountSchema,
} from "./gateways";

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

// Type exports
export type CreatePaymentAccountInput = z.infer<
  typeof createPaymentAccountSchema
>;
export type UpdatePaymentAccountInput = z.infer<
  typeof updatePaymentAccountSchema
>;
