import { z } from "zod";
import { createOptionalString, createOptionalNumber } from "../base/validation";

// Payment terms enum
export const PaymentTerms = {
  NET_15: "Net 15",
  NET_30: "Net 30",
  NET_45: "Net 45",
  NET_60: "Net 60",
  DUE_ON_RECEIPT: "Due on Receipt",
  CASH_ON_DELIVERY: "Cash on Delivery",
} as const;

const paymentTermsArray = Object.values(PaymentTerms);

// Business settings schema
export const businessSettingsSchema = z.object({
  defaultPaymentTerms: z
    .enum(paymentTermsArray as [string, ...string[]])
    .optional(),
  defaultLateFee: createOptionalNumber(),
  defaultInvoiceNotes: createOptionalString(
    1000,
    "Invoice notes must not exceed 1000 characters"
  ),
});

export type PaymentTerm = (typeof PaymentTerms)[keyof typeof PaymentTerms];
