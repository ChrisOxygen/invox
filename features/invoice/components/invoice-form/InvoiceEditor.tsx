"use client";

import { ScrollArea } from "@/components/ui/scroll-area";
import { useInvoiceForm } from "../../index";

import InvoiceDetails from "./InvoiceDetails";
import InvoiceTemplate from "./InvoiceTemplate";
import InvoiceTheme from "./InvoiceTheme";
import InvoiceTemplatePreview from "./InvoiceTemplatePreview";

function InvoiceEditor() {
  const { state } = useInvoiceForm();
  const { viewMode } = state;
  return (
    <div className="h-full overflow-clip w-full grid grid-cols-[700px_1fr]">
      <div className=" w-full p-10 pr-3">
        <ScrollArea className="h-[calc(100vh-160px)] pr-10">
          {viewMode === "invoice-details" && <InvoiceDetails />}
          {viewMode === "layout" && <InvoiceTemplate />}
          {viewMode === "theme" && <InvoiceTheme />}
        </ScrollArea>
      </div>
      <InvoiceTemplatePreview />
    </div>
  );
}

export default InvoiceEditor;
