import { prisma } from '@/shared/lib/prisma'
import { NotFoundError } from '@/shared/lib/api-error'

export async function _deleteAccount(profileId: string): Promise<void> {
  const existing = await prisma.profile.findUnique({
    where: { id: profileId },
    select: { id: true },
  })
  if (!existing) throw new NotFoundError('Profile not found')

  await prisma.profile.delete({ where: { id: profileId } })
}
