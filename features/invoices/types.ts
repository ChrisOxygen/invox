import type { InvoiceStatus, TaxType, DiscountType, PaymentMethod } from '@/prisma/generated/client/enums'

export type { InvoiceStatus, TaxType, DiscountType, PaymentMethod }

export type InvoiceListItem = {
  id: string
  invoiceNumber: string
  status: InvoiceStatus
  total: number
  subtotal: number
  currency: string
  issueDate: string
  dueDate: string
  createdAt: string
  client: {
    id: string
    name: string
    company: string | null
    email: string | null
  }
}

export type InvoicePayment = {
  id: string
  amount: number
  datePaid: string
  method: PaymentMethod
  note: string | null
  createdAt: string
}

export type InvoiceDetailItem = {
  id: string
  description: string
  quantity: number
  unitPrice: number
  subtotal: number
}

export type InvoiceDetail = {
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
  internalNotes: string | null
  shareToken: string | null
  shareTokenExp: string | null
  sentAt: string | null
  paidAt: string | null
  createdAt: string
  updatedAt: string
  client: {
    id: string
    name: string
    company: string | null
    email: string | null
    phone: string | null
    address: string | null
    city: string | null
    state: string | null
    country: string | null
  }
  items: InvoiceDetailItem[]
  payments: InvoicePayment[]
  profile: {
    businessName: string | null
    invoicePrefix: string
    currency: string
  }
}

export type InvoiceFilters = {
  status?: InvoiceStatus | 'ALL'
  search?: string
  page?: number
  pageSize?: number
}
