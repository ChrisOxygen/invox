import { NextResponse } from 'next/server'
import { createClient } from '@/shared/lib/supabase/server'
import { prisma } from '@/shared/lib/prisma'
import { rateLimit } from '@/shared/lib/rate-limit'

export async function POST() {
  const supabase = await createClient()
  const { data: { user }, error } = await supabase.auth.getUser()

  if (error || !user) {
    return NextResponse.json({ error: { code: 'unauthorized', message: 'Unauthorized' } }, { status: 401 })
  }

  const limited = await rateLimit('auth', user.id)
  if (limited) return limited

  await prisma.profile.upsert({
    where: { id: user.id },
    create: { id: user.id },
    update: {},
  })

  return NextResponse.json({ ok: true })
}
