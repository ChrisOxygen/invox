import { NextResponse } from 'next/server'
import { resend } from '@/shared/lib/resend'
import { env } from '@/shared/lib/env'
import { prisma } from '@/shared/lib/prisma'

/**
 * Resend webhook receiver — handles delivery events for all outgoing emails.
 *
 * Setup:
 *   1. Resend Dashboard → Webhooks → Add Endpoint
 *   2. URL: https://your-domain.com/api/v1/webhooks/resend
 *   3. Subscribe to: email.bounced, email.complained, email.delivered
 *   4. Copy the Signing Secret (whsec_...) → RESEND_WEBHOOK_SECRET in .env
 *
 * Why this matters: sending to bounced or complained addresses damages sender
 * reputation and can get the invox.cc domain blacklisted by Gmail/Yahoo.
 *
 * Note: as of 2024, Resend fires one event per recipient — data.to always
 * contains exactly one address per webhook call.
 */

// Full event type list as of 2025 (Resend uses svix under the hood)
type ResendWebhookEventType =
  | 'email.sent'
  | 'email.delivered'
  | 'email.delivery_delayed'
  | 'email.bounced'
  | 'email.complained'
  | 'email.opened'
  | 'email.clicked'
  | 'email.failed'
  | 'email.scheduled'
  | 'email.received'
  | 'email.suppressed'

interface ResendWebhookEvent {
  type: ResendWebhookEventType
  data: {
    email_id: string
    from: string
    // Since 2024: one address per event (array kept for backwards compatibility)
    to: string[]
    subject: string
    created_at: string
    bounce?: { message: string }
  }
}

export async function POST(request: Request) {
  const signingSecret = env.RESEND_WEBHOOK_SECRET
  if (!signingSecret) {
    console.warn('[webhooks/resend] RESEND_WEBHOOK_SECRET is not set — webhook disabled')
    return NextResponse.json({ error: 'Webhook not configured' }, { status: 503 })
  }

  // Must read raw text — never req.json(). Re-serializing JSON changes whitespace
  // and breaks the HMAC signature that svix computed over the original bytes.
  const payload = await request.text()

  const svixId = request.headers.get('svix-id')
  const svixTimestamp = request.headers.get('svix-timestamp')
  const svixSignature = request.headers.get('svix-signature')

  if (!svixId || !svixTimestamp || !svixSignature) {
    return NextResponse.json({ error: 'Missing svix headers' }, { status: 400 })
  }

  let event: ResendWebhookEvent
  try {
    // resend.webhooks.verify() is the Resend SDK's native helper — wraps svix
    // and automatically enforces the 5-minute replay-attack window.
    event = resend.webhooks.verify({
      payload,
      headers: {
        id: svixId,
        timestamp: svixTimestamp,
        signature: svixSignature,
      },
      webhookSecret: signingSecret,
    }) as ResendWebhookEvent
  } catch (err) {
    console.error('[webhooks/resend] Signature verification failed:', err)
    return NextResponse.json({ error: 'Invalid signature' }, { status: 400 })
  }

  const { type, data } = event
  const recipientEmail = data.to[0]

  console.log('[webhooks/resend] Event received', {
    type,
    emailId: data.email_id,
    to: recipientEmail,
    subject: data.subject,
  })

  try {
    switch (type) {
      case 'email.bounced': {
        // Hard bounce — this address is undeliverable. Flag the profile so we
        // stop sending to it and protect our sender reputation.
        console.warn('[webhooks/resend] Hard bounce', {
          emailId: data.email_id,
          to: recipientEmail,
          bounceMessage: data.bounce?.message,
        })

        // authEmail is stored on profile creation (callback route) so we can
        // look up who this belongs to from the Resend recipient address.
        await prisma.profile.updateMany({
          where: { authEmail: recipientEmail },
          data: { emailBounced: true },
        })
        break
      }

      case 'email.complained': {
        // Spam complaint — unsubscribe immediately to stay CAN-SPAM/GDPR compliant.
        console.warn('[webhooks/resend] Spam complaint', {
          emailId: data.email_id,
          to: recipientEmail,
        })

        await prisma.profile.updateMany({
          where: { authEmail: recipientEmail },
          data: { emailUnsubscribed: true },
        })
        break
      }

      case 'email.delivered':
        // Logged above — no further action needed
        break

      default:
        // opened, clicked, etc. — ignore for now
        break
    }

    return NextResponse.json({ received: true })
  } catch (err) {
    console.error('[webhooks/resend] Failed to process event:', err)
    // Return 200 so Resend doesn't retry — error is logged for investigation
    return NextResponse.json({ received: false })
  }
}
