import { InvoicesPageClient } from "@/features/invoices/components/list/InvoicesPageClient";

export default function InvoicesPage() {
  return (
    <div className="flex flex-col min-h-full">
      <div className="flex-1 py-6">
        <InvoicesPageClient />
      </div>
    </div>
  );
}
