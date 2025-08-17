import React from "react";
// import { InvoiceViewToolbar } from "@/features/invoice/components/InvoiceViewToolbar";
import { InvoiceViewer } from "@/features/invoice/components/InvoiceViewer";

async function InvoicePage() {
  return (
    <div className="grid grid-rows-[100px,1fr] h-full bg-gradient-to-br from-blue-50 via-cyan-50 to-blue-100">
      {/* Row 1: Toolbar Section */}
      {/* <InvoiceViewToolbar invoiceId={invoiceId} /> */}

      {/* Row 2: Invoice Display Section */}
      <InvoiceViewer />
    </div>
  );
}

export default InvoicePage;
