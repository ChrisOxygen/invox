import { prisma } from '@/shared/lib/prisma'
import { AppError, NotFoundError } from '@/shared/lib/api-error'
import type { ZUpdateInvoice } from '../schemas'
import type { InvoiceDetail } from '../types'
import { _getInvoiceById } from './_get-invoice-by-id'

export async function _updateInvoice(
  profileId: string,
  id: string,
  data: ZUpdateInvoice
): Promise<InvoiceDetail> {
  const existing = await prisma.invoice.findFirst({
    where: { id, profileId },
    select: { status: true },
  })

  if (!existing) throw new NotFoundError('Invoice not found')
  if (existing.status !== 'DRAFT') {
    throw new AppError('invoice_not_editable', 'Only draft invoices can be edited', 403)
  }

  await prisma.$transaction(async (tx) => {
    await tx.invoice.update({
      where: { id },
      data: {
        ...(data.clientId ? { clientId: data.clientId } : {}),
        ...(data.issueDate ? { issueDate: new Date(data.issueDate) } : {}),
        ...(data.dueDate ? { dueDate: new Date(data.dueDate) } : {}),
        ...(data.currency !== undefined ? { currency: data.currency } : {}),
        ...(data.taxRate !== undefined ? { taxRate: data.taxRate } : {}),
        ...(data.taxType !== undefined ? { taxType: data.taxType } : {}),
        ...(data.discount !== undefined ? { discount: data.discount } : {}),
        ...(data.discountType !== undefined ? { discountType: data.discountType } : {}),
        ...(data.subtotal !== undefined ? { subtotal: data.subtotal } : {}),
        ...(data.taxAmount !== undefined ? { taxAmount: data.taxAmount } : {}),
        ...(data.discountAmount !== undefined ? { discountAmount: data.discountAmount } : {}),
        ...(data.total !== undefined ? { total: data.total } : {}),
        ...(data.notes !== undefined ? { notes: data.notes } : {}),
        ...(data.internalNotes !== undefined ? { internalNotes: data.internalNotes } : {}),
      },
    })

    if (data.items && data.items.length > 0) {
      await tx.invoiceItem.deleteMany({ where: { invoiceId: id } })
      await tx.invoiceItem.createMany({
        data: data.items.map((item) => ({
          invoiceId: id,
          description: item.description,
          quantity: item.quantity,
          unitPrice: item.unitPrice,
          subtotal: item.subtotal,
        })),
      })
    }
  })

  return _getInvoiceById(profileId, id)
}
