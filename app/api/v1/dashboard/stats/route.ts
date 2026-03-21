import { NextResponse } from 'next/server'
import { createClient } from '@/shared/lib/supabase/server'
import { apiError, AppError } from '@/shared/lib/api-error'
import { _getDashboardStats } from '@/features/dashboard/server/_get-dashboard-stats'

export async function GET() {
  const supabase = await createClient()
  const {
    data: { user },
    error,
  } = await supabase.auth.getUser()
  if (error || !user) return apiError('unauthorized', 'Unauthorized', 401)

  try {
    const stats = await _getDashboardStats(user.id)
    return NextResponse.json(stats)
  } catch (err) {
    if (err instanceof AppError) return apiError(err.code, err.message, err.statusCode ?? 403)
    return apiError('internal_error', 'Failed to fetch dashboard stats', 500)
  }
}
