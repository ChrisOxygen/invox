'use server'

import { createClient } from '@/shared/lib/supabase/server'
import { prisma } from '@/shared/lib/prisma'
import { redirect } from 'next/navigation'
import { UnauthorizedError, toErrorMessage } from '@/shared/lib/api-error'

export async function _saveOnboardingStep(data: {
  businessName?: string
  logoUrl?: string
  currency?: string
  invoicePrefix?: string
}): Promise<{ error?: string }> {
  try {
    const supabase = await createClient()
    const {
      data: { user },
      error: authError,
    } = await supabase.auth.getUser()

    if (authError || !user) throw new UnauthorizedError()

    await prisma.profile.update({
      where: { id: user.id },
      data: {
        ...(data.businessName !== undefined && { businessName: data.businessName }),
        ...(data.logoUrl !== undefined && { logoUrl: data.logoUrl }),
        ...(data.currency !== undefined && { currency: data.currency }),
        ...(data.invoicePrefix !== undefined && { invoicePrefix: data.invoicePrefix }),
      },
    })

    return {}
  } catch (err) {
    return { error: toErrorMessage(err) }
  }
}

export async function _createFirstClient(data: {
  name: string
  email?: string
  phone?: string
  company?: string
}): Promise<{ error?: string; clientId?: string }> {
  try {
    const supabase = await createClient()
    const {
      data: { user },
      error: authError,
    } = await supabase.auth.getUser()

    if (authError || !user) throw new UnauthorizedError()

    const client = await prisma.client.create({
      data: {
        profileId: user.id,
        name: data.name,
        email: data.email,
        phone: data.phone,
        company: data.company,
      },
    })

    return { clientId: client.id }
  } catch (err) {
    return { error: toErrorMessage(err) }
  }
}

export async function _completeOnboarding(): Promise<void> {
  const supabase = await createClient()
  const {
    data: { user },
    error: authError,
  } = await supabase.auth.getUser()

  if (authError || !user) throw new UnauthorizedError()

  await prisma.profile.update({
    where: { id: user.id },
    data: { onboardingDone: true },
  })

  redirect('/dashboard')
}
