import * as z from "zod";

export const editablePaymentAccountSchema = z.object({
  accountName: z.string().min(2, "Account name must be at least 2 characters"),
  accountData: z.record(z.string()),
});

export type EditablePaymentAccountData = z.infer<
  typeof editablePaymentAccountSchema
>;
