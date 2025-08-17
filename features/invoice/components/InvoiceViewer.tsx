"use client";

import { useParams } from "next/navigation";
import { useState } from "react";
import { Skeleton } from "@/components/ui/skeleton";
import { ColorTheme, COLOR_THEMES } from "@/constants";

import { useInvoiceWithRelations } from "../hooks/useInvoiceWithRelations";
import { PDFViewer } from "@react-pdf/renderer";
import ReactPDFTemplate1 from "./pdf/reactPDFTemplate1";

export function InvoiceViewer() {
  const params = useParams();
  const invoiceId = params?.invoiceId as string;

  // Theme state
  const [selectedTheme, setSelectedTheme] = useState<ColorTheme>("classic");

  const {
    invoice,
    user: userAndBusiness,
    client,
    paymentAccount,
    isPending: gettingInvoice,
  } = useInvoiceWithRelations(invoiceId);

  if (gettingInvoice) {
    return (
      <div className="flex-1 bg-gradient-to-br from-blue-50 via-cyan-50 to-blue-100 p-6">
        <div className="flex justify-center">
          <div className="w-full max-w-4xl space-y-4">
            <Skeleton className="h-8 w-1/3 bg-blue-200" />
            <Skeleton className="h-4 w-1/2 bg-blue-200" />
            <Skeleton className="h-32 w-full bg-blue-200" />
            <Skeleton className="h-16 w-full bg-blue-200" />
            <Skeleton className="h-24 w-full bg-blue-200" />
          </div>
        </div>
      </div>
    );
  }

  if (!invoice) {
    return null;
  }

  console.log(
    "Invoice",
    invoice,
    "business",
    userAndBusiness,
    "client",
    client,
    "paymentAccount",
    paymentAccount
  );

  return (
    <div className="flex flex-col h-full">
      {/* Theme Selector */}
      <div className="bg-white border-b border-gray-200 p-4">
        <div className="flex items-center gap-4">
          <label className="text-sm font-medium text-gray-700">
            Invoice Theme:
          </label>
          <select
            value={selectedTheme}
            onChange={(e) => setSelectedTheme(e.target.value as ColorTheme)}
            className="px-3 py-1 border border-gray-300 rounded-md text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
          >
            {Object.entries(COLOR_THEMES).map(([key]) => (
              <option key={key} value={key}>
                {key.charAt(0).toUpperCase() + key.slice(1)} Theme
              </option>
            ))}
          </select>
          <div className="flex items-center gap-2 ml-4">
            <div
              className="w-4 h-4 rounded border"
              style={{ backgroundColor: COLOR_THEMES[selectedTheme].primary }}
            ></div>
            <span className="text-xs text-gray-500">Primary Color</span>
          </div>
        </div>
      </div>

      {/* PDF Viewer */}
      <div className="flex-1 bg-gray-100">
        <PDFViewer
          showToolbar={false}
          height="100%"
          width="100%"
          className="w-full h-full"
        >
          <ReactPDFTemplate1
            invoice={invoice}
            userAndBusiness={userAndBusiness}
            client={client}
            paymentAccount={paymentAccount}
            theme={selectedTheme}
          />
        </PDFViewer>
      </div>
    </div>
  );
}
