export type ClientWithStats = {
  id: string
  profileId: string
  name: string
  email: string | null
  phone: string | null
  address: string | null
  city: string | null
  state: string | null
  country: string | null
  company: string | null
  deletedAt: Date | null
  createdAt: Date
  updatedAt: Date
  _count: { invoices: number }
  totalBilled: number
  totalPaid: number
}

export type ClientWithInvoices = {
  id: string
  profileId: string
  name: string
  email: string | null
  phone: string | null
  address: string | null
  city: string | null
  state: string | null
  country: string | null
  company: string | null
  deletedAt: Date | null
  createdAt: Date
  updatedAt: Date
  invoices: InvoiceHistoryItem[]
}

export type InvoiceHistoryItem = {
  id: string
  invoiceNumber: string
  status: 'DRAFT' | 'SENT' | 'PAID' | 'PARTIAL' | 'OVERDUE' | 'CANCELLED'
  total: number
  issueDate: Date
  dueDate: Date
  currency: string
}
