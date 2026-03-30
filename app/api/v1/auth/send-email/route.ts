import { NextResponse } from 'next/server'
import { render } from '@react-email/components'
import { resend } from '@/shared/lib/resend'
import { env } from '@/shared/lib/env'
import { VerifyEmail } from '@/emails/VerifyEmail'
import { ResetPasswordEmail } from '@/emails/ResetPasswordEmail'

/**
 * Supabase "Send Email" Auth Hook receiver.
 *
 * Supabase POSTs here instead of sending its own emails.
 * Configured in: Supabase Dashboard → Authentication → Hooks → Send Email
 *
 * Security: verified via Authorization: Bearer <SUPABASE_HOOK_SECRET>
 * This endpoint MUST return 200 — non-200 causes Supabase to retry and can
 * result in duplicate emails. Errors are logged but swallowed.
 */

type EmailActionType =
  | 'signup'
  | 'recovery'
  | 'magiclink'
  | 'email_change_new'
  | 'email_change_current'
  | 'invite'

interface HookPayload {
  user: {
    id: string
    email: string
    user_metadata?: { full_name?: string }
  }
  email_data: {
    token: string
    token_hash: string
    redirect_to: string
    email_action_type: EmailActionType
    site_url: string
    token_new: string
    token_hash_new: string
  }
}

export async function POST(request: Request) {
  // Verify hook secret — prevents anyone from spamming this endpoint
  // Hook secret must be configured; an empty/missing secret always rejects
  const configuredSecret = env.SUPABASE_HOOK_SECRET
  if (!configuredSecret) {
    console.error('[auth/send-email] SUPABASE_HOOK_SECRET is not configured')
    return NextResponse.json({ error: 'Service misconfigured' }, { status: 503 })
  }

  const authHeader = request.headers.get('authorization')
  const secret = authHeader?.replace('Bearer ', '')

  if (!secret || secret !== configuredSecret) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  }

  let payload: HookPayload
  try {
    payload = await request.json()
  } catch {
    return NextResponse.json({ error: 'Invalid payload' }, { status: 400 })
  }

  const { user, email_data } = payload
  const { email_action_type, token_hash, redirect_to, site_url } = email_data

  // Construct the Supabase verification/recovery URL from token data
  const actionUrl = `${site_url}/auth/v1/verify?token=${token_hash}&type=${email_action_type}&redirect_to=${redirect_to}`

  const name = user.user_metadata?.full_name?.split(' ')[0] ?? 'there'

  try {
    if (email_action_type === 'signup') {
      const html = await render(VerifyEmail({ name, verificationUrl: actionUrl }))
      await resend.emails.send({
        from: env.RESEND_FROM_EMAIL,
        to: user.email,
        subject: 'Confirm your email to activate your Invox account',
        html,
      })
    } else if (email_action_type === 'recovery') {
      const html = await render(ResetPasswordEmail({ email: user.email, resetUrl: actionUrl }))
      await resend.emails.send({
        from: env.RESEND_FROM_EMAIL,
        to: user.email,
        subject: 'Reset your Invox password',
        html,
      })
    }
    // magiclink, email_change_*, invite — not handled in this phase
    // returning 200 so Supabase doesn't retry

    return NextResponse.json({ success: true })
  } catch (err) {
    // Log but always return 200 to prevent Supabase retry storms
    console.error('[auth/send-email] Failed to send email:', err)
    return NextResponse.json({ success: false })
  }
}
