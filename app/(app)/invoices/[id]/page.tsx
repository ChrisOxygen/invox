import { InvoiceDetailPageClient } from "@/features/invoices/components/detail/InvoiceDetailPageClient";

export default async function InvoiceDetailPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  return (
    <div className="flex flex-col min-h-full">
      <div className="py-6">
        <InvoiceDetailPageClient id={id} />
      </div>
    </div>
  );
}
