import { prisma } from '@/shared/lib/prisma'
import { NotFoundError } from '@/shared/lib/api-error'
import { generateShareToken } from '@/shared/lib/utils'

export async function _generateShareToken(
  profileId: string,
  invoiceId: string
): Promise<{ shareToken: string; shareTokenExp: string }> {
  const existing = await prisma.invoice.findFirst({
    where: { id: invoiceId, profileId },
    select: { id: true },
  })

  if (!existing) throw new NotFoundError('Invoice not found')

  const shareToken = generateShareToken()
  const shareTokenExp = new Date(Date.now() + 30 * 24 * 60 * 60 * 1000) // +30 days

  await prisma.invoice.update({
    where: { id: invoiceId },
    data: { shareToken, shareTokenExp },
  })

  return { shareToken, shareTokenExp: shareTokenExp.toISOString() }
}
