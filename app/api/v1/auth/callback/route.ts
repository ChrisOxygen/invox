import { createClient } from '@/shared/lib/supabase/server'
import { prisma } from '@/shared/lib/prisma'
import { resend } from '@/shared/lib/resend'
import { env } from '@/shared/lib/env'
import { render } from '@react-email/components'
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

        // Check if profile existed before upsert to detect first-time auth
        const existingProfile = await prisma.profile.findUnique({
          where: { id: user.id },
          select: { id: true },
        })

        const profile = await prisma.profile.upsert({
          where: { id: user.id },
          create: { id: user.id },
          update: {},
          select: { onboardingDone: true },
        })

        // Send welcome email only on first auth (new profile)
        if (!existingProfile) {
          const name = user.user_metadata?.full_name?.split(' ')[0] ?? 'there'
          const html = await render(WelcomeEmail({
            name,
            dashboardUrl: `${env.NEXT_PUBLIC_APP_URL}/onboarding`,
          }))
          resend.emails
            .send({
              from: env.RESEND_FROM_EMAIL,
              to: user.email!,
              subject: 'Welcome to Invox — your account is ready',
              html,
            })
            .catch((err) => console.error('[callback] Failed to send welcome email:', err))
        }

        const destination = profile.onboardingDone === false ? '/onboarding' : '/dashboard'
        return NextResponse.redirect(new URL(destination, origin))
      }
    }
  }

  return NextResponse.redirect(new URL('/login?error=auth', origin))
}
