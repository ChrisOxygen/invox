"use client";

import { ScrollArea } from "@/components/ui/scroll-area";
import { useInvoiceForm } from "../../index";

import InvoiceDetails from "./InvoiceDetails";
import InvoiceTemplate from "./InvoiceTemplate";
import InvoiceTheme from "./InvoiceTheme";
import InvoicePreview from "./InvoicePreview";

function InvoiceEditor() {
  const { state } = useInvoiceForm();
  const { viewMode } = state;
  return (
    <div className="h-full overflow-clip w-full grid grid-cols-[minmax(300px,1fr)_minmax(700px,1fr)]">
      <div className=" w-full p-10 pr-3">
        <ScrollArea className="h-[calc(100vh-160px)] w-full pr-10">
          {viewMode === "invoice-details" && <InvoiceDetails />}
          {viewMode === "layout" && <InvoiceTemplate />}
          {viewMode === "theme" && <InvoiceTheme />}
        </ScrollArea>
      </div>
      <div className=" w-full bg-gray-100 h-full">
        <ScrollArea className="h-[calc(100vh-160px)] w-fullpr-10">
          <InvoicePreview />
        </ScrollArea>
      </div>
    </div>
  );
}

export default InvoiceEditor;
