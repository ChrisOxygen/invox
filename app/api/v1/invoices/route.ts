import { NextResponse } from 'next/server'
import { createClient } from '@/shared/lib/supabase/server'
import { apiError, apiValidationError, AppError } from '@/shared/lib/api-error'
import { ZCreateInvoiceSchema } from '@/features/invoices/schemas'
import { _getInvoices, _createInvoice, _markOverdueInvoices } from '@/features/invoices/server'
import type { InvoiceStatus } from '@/features/invoices/types'

export async function GET(request: Request) {
  const supabase = await createClient()
  const { data: { user }, error } = await supabase.auth.getUser()
  if (error || !user) return apiError('unauthorized', 'Unauthorized', 401)

  const { searchParams } = new URL(request.url)
  const status = (searchParams.get('status') ?? 'ALL') as InvoiceStatus | 'ALL'
  const search = searchParams.get('search') ?? undefined
  const page = Number(searchParams.get('page') ?? '1')
  const pageSize = Number(searchParams.get('pageSize') ?? '20')

  try {
    await _markOverdueInvoices(user.id)
    const result = await _getInvoices(user.id, { status, search, page, pageSize })
    return NextResponse.json(result)
  } catch (err) {
    if (err instanceof AppError) return apiError(err.code, err.message, err.statusCode)
    return apiError('internal_error', 'Internal server error', 500)
  }
}

export async function POST(request: Request) {
  const supabase = await createClient()
  const { data: { user }, error } = await supabase.auth.getUser()
  if (error || !user) return apiError('unauthorized', 'Unauthorized', 401)

  const body = await request.json()
  const parsed = ZCreateInvoiceSchema.safeParse(body)
  if (!parsed.success) return apiValidationError(parsed.error)

  try {
    const invoice = await _createInvoice(user.id, parsed.data)
    return NextResponse.json(invoice, { status: 201 })
  } catch (err) {
    if (err instanceof AppError) return apiError(err.code, err.message, err.statusCode)
    return apiError('internal_error', 'Internal server error', 500)
  }
}
