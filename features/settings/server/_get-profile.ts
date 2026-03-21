import { prisma } from '@/shared/lib/prisma'
import { NotFoundError } from '@/shared/lib/api-error'

export type ProfileData = {
  id: string
  businessName: string | null
  address: string | null
  city: string | null
  state: string | null
  zipCode: string | null
  country: string | null
  phone: string | null
  email: string | null
  website: string | null
  logoUrl: string | null
  brandColor: string | null
  currency: string
  invoicePrefix: string
  taxNumber: string | null
  rcNumber: string | null
}

export async function _getProfile(profileId: string): Promise<ProfileData> {
  const profile = await prisma.profile.findUnique({
    where: { id: profileId },
    select: {
      id: true,
      businessName: true,
      address: true,
      city: true,
      state: true,
      zipCode: true,
      country: true,
      phone: true,
      email: true,
      website: true,
      logoUrl: true,
      brandColor: true,
      currency: true,
      invoicePrefix: true,
      taxNumber: true,
      rcNumber: true,
    },
  })

  if (!profile) throw new NotFoundError('Profile not found')

  return profile
}
