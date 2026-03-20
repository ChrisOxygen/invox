'use server'

import { redirect } from 'next/navigation'
import { createClient } from '@/shared/lib/supabase/server'
import { prisma } from '@/shared/lib/prisma'

export async function _signIn(
  email: string,
  password: string
): Promise<{ error?: string }> {
  const supabase = await createClient()
  const { data, error } = await supabase.auth.signInWithPassword({ email, password })
  if (error) return { error: error.message }

  const profile = await prisma.profile.findUnique({
    where: { id: data.user.id },
    select: { onboardingDone: true },
  })

  redirect(profile?.onboardingDone === false ? '/onboarding' : '/dashboard')
}

export async function _signUp(
  name: string,
  email: string,
  password: string
): Promise<{ error?: string }> {
  const supabase = await createClient()
  const { error } = await supabase.auth.signUp({
    email,
    password,
    options: {
      data: { full_name: name },
      emailRedirectTo: `${process.env.NEXT_PUBLIC_APP_URL}/auth/callback`,
    },
  })
  if (error) return { error: error.message }
  return {}
}

export async function _signInWithGoogle(): Promise<{ error?: string }> {
  const supabase = await createClient()
  const { data, error } = await supabase.auth.signInWithOAuth({
    provider: 'google',
    options: {
      redirectTo: `${process.env.NEXT_PUBLIC_APP_URL}/auth/callback`,
    },
  })
  if (error) return { error: error.message }
  if (data.url) redirect(data.url)
  return {}
}

export async function _sendResetEmail(
  email: string
): Promise<{ error?: string }> {
  const supabase = await createClient()
  const { error } = await supabase.auth.resetPasswordForEmail(email, {
    redirectTo: `${process.env.NEXT_PUBLIC_APP_URL}/reset-password`,
  })
  if (error) return { error: error.message }
  return {}
}

export async function _resetPassword(
  password: string
): Promise<{ error?: string }> {
  const supabase = await createClient()
  const { error } = await supabase.auth.updateUser({ password })
  if (error) return { error: error.message }
  redirect('/login')
}
