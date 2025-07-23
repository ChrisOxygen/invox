import * as z from "zod";

export const editableBusinessSchema = z.object({
  addressLine1: z.string().optional(),
  addressLine2: z.string().optional(),
  city: z.string().optional(),
  state: z.string().optional(),
  zipCode: z.string().optional(),
  phone: z.string().optional(),
});

export type EditableBusinessData = z.infer<typeof editableBusinessSchema>;
