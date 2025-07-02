import React from "react";
import { InvoiceViewToolbar } from "@/features/invoice/components/InvoiceViewToolbar";
import { InvoiceViewer } from "@/features/invoice/components/InvoiceViewer";
import { InvoiceFormProvider } from "@/features/invoice/context/InvoiceFormProvider";

interface InvoicePageProps {
  params: {
    invoiceId: string;
  };
}

function InvoicePage({ params }: InvoicePageProps) {
  const { invoiceId } = params;

  return (
    <InvoiceFormProvider>
      <div className="flex flex-col h-screen bg-white">
        {/* Row 1: Toolbar Section */}
        <InvoiceViewToolbar invoiceId={invoiceId} />

        {/* Row 2: Invoice Display Section */}
        <InvoiceViewer />
      </div>
    </InvoiceFormProvider>
  );
}

export default InvoicePage;
