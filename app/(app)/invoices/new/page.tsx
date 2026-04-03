import { redirect } from 'next/navigation'
import { createClient } from '@/shared/lib/supabase/server'
import { _getProfile } from '@/features/settings/server/_get-profile'
import { InvoiceForm } from '@/features/invoices/components/form/InvoiceForm'

export default async function NewInvoicePage() {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) redirect('/login')

  const profile = await _getProfile(user.id)

  return (
    <div className="px-4 py-8 md:px-6">
      <InvoiceForm defaultCurrency={profile.currency} />
    </div>
  )
}
