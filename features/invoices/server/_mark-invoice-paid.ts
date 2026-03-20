import { prisma } from '@/shared/lib/prisma'
import { NotFoundError } from '@/shared/lib/api-error'
import type { ZCreatePayment } from '../schemas'
import type { InvoicePayment } from '../types'

export async function _markInvoicePaid(
  profileId: string,
  invoiceId: string,
  data: ZCreatePayment
): Promise<{ payment: InvoicePayment; invoiceStatus: string; totalPaid: number }> {
  const invoice = await prisma.invoice.findFirst({
    where: { id: invoiceId, profileId },
    select: { id: true, total: true },
  })

  if (!invoice) throw new NotFoundError('Invoice not found')

  const payment = await prisma.payment.create({
    data: {
      invoiceId,
      profileId,
      amount: data.amount,
      datePaid: new Date(data.datePaid),
      method: data.method,
      note: data.note ?? null,
    },
    select: {
      id: true,
      amount: true,
      datePaid: true,
      method: true,
      note: true,
      createdAt: true,
    },
  })

  const allPayments = await prisma.payment.aggregate({
    where: { invoiceId },
    _sum: { amount: true },
  })

  const totalPaid = allPayments._sum.amount ?? 0
  let invoiceStatus: string

  if (totalPaid >= invoice.total) {
    invoiceStatus = 'PAID'
    await prisma.invoice.update({
      where: { id: invoiceId },
      data: { status: 'PAID', paidAt: new Date() },
    })
  } else {
    invoiceStatus = 'PARTIAL'
    await prisma.invoice.update({
      where: { id: invoiceId },
      data: { status: 'PARTIAL' },
    })
  }

  return {
    payment: {
      ...payment,
      datePaid: payment.datePaid.toISOString(),
      createdAt: payment.createdAt.toISOString(),
    },
    invoiceStatus,
    totalPaid,
  }
}
