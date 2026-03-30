import { createClient } from '@/shared/lib/supabase/server'
import { prisma } from '@/shared/lib/prisma'
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

        const profile = await prisma.profile.upsert({
          where: { id: user.id },
          create: { id: user.id },
          update: {},
          select: { onboardingDone: true },
        })

        const destination = profile.onboardingDone === false ? '/onboarding' : '/dashboard'
        return NextResponse.redirect(new URL(destination, origin))
      }
    }
  }

  return NextResponse.redirect(new URL('/login?error=auth', origin))
}
