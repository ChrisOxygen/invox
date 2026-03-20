import { prisma } from '@/shared/lib/prisma'
import { NotFoundError } from '@/shared/lib/api-error'
import type { InvoiceStatus } from '@/prisma/generated/client/enums'

export async function _updateInvoiceStatus(
  profileId: string,
  id: string,
  status: InvoiceStatus
): Promise<{ id: string; status: InvoiceStatus }> {
  const existing = await prisma.invoice.findFirst({
    where: { id, profileId },
    select: { id: true },
  })

  if (!existing) throw new NotFoundError('Invoice not found')

  const updated = await prisma.invoice.update({
    where: { id },
    data: {
      status,
      ...(status === 'SENT' ? { sentAt: new Date() } : {}),
      ...(status === 'PAID' ? { paidAt: new Date() } : {}),
    },
    select: { id: true, status: true },
  })

  return updated
}
