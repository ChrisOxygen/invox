import { prisma } from '@/shared/lib/prisma'
import { NotFoundError } from '@/shared/lib/api-error'
import type { InvoiceStatus, TaxType, DiscountType } from '@/prisma/generated/client/enums'

export type PublicInvoiceItem = {
  id: string
  description: string
  quantity: number
  unitPrice: number
  subtotal: number
}

export type PublicInvoiceProfile = {
  businessName: string | null
  address: string | null
  city: string | null
  state: string | null
  country: string | null
  phone: string | null
  email: string | null
  website: string | null
  logoUrl: string | null
  brandColor: string | null
  taxNumber: string | null
  rcNumber: string | null
  invoicePrefix: string
  currency: string
}

export type PublicInvoiceClient = {
  name: string
  company: string | null
  email: string | null
  phone: string | null
  address: string | null
  city: string | null
  state: string | null
  country: string | null
}

export type PublicInvoice = {
  id: string
  invoiceNumber: string
  status: InvoiceStatus
  issueDate: string
  dueDate: string
  currency: string
  taxRate: number
  taxType: TaxType
  discount: number
  discountType: DiscountType
  subtotal: number
  taxAmount: number
  discountAmount: number
  total: number
  notes: string | null
  client: PublicInvoiceClient
  items: PublicInvoiceItem[]
  profile: PublicInvoiceProfile
}

export async function _getInvoiceByToken(token: string): Promise<PublicInvoice> {
  const now = new Date()

  const invoice = await prisma.invoice.findFirst({
    where: {
      shareToken: token,
      shareTokenExp: { gt: now },
    },
    select: {
      id: true,
      invoiceNumber: true,
      status: true,
      issueDate: true,
      dueDate: true,
      currency: true,
      taxRate: true,
      taxType: true,
      discount: true,
      discountType: true,
      subtotal: true,
      taxAmount: true,
      discountAmount: true,
      total: true,
      notes: true,
      // internalNotes intentionally excluded
      client: {
        select: {
          name: true,
          company: true,
          email: true,
          phone: true,
          address: true,
          city: true,
          state: true,
          country: true,
        },
      },
      items: {
        select: {
          id: true,
          description: true,
          quantity: true,
          unitPrice: true,
          subtotal: true,
        },
      },
      profile: {
        select: {
          businessName: true,
          address: true,
          city: true,
          state: true,
          country: true,
          phone: true,
          email: true,
          website: true,
          logoUrl: true,
          brandColor: true,
          taxNumber: true,
          rcNumber: true,
          invoicePrefix: true,
          currency: true,
        },
      },
    },
  })

  if (!invoice) throw new NotFoundError('Invoice not found or link has expired')

  return {
    ...invoice,
    issueDate: invoice.issueDate.toISOString(),
    dueDate: invoice.dueDate.toISOString(),
  }
}
