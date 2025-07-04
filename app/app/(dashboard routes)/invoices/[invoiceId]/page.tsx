import React from "react";
import { InvoiceViewToolbar } from "@/features/invoice/components/InvoiceViewToolbar";
import { InvoiceViewer } from "@/features/invoice/components/InvoiceViewer";

interface InvoicePageProps {
  params: {
    invoiceId: string;
  };
}

function InvoicePage({ params }: InvoicePageProps) {
  const { invoiceId } = params;

  return (
    <div className=" grid grid-rows-[100px,1fr] h-full bg-white">
      {/* Row 1: Toolbar Section */}
      <InvoiceViewToolbar invoiceId={invoiceId} />

      {/* Row 2: Invoice Display Section */}
      <InvoiceViewer />
    </div>
  );
}

export default InvoicePage;
