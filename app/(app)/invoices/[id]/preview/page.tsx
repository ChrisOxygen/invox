import { notFound } from 'next/navigation'
import { createClient } from '@/shared/lib/supabase/server'
import { _getInvoiceById } from '@/features/invoices/server/_get-invoice-by-id'
import { InvoicePreviewPageClient } from '@/features/invoices/components/pdf/InvoicePreviewPageClient'

export default async function InvoicePreviewPage({
  params,
}: {
  params: Promise<{ id: string }>
}) {
  const { id } = await params

  const supabase = await createClient()
  const {
    data: { user },
  } = await supabase.auth.getUser()
  if (!user) notFound()

  let invoice
  try {
    invoice = await _getInvoiceById(user.id, id)
  } catch {
    notFound()
  }

  return <InvoicePreviewPageClient invoice={invoice} />
}
