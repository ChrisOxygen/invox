import { prisma } from '@/shared/lib/prisma'

export async function _markOverdueInvoices(profileId: string): Promise<{ updatedCount: number }> {
  const result = await prisma.invoice.updateMany({
    where: {
      profileId,
      status: 'SENT',
      dueDate: { lt: new Date() },
    },
    data: { status: 'OVERDUE' },
  })

  return { updatedCount: result.count }
}
