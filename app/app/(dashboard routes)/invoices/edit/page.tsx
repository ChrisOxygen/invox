"use client";

import InvoiceFormDemo from "@/features/invoice/components/InvoiceFormDemo";

function EditInvoicePage() {
  return (
    <div className=" grid grid-cols-[minmax(350px,550px)_1fr] grid-rows-1 overflow-clip h-full p-2 ">
      <InvoiceFormDemo />
    </div>
  );
}

export default EditInvoicePage;
