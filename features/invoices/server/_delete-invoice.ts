import { prisma } from '@/shared/lib/prisma'
import { AppError, NotFoundError } from '@/shared/lib/api-error'

export async function _deleteInvoice(profileId: string, id: string): Promise<void> {
  const existing = await prisma.invoice.findFirst({
    where: { id, profileId },
    select: { status: true },
  })

  if (!existing) throw new NotFoundError('Invoice not found')

  if (existing.status !== 'DRAFT' && existing.status !== 'CANCELLED') {
    throw new AppError('invoice_not_deletable', 'Only draft or cancelled invoices can be deleted', 403)
  }

  await prisma.invoice.delete({ where: { id } })
}
