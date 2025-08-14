"use client";

import { ScrollArea } from "@/components/ui/scroll-area";
import { useInvoiceForm } from "../../index";
import { useState } from "react";

import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

import InvoiceDetails from "./InvoiceDetails";
import InvoiceTemplate from "./InvoiceTemplate";
import InvoiceTheme from "./InvoiceTheme";
import InvoiceTemplatePreview from "./InvoiceTemplatePreview";
import { InvoiceSaveActions } from "../InvoiceSaveActions";
import { Button } from "@/components/ui/button";

function InvoiceEditor() {
  const { state } = useInvoiceForm();
  const { viewMode } = state;
  const [activeTab, setActiveTab] = useState("invoice-details");
  return (
    <>
      <div className=" hidden h-full overflow-clip w-full lg:grid grid-cols-[700px_1fr]">
        <div className=" w-full p-10 pr-3">
          <ScrollArea className="h-[calc(100vh-160px)] pr-10">
            {viewMode === "invoice-details" && <InvoiceDetails />}
            {viewMode === "layout" && <InvoiceTemplate />}
            {viewMode === "theme" && <InvoiceTheme />}
          </ScrollArea>
        </div>
        <InvoiceTemplatePreview />
      </div>
      <div className="lg:hidden w-full h-full p-2 sm:p-3 md:p-5 bg-gray-50">
        <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
          <TabsList className="bg-white h-full border border-gray-200 shadow-sm p-1 sm:py-2 sm:px-3 rounded-lg w-full grid grid-cols-2">
            <TabsTrigger
              value="invoice-details"
              className="data-[state=active]:bg-gradient-to-r data-[state=active]:from-blue-600 data-[state=active]:to-cyan-500 data-[state=active]:text-white data-[state=active]:shadow-lg text-gray-700 font-medium py-1.5 px-2 sm:py-2.5 sm:px-4 rounded-md transition-all duration-200 data-[state=active]:transform data-[state=active]:scale-[1.02] text-xs sm:text-sm"
            >
              <span className="hidden sm:inline">Invoice Details</span>
              <span className="sm:hidden">Details</span>
            </TabsTrigger>
            <TabsTrigger
              value="invoice-preview"
              className="data-[state=active]:bg-gradient-to-r data-[state=active]:from-blue-600 data-[state=active]:to-cyan-500 data-[state=active]:text-white data-[state=active]:shadow-lg text-gray-700 font-medium py-1.5 px-2 sm:py-2.5 sm:px-4 rounded-md transition-all duration-200 data-[state=active]:transform data-[state=active]:scale-[1.02] text-xs sm:text-sm"
            >
              Preview
            </TabsTrigger>
          </TabsList>
          <TabsContent value="invoice-details" className="mt-3 sm:mt-4 md:mt-6">
            <ScrollArea className="h-[calc(100vh-160px)] sm:h-[calc(100vh-180px)] md:h-[calc(100vh-200px)] pb-14 sm:pb-16 md:pb-20 pr-2 sm:pr-3 md:pr-5">
              {viewMode === "invoice-details" && <InvoiceDetails />}
              {viewMode === "layout" && <InvoiceTemplate />}
              {viewMode === "theme" && <InvoiceTheme />}
            </ScrollArea>
          </TabsContent>
          <TabsContent value="invoice-preview" className="mt-3 sm:mt-4 md:mt-6">
            <div className="bg-white rounded-lg border border-gray-200 shadow-sm p-1 sm:p-2 md:p-4">
              <InvoiceTemplatePreview />
            </div>
          </TabsContent>
        </Tabs>
        <div className="fixed block [800px]:hidden bottom-0 left-0 w-full border-t border-gray-200 shadow-xl backdrop-blur-sm bg-white/95">
          <div className="flex items-center justify-between px-2 sm:px-3 md:px-5 py-2 sm:py-3 md:py-4 max-w-screen-xl mx-auto">
            <Button
              variant="outline"
              size="sm"
              className="h-8 px-3 border border-blue-600 text-blue-600 bg-white hover:bg-gradient-to-r hover:from-blue-600 hover:to-cyan-500 hover:text-white hover:border-transparent font-medium rounded-md shadow-sm hover:shadow-md transition-all duration-200 text-xs"
              onClick={() => {
                setActiveTab(
                  activeTab === "invoice-details"
                    ? "invoice-preview"
                    : "invoice-details"
                );
              }}
            >
              {activeTab === "invoice-details" ? "Preview" : "Edit"}
            </Button>
            <div className="flex-shrink-0">
              <InvoiceSaveActions />
            </div>
          </div>
        </div>
      </div>
    </>
  );
}

export default InvoiceEditor;
