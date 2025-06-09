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
