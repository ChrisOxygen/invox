import { NextResponse } from 'next/server'
import { createClient } from '@/shared/lib/supabase/server'
import { apiError, apiValidationError, AppError } from '@/shared/lib/api-error'
import { ZUpdateInvoiceStatusSchema } from '@/features/invoices/schemas'
import { _updateInvoiceStatus } from '@/features/invoices/server'

export async function PATCH(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id } = await params
  const supabase = await createClient()
  const { data: { user }, error } = await supabase.auth.getUser()
  if (error || !user) return apiError('unauthorized', 'Unauthorized', 401)

  const body = await request.json()
  const parsed = ZUpdateInvoiceStatusSchema.safeParse(body)
  if (!parsed.success) return apiValidationError(parsed.error)

  try {
    const result = await _updateInvoiceStatus(user.id, id, parsed.data.status)
    return NextResponse.json(result)
  } catch (err) {
    if (err instanceof AppError) return apiError(err.code, err.message, err.statusCode)
    return apiError('internal_error', 'Internal server error', 500)
  }
}
