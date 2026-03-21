import { NextResponse } from 'next/server'
import React from 'react'
import { renderToBuffer } from '@react-pdf/renderer'
import type { DocumentProps } from '@react-pdf/renderer'
import { createClient } from '@/shared/lib/supabase/server'
import { createAdminClient } from '@/shared/lib/supabase/admin'
import { apiError, AppError } from '@/shared/lib/api-error'
import { _getInvoiceById } from '@/features/invoices/server/_get-invoice-by-id'
import { InvoicePDF } from '@/features/invoices/components/pdf/InvoicePDF'

export const maxDuration = 30

export async function GET(
  _request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id } = await params

  // Auth check
  const supabase = await createClient()
  const {
    data: { user },
    error: authError,
  } = await supabase.auth.getUser()
  if (authError || !user) return apiError('unauthorized', 'Unauthorized', 401)

  try {
    const invoice = await _getInvoiceById(user.id, id)

    // Render PDF to buffer
    const buffer = await renderToBuffer(
      React.createElement(InvoicePDF, { invoice }) as React.ReactElement<DocumentProps>
    )

    // Upload to Supabase Storage (fire-and-forget — don't block the response)
    const adminClient = createAdminClient()
    const storagePath = `${user.id}/${id}.pdf`
    adminClient.storage
      .from('invoices-pdf')
      .upload(storagePath, buffer, {
        contentType: 'application/pdf',
        upsert: true,
      })
      .catch(() => {
        // Storage upload is best-effort — don't fail the response
      })

    // Return PDF stream
    const safeClientName = invoice.client.name.replace(/[^a-zA-Z0-9]/g, '-')
    const filename = `INVOX-${invoice.invoiceNumber}-${safeClientName}.pdf`

    return new NextResponse(new Uint8Array(buffer), {
      status: 200,
      headers: {
        'Content-Type': 'application/pdf',
        'Content-Disposition': `attachment; filename="${filename}"`,
        'Content-Length': buffer.byteLength.toString(),
        'Cache-Control': 'private, no-cache',
      },
    })
  } catch (err) {
    if (err instanceof AppError) return apiError(err.code, err.message, err.statusCode ?? 500)
    return apiError('internal_error', 'Failed to generate PDF', 500)
  }
}
