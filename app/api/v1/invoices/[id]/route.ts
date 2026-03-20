import { NextResponse } from 'next/server'
import { createClient } from '@/shared/lib/supabase/server'
import { apiError, apiValidationError, AppError } from '@/shared/lib/api-error'
import { ZUpdateInvoiceSchema } from '@/features/invoices/schemas'
import { _getInvoiceById, _updateInvoice, _deleteInvoice } from '@/features/invoices/server'

export async function GET(
  _request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id } = await params
  const supabase = await createClient()
  const { data: { user }, error } = await supabase.auth.getUser()
  if (error || !user) return apiError('unauthorized', 'Unauthorized', 401)

  try {
    const invoice = await _getInvoiceById(user.id, id)
    return NextResponse.json(invoice)
  } catch (err) {
    if (err instanceof AppError) return apiError(err.code, err.message, err.statusCode)
    return apiError('internal_error', 'Internal server error', 500)
  }
}

export async function PATCH(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id } = await params
  const supabase = await createClient()
  const { data: { user }, error } = await supabase.auth.getUser()
  if (error || !user) return apiError('unauthorized', 'Unauthorized', 401)

  const body = await request.json()
  const parsed = ZUpdateInvoiceSchema.safeParse({ ...body, id })
  if (!parsed.success) return apiValidationError(parsed.error)

  try {
    const invoice = await _updateInvoice(user.id, id, parsed.data)
    return NextResponse.json(invoice)
  } catch (err) {
    if (err instanceof AppError) return apiError(err.code, err.message, err.statusCode)
    return apiError('internal_error', 'Internal server error', 500)
  }
}

export async function DELETE(
  _request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id } = await params
  const supabase = await createClient()
  const { data: { user }, error } = await supabase.auth.getUser()
  if (error || !user) return apiError('unauthorized', 'Unauthorized', 401)

  try {
    await _deleteInvoice(user.id, id)
    return NextResponse.json({ ok: true })
  } catch (err) {
    if (err instanceof AppError) return apiError(err.code, err.message, err.statusCode)
    return apiError('internal_error', 'Internal server error', 500)
  }
}
