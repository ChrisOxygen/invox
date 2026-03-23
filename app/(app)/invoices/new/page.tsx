import { InvoiceForm } from "@/features/invoices/components/form/InvoiceForm";
import { ScrollArea } from "@/shared/components/ui/scroll-area";

export default function NewInvoicePage() {
  return (
    <ScrollArea className="h-[calc(100vh-90px)]">
      <div className="pr-4 py-8">
        <InvoiceForm />
      </div>
    </ScrollArea>
  );
}
