import { z } from 'zod'

export const ZCreateClientSchema = z.object({
  name: z.string().min(1, 'Name is required'),
  email: z.string().optional(),
  phone: z.string().optional(),
  company: z.string().optional(),
  address: z.string().optional(),
  city: z.string().optional(),
  state: z.string().optional(),
  country: z.string().optional(),
})

export const ZUpdateClientSchema = ZCreateClientSchema.extend({
  id: z.string().min(1, 'ID is required'),
})

export type ZCreateClient = z.infer<typeof ZCreateClientSchema>
export type ZUpdateClient = z.infer<typeof ZUpdateClientSchema>
