import { createClientSchema, updateClientSchema } from "@/dataSchemas/client";
import { z } from "zod";

// Schema-derived types
export type CreateClientInput = z.infer<typeof createClientSchema>;
export type UpdateClientInput = z.infer<typeof updateClientSchema>;
