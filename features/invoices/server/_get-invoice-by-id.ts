import { prisma } from '@/shared/lib/prisma'
import { NotFoundError } from '@/shared/lib/api-error'
import type { InvoiceDetail } from '../types'

export async function _getInvoiceById(profileId: string, id: string): Promise<InvoiceDetail> {
  const invoice = await prisma.invoice.findFirst({
    where: { id, profileId },
    include: {
      client: {
        select: {
          id: true,
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
      payments: {
        select: {
          id: true,
          amount: true,
          datePaid: true,
          method: true,
          note: true,
          createdAt: true,
        },
        orderBy: { datePaid: 'desc' },
      },
      profile: {
        select: {
          businessName: true,
          invoicePrefix: true,
          currency: true,
        },
      },
    },
  })

  if (!invoice) throw new NotFoundError('Invoice not found')

  return {
    ...invoice,
    issueDate: invoice.issueDate.toISOString(),
    dueDate: invoice.dueDate.toISOString(),
    sentAt: invoice.sentAt?.toISOString() ?? null,
    paidAt: invoice.paidAt?.toISOString() ?? null,
    shareTokenExp: invoice.shareTokenExp?.toISOString() ?? null,
    createdAt: invoice.createdAt.toISOString(),
    updatedAt: invoice.updatedAt.toISOString(),
    payments: invoice.payments.map((p) => ({
      ...p,
      datePaid: p.datePaid.toISOString(),
      createdAt: p.createdAt.toISOString(),
    })),
  }
}
