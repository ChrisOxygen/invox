import { NextResponse } from 'next/server'
import { createClient } from '@/shared/lib/supabase/server'
import { createAdminClient } from '@/shared/lib/supabase/admin'
import { apiError, apiValidationError, AppError } from '@/shared/lib/api-error'
import { ZUpdateProfileSchema } from '@/features/settings/schemas'
import { _getProfile } from '@/features/settings/server/_get-profile'
import { _updateProfile } from '@/features/settings/server/_update-profile'
import { _deleteAccount } from '@/features/settings/server/_delete-account'

export async function GET() {
  const supabase = await createClient()
  const {
    data: { user },
    error,
  } = await supabase.auth.getUser()
  if (error || !user) return apiError('unauthorized', 'Unauthorized', 401)

  try {
    const profile = await _getProfile(user.id)
    return NextResponse.json(profile)
  } catch (err) {
    if (err instanceof AppError) return apiError(err.code, err.message, err.statusCode)
    return apiError('internal_error', 'Internal server error', 500)
  }
}

export async function PATCH(request: Request) {
  const supabase = await createClient()
  const {
    data: { user },
    error,
  } = await supabase.auth.getUser()
  if (error || !user) return apiError('unauthorized', 'Unauthorized', 401)

  const body = await request.json()
  const parsed = ZUpdateProfileSchema.safeParse(body)
  if (!parsed.success) return apiValidationError(parsed.error)

  try {
    const profile = await _updateProfile(user.id, parsed.data)
    return NextResponse.json(profile)
  } catch (err) {
    if (err instanceof AppError) return apiError(err.code, err.message, err.statusCode)
    return apiError('internal_error', 'Internal server error', 500)
  }
}

export async function DELETE() {
  const supabase = await createClient()
  const {
    data: { user },
    error,
  } = await supabase.auth.getUser()
  if (error || !user) return apiError('unauthorized', 'Unauthorized', 401)

  try {
    await _deleteAccount(user.id)

    const adminClient = createAdminClient()
    await adminClient.auth.admin.deleteUser(user.id)

    return NextResponse.json({ ok: true })
  } catch (err) {
    if (err instanceof AppError) return apiError(err.code, err.message, err.statusCode)
    return apiError('internal_error', 'Internal server error', 500)
  }
}
