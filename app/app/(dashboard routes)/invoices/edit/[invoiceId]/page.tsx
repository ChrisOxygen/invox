import InvoiceEditor from "@/features/invoice/components/invoice-form/InvoiceEditor";
import InvoiceFormHeader from "@/features/invoice/components/InvoiceFormHeader";
import InvoiceFormSideBar from "@/features/invoice/components/InvoiceFormSideBar";
import React from "react";

function EditInvoicePage() {
  return (
    <div className=" h-screen w-full grid grid-rows-[80px_1fr]">
      <InvoiceFormHeader />
      <div className=" w-full h-full grid grid-cols-[80px_1fr]">
        <InvoiceFormSideBar />
        <div className="w-full h-[calc(100vh-80px)]">
          <InvoiceEditor />
        </div>
      </div>
    </div>
  );
}

export default EditInvoicePage;
