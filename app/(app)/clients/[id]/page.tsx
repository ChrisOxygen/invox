import { ClientDetailPageClient } from '@/features/clients/components/detail/ClientDetailPageClient'

export default async function ClientDetailPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params
  return <ClientDetailPageClient id={id} />
}
