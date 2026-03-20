import { NextResponse } from 'next/server'
import { createClient } from '@/shared/lib/supabase/server'
import { apiError, AppError } from '@/shared/lib/api-error'
import { _duplicateInvoice } from '@/features/invoices/server'

export async function POST(
  _request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id } = await params
  const supabase = await createClient()
  const { data: { user }, error } = await supabase.auth.getUser()
  if (error || !user) return apiError('unauthorized', 'Unauthorized', 401)

  try {
    const result = await _duplicateInvoice(user.id, id)
    return NextResponse.json(result, { status: 201 })
  } catch (err) {
    if (err instanceof AppError) return apiError(err.code, err.message, err.statusCode)
    return apiError('internal_error', 'Internal server error', 500)
  }
}
