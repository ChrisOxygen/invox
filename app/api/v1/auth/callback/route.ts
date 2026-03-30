import { createClient } from '@/shared/lib/supabase/server'
import { prisma } from '@/shared/lib/prisma'
import { resend } from '@/shared/lib/resend'
import { env } from '@/shared/lib/env'
import { WelcomeEmail } from '@/emails/WelcomeEmail'
import { NextResponse, type NextRequest } from 'next/server'

export async function GET(request: NextRequest) {
  const { searchParams, origin } = new URL(request.url)
  const code = searchParams.get('code')
  const nextParam = searchParams.get('next')

  if (code) {
    const supabase = await createClient()
    const { error } = await supabase.auth.exchangeCodeForSession(code)

    if (!error) {
      const { data: { user } } = await supabase.auth.getUser()

      if (user) {
        // If next is explicitly provided (e.g. /reset-password for recovery flow), always respect it
        if (nextParam) {
          return NextResponse.redirect(new URL(nextParam, origin))
        }

        // Upsert the profile. When the row is newly created, createdAt === updatedAt
        // (both set in the same DB transaction). On subsequent upserts, update: {} bumps
        // updatedAt, so createdAt !== updatedAt — reliably indicates an existing user
        // without a separate findUnique pre-check (which had a race condition).
        const profile = await prisma.profile.upsert({
          where: { id: user.id },
          create: { id: user.id, authEmail: user.email ?? null },
          update: {},
          select: { onboardingDone: true, createdAt: true, updatedAt: true },
        })

        const isNewUser = profile.createdAt.getTime() === profile.updatedAt.getTime()

        // Send welcome email only on first auth — fire-and-forget, don't block redirect.
        // Guard user.email: OAuth providers (e.g. GitHub private email) can return null.
        if (isNewUser && user.email) {
          const name = user.user_metadata?.full_name?.split(' ')[0] ?? 'there'
          resend.emails
            .send({
              from: 'Chris from Invox <chris@invox.cc>',
              to: user.email,
              subject: 'Welcome to Invox — your account is ready',
              // Use react prop directly — Resend renders it server-side
              react: WelcomeEmail({
                name,
                dashboardUrl: `${env.NEXT_PUBLIC_APP_URL}/onboarding`,
              }),
              text: [
                `Welcome to Invox, ${name}.`,
                '',
                'Your account is live. Set up your profile to start sending professional invoices.',
                '',
                `Get started: ${env.NEXT_PUBLIC_APP_URL}/onboarding`,
                '',
                'What you can do right now:',
                '- Set up your business profile (logo, TIN, RC number, bank account details)',
                '- Add your first client',
                '- Generate a professional PDF invoice',
                '',
                'Built for how Nigerian businesses get paid — bank transfer details on every invoice,',
                'WhatsApp sharing, NGN default currency, and WHT support included.',
                '',
                '— The Invox team',
                '',
                'Questions? Reply to this email.',
              ].join('\n'),
              // Required by Gmail/Yahoo for marketing/onboarding emails
              headers: {
                'List-Unsubscribe': '<mailto:unsubscribe@invox.cc?subject=unsubscribe>',
                'List-Unsubscribe-Post': 'List-Unsubscribe=One-Click',
              },
            })
            .then(({ data, error: sendError }) => {
              if (sendError) {
                console.error('[callback] Failed to send welcome email:', sendError)
              } else {
                console.log('[callback] Welcome email sent', { resendId: data?.id, userId: user.id })
              }
            })
        }

        const destination = profile.onboardingDone === false ? '/onboarding' : '/dashboard'
        return NextResponse.redirect(new URL(destination, origin))
      }
    }
  }

  return NextResponse.redirect(new URL('/login?error=auth', origin))
}
