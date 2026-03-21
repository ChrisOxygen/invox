import { NextResponse } from 'next/server'
import { createClient } from '@/shared/lib/supabase/server'
import { apiError, apiValidationError } from '@/shared/lib/api-error'
import { ZUpdatePasswordSchema } from '@/features/settings/schemas'

export async function PATCH(request: Request) {
  const supabase = await createClient()
  const {
    data: { user },
    error,
  } = await supabase.auth.getUser()
  if (error || !user) return apiError('unauthorized', 'Unauthorized', 401)

  const body = await request.json()
  const parsed = ZUpdatePasswordSchema.safeParse(body)
  if (!parsed.success) return apiValidationError(parsed.error)

  const { error: updateError } = await supabase.auth.updateUser({
    password: parsed.data.newPassword,
  })

  if (updateError) {
    return apiError('password_update_failed', updateError.message, 400)
  }

  return NextResponse.json({ ok: true })
}
