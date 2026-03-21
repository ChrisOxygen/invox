import { prisma } from '@/shared/lib/prisma'
import { NotFoundError } from '@/shared/lib/api-error'
import type { ZUpdateProfile } from '../schemas'
import type { ProfileData } from './_get-profile'

export async function _updateProfile(
  profileId: string,
  data: ZUpdateProfile
): Promise<ProfileData> {
  const existing = await prisma.profile.findUnique({
    where: { id: profileId },
    select: { id: true },
  })
  if (!existing) throw new NotFoundError('Profile not found')

  const updateData: Record<string, unknown> = {}
  if (data.businessName !== undefined) updateData.businessName = data.businessName
  if (data.address !== undefined) updateData.address = data.address
  if (data.city !== undefined) updateData.city = data.city
  if (data.state !== undefined) updateData.state = data.state
  if (data.zipCode !== undefined) updateData.zipCode = data.zipCode
  if (data.country !== undefined) updateData.country = data.country
  if (data.phone !== undefined) updateData.phone = data.phone
  if (data.email !== undefined) updateData.email = data.email || null
  if (data.website !== undefined) updateData.website = data.website || null
  if (data.taxNumber !== undefined) updateData.taxNumber = data.taxNumber
  if (data.rcNumber !== undefined) updateData.rcNumber = data.rcNumber
  if (data.logoUrl !== undefined) updateData.logoUrl = data.logoUrl
  if (data.brandColor !== undefined) updateData.brandColor = data.brandColor
  if (data.currency !== undefined) updateData.currency = data.currency
  if (data.invoicePrefix !== undefined) updateData.invoicePrefix = data.invoicePrefix

  const profile = await prisma.profile.update({
    where: { id: profileId },
    data: updateData,
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

  return profile
}
