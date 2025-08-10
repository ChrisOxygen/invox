import { z } from "zod";
import {
  createPaymentAccountSchema,
  updatePaymentAccountSchema,
  nigerianBankAccountSchema,
  paypalAccountSchema,
  wiseAccountSchema,
  achAccountSchema,
} from "@/shared/validators/payment";

// Payment account schema-derived types
export type CreatePaymentAccountInput = z.infer<
  typeof createPaymentAccountSchema
>;
export type UpdatePaymentAccountInput = z.infer<
  typeof updatePaymentAccountSchema
>;

// Gateway-specific types
export type NigerianBankAccount = z.infer<typeof nigerianBankAccountSchema>;
export type PaypalAccount = z.infer<typeof paypalAccountSchema>;
export type WiseAccount = z.infer<typeof wiseAccountSchema>;
export type AchAccount = z.infer<typeof achAccountSchema>;
