import { NextResponse } from 'next/server'
import { Webhook } from 'standardwebhooks'
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
 * Security: verified via Standard Webhooks (webhook-id, webhook-timestamp, webhook-signature headers).
 * The hook secret in the Supabase dashboard has the format: v1,whsec_<base64>
 * Strip the "v1,whsec_" prefix — the Webhook class expects only the base64 portion.
 *
 * IMPORTANT: This endpoint always returns 200. Non-200 responses cause Supabase
 * to retry the hook, which can block auth flows or trigger duplicate emails.
 * Auth/config failures are logged but still return 200 (no email is sent).
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
  // If the hook secret isn't configured, skip silently — returning non-200
  // would cause Supabase to retry and block the auth flow.
  const configuredSecret = env.SUPABASE_HOOK_SECRET
  if (!configuredSecret) {
    console.warn('[auth/send-email] SUPABASE_HOOK_SECRET is not set — skipping email send')
    return NextResponse.json({ success: false })
  }

  // Supabase uses Standard Webhooks — read the raw body for signature verification
  const rawBody = await request.text()
  const headers = Object.fromEntries(request.headers)

  // The secret from Supabase dashboard is "v1,whsec_<base64>" — strip the prefix
  const base64Secret = configuredSecret.replace(/^v1,whsec_/, '')
  const wh = new Webhook(base64Secret)

  let payload: HookPayload
  try {
    payload = wh.verify(rawBody, headers) as HookPayload
  } catch (err) {
    console.warn('[auth/send-email] Webhook signature verification failed:', err)
    return NextResponse.json({ success: false })
  }

  const { user, email_data } = payload
  const { email_action_type, token_hash, redirect_to, site_url } = email_data

  // URL-encode redirect_to so special chars (?, &, etc.) don't corrupt the URL
  const actionUrl = `${site_url}/auth/v1/verify?token=${token_hash}&type=${email_action_type}&redirect_to=${encodeURIComponent(redirect_to)}`

  const name = user.user_metadata?.full_name?.split(' ')[0] ?? 'there'

  try {
    if (email_action_type === 'signup') {
      const { data, error } = await resend.emails.send({
        from: env.RESEND_FROM_EMAIL,
        to: user.email,
        subject: 'Confirm your email to activate your Invox account',
        react: VerifyEmail({ name, verificationUrl: actionUrl }),
        text: [
          `Hi ${name},`,
          '',
          "You're almost there. Click the link below to verify your email and activate your Invox account.",
          '',
          `Confirm email address: ${actionUrl}`,
          '',
          'This link expires in 24 hours. After that, you can request a new one from the login page.',
          '',
          "If you didn't create an Invox account, you can safely ignore this email.",
        ].join('\n'),
        // token_hash is unique per send attempt — prevents duplicate sends on Supabase retries
        headers: { 'Idempotency-Key': token_hash },
      })
      if (error) throw error
      console.log('[auth/send-email] Verification email sent', { resendId: data?.id, userId: user.id })
    } else if (email_action_type === 'recovery') {
      const { data, error } = await resend.emails.send({
        from: env.RESEND_FROM_EMAIL,
        to: user.email,
        subject: 'Reset your Invox password',
        react: ResetPasswordEmail({ email: user.email, resetUrl: actionUrl }),
        text: [
          'Reset your Invox password',
          '',
          `We received a request to reset the password for the Invox account registered to: ${user.email}`,
          '',
          `Reset my password: ${actionUrl}`,
          '',
          'This link expires in 1 hour. After that, you will need to request a new reset from the login page.',
          '',
          "Didn't request this? You can safely ignore this email — your password won't change.",
          '',
          'Locked out or need help? Email support@invox.cc',
        ].join('\n'),
        headers: { 'Idempotency-Key': token_hash },
      })
      if (error) throw error
      console.log('[auth/send-email] Password reset email sent', { resendId: data?.id, userId: user.id })
    }
    // magiclink, email_change_*, invite — not handled in this phase

    return NextResponse.json({ success: true })
  } catch (err) {
    // Log but always return 200 to prevent Supabase retry storms
    console.error('[auth/send-email] Failed to send email:', err)
    return NextResponse.json({ success: false })
  }
}
