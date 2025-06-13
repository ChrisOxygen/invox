import { createItemSchema, updateItemSchema } from "@/dataSchemas";
import { z } from "zod";

export type CreateItemInput = z.infer<typeof createItemSchema>;
export type UpdateItemInput = z.infer<typeof updateItemSchema>;
