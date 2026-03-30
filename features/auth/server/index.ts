'use server'

import { redirect } from 'next/navigation'
import { createClient } from '@/shared/lib/supabase/server'
import { prisma } from '@/shared/lib/prisma'

function friendlyAuthError(message: string): string {
  const m = message.toLowerCase()
  if (m.includes('invalid login credentials') || m.includes('invalid credentials'))
    return 'Wrong email or password. Please try again.'
  if (m.includes('email not confirmed'))
    return 'Please confirm your email address before signing in.'
  if (m.includes('too many requests') || m.includes('rate limit'))
    return 'Too many attempts. Please wait a few minutes and try again.'
  if (m.includes('fetch failed') || m.includes('network') || m.includes('failed to fetch'))
    return 'Connection problem. Please check your internet and try again.'
  if (m.includes('user not found'))
    return 'No account found with that email address.'
  return 'Something went wrong. Please try again.'
}

export async function _signIn(
  email: string,
  password: string
): Promise<{ error?: string }> {
  const supabase = await createClient()
  const { data, error } = await supabase.auth.signInWithPassword({ email, password })
  if (error) return { error: friendlyAuthError(error.message) }

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
      emailRedirectTo: `${process.env.NEXT_PUBLIC_APP_URL}/api/v1/auth/callback`,
    },
  })
  if (error) return { error: friendlyAuthError(error.message) }
  return {}
}

export async function _signInWithGoogle(): Promise<{ error?: string }> {
  const supabase = await createClient()
  const { data, error } = await supabase.auth.signInWithOAuth({
    provider: 'google',
    options: {
      redirectTo: `${process.env.NEXT_PUBLIC_APP_URL}/api/v1/auth/callback`,
    },
  })
  if (error) return { error: friendlyAuthError(error.message) }
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
  if (error) return { error: friendlyAuthError(error.message) }
  return {}
}

export async function _resetPassword(
  password: string
): Promise<{ error?: string }> {
  const supabase = await createClient()
  const { error } = await supabase.auth.updateUser({ password })
  if (error) return { error: friendlyAuthError(error.message) }
  redirect('/login')
}
