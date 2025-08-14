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
import { Edit, LayoutGrid, Palette } from "lucide-react";

function InvoiceEditor() {
  const { state, setViewMode } = useInvoiceForm();
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
          <TabsList className="bg-white h-10 sm:h-11 border border-gray-200 shadow-sm p-1 sm:py-2 sm:px-3 rounded-lg w-full grid grid-cols-2">
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
            {/* Mobile View Mode Selector */}
            <div className="flex gap-1 sm:gap-2 mb-3 sm:mb-4 p-1 bg-white rounded-lg border border-gray-200 shadow-sm">
              <Button
                variant={viewMode === "invoice-details" ? "default" : "ghost"}
                size="sm"
                onClick={() => setViewMode("invoice-details")}
                className={`flex-1 h-8 sm:h-9 text-xs sm:text-sm transition-all duration-200 ${
                  viewMode === "invoice-details"
                    ? "bg-gradient-to-r from-blue-600 to-cyan-500 text-white shadow-lg"
                    : "text-gray-600 hover:text-blue-600 hover:bg-blue-50"
                }`}
              >
                <Edit className="h-3 w-3 sm:h-4 sm:w-4 mr-1 sm:mr-2" />
                <span className="hidden sm:inline">Details</span>
                <span className="sm:hidden">Edit</span>
              </Button>
              <Button
                variant={viewMode === "layout" ? "default" : "ghost"}
                size="sm"
                onClick={() => setViewMode("layout")}
                className={`flex-1 h-8 sm:h-9 text-xs sm:text-sm transition-all duration-200 ${
                  viewMode === "layout"
                    ? "bg-gradient-to-r from-blue-600 to-cyan-500 text-white shadow-lg"
                    : "text-gray-600 hover:text-blue-600 hover:bg-blue-50"
                }`}
              >
                <LayoutGrid className="h-3 w-3 sm:h-4 sm:w-4 mr-1 sm:mr-2" />
                <span className="hidden sm:inline">Layout</span>
                <span className="sm:hidden">Grid</span>
              </Button>
              <Button
                variant={viewMode === "theme" ? "default" : "ghost"}
                size="sm"
                onClick={() => setViewMode("theme")}
                className={`flex-1 h-8 sm:h-9 text-xs sm:text-sm transition-all duration-200 ${
                  viewMode === "theme"
                    ? "bg-gradient-to-r from-blue-600 to-cyan-500 text-white shadow-lg"
                    : "text-gray-600 hover:text-blue-600 hover:bg-blue-50"
                }`}
              >
                <Palette className="h-3 w-3 sm:h-4 sm:w-4 mr-1 sm:mr-2" />
                <span className="hidden sm:inline">Theme</span>
                <span className="sm:hidden">Style</span>
              </Button>
            </div>
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
              className="border-2 border-blue-600 text-blue-600 hover:bg-gradient-to-r hover:from-blue-600 hover:to-cyan-500 hover:text-white font-medium py-1 px-2 sm:py-1.5 sm:px-3 md:py-2.5 md:px-5 rounded-lg shadow-lg hover:shadow-xl transition-all duration-200 transform hover:scale-105 bg-white text-xs sm:text-sm"
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
            <div className="scale-75 sm:scale-90 md:scale-100">
              <InvoiceSaveActions />
            </div>
          </div>
        </div>
      </div>
    </>
  );
}

export default InvoiceEditor;
