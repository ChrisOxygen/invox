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
    gatewayType: z.literal("nigerian_bank"),
    accountData: nigerianBankAccountSchema,
  }),
  basePaymentAccountSchema.extend({
    gatewayType: z.literal("wise"),
    accountData: wiseAccountSchema,
  }),
  basePaymentAccountSchema.extend({
    gatewayType: z.literal("ach"),
    accountData: achAccountSchema,
  }),
]);

// For update operations - more flexible since fields are optional
export const updatePaymentAccountSchema = z
  .object({
    gatewayType: z.enum(["paypal", "nigerian_bank", "ach", "wise"]).optional(),
    accountName: z
      .string()
      .min(2, "Account name must be at least 2 characters")
      .max(100, "Account name must not exceed 100 characters")
      .optional(),
    accountData: z
      .union([
        paypalAccountSchema.partial(),
        nigerianBankAccountSchema.partial(),
        wiseAccountSchema.partial(),
        achAccountSchema.partial(),
      ])
      .optional(),
    isActive: z.boolean().optional(),
    isDefault: z.boolean().optional(),
  })
  .refine((data) => Object.keys(data).length > 0, {
    message: "At least one field must be provided for update",
  });

// Alternative update schema with gateway-specific validation
export const updatePaymentAccountWithGatewaySchema = z.union([
  z.object({
    gatewayType: z.literal("paypal"),
    accountName: z
      .string()
      .min(2, "Account name must be at least 2 characters")
      .max(100, "Account name must not exceed 100 characters")
      .optional(),
    accountData: paypalAccountSchema.partial().optional(),
    isActive: z.boolean().optional(),
    isDefault: z.boolean().optional(),
  }),
  z.object({
    gatewayType: z.literal("nigerian_bank"),
    accountName: z
      .string()
      .min(2, "Account name must be at least 2 characters")
      .max(100, "Account name must not exceed 100 characters")
      .optional(),
    accountData: nigerianBankAccountSchema.partial().optional(),
    isActive: z.boolean().optional(),
    isDefault: z.boolean().optional(),
  }),
  z.object({
    gatewayType: z.literal("wise"),
    accountName: z
      .string()
      .min(2, "Account name must be at least 2 characters")
      .max(100, "Account name must not exceed 100 characters")
      .optional(),
    accountData: wiseAccountSchema.partial().optional(),
    isActive: z.boolean().optional(),
    isDefault: z.boolean().optional(),
  }),
  z.object({
    gatewayType: z.literal("ach"),
    accountName: z
      .string()
      .min(2, "Account name must be at least 2 characters")
      .max(100, "Account name must not exceed 100 characters")
      .optional(),
    accountData: achAccountSchema.partial().optional(),
    isActive: z.boolean().optional(),
    isDefault: z.boolean().optional(),
  }),
]);

// Type exports for TypeScript
export type CreatePaymentAccountInput = z.infer<
  typeof createPaymentAccountSchema
>;
export type UpdatePaymentAccountInput = z.infer<
  typeof updatePaymentAccountSchema
>;
export type NigerianBankAccount = z.infer<typeof nigerianBankAccountSchema>;
export type PaypalAccount = z.infer<typeof paypalAccountSchema>;
export type WiseAccount = z.infer<typeof wiseAccountSchema>;
export type AchAccount = z.infer<typeof achAccountSchema>;

// Helper function to validate account data based on gateway type
export const validateAccountDataForGateway = (
  gatewayType: string,
  accountData: unknown
) => {
  switch (gatewayType) {
    case "paypal":
      return paypalAccountSchema.parse(accountData);
    case "nigerian_bank":
      return nigerianBankAccountSchema.parse(accountData);
    case "wise":
      return wiseAccountSchema.parse(accountData);
    case "ach":
      return achAccountSchema.parse(accountData);
    default:
      throw new Error(`Invalid gateway type: ${gatewayType}`);
  }
};
