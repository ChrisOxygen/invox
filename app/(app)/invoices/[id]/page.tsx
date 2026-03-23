import { InvoiceDetailPageClient } from "@/features/invoices/components/detail/InvoiceDetailPageClient";

export default async function InvoiceDetailPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  return <InvoiceDetailPageClient id={id} />;
}
