"use client";

import { useParams } from "next/navigation";
import { Skeleton } from "@/components/ui/skeleton";

import { useInvoiceWithRelations } from "../hooks/useInvoiceWithRelations";
import { InvoiceViewToolbar } from "./InvoiceViewToolbar";
import InvoiceTemplatePreview from "./invoice-form/InvoiceTemplatePreview";
import Template1 from "./templates/Template1";

export function InvoiceViewer() {
  const params = useParams();
  const invoiceId = params?.invoiceId as string;

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
          {/* Invoice Template Skeleton - matching Template1 structure */}
          <div className="w-[49.625em] bg-white shadow-lg">
            {/* Header Skeleton */}
            <div className="flex flex-row items-center">
              <div className="flex flex-col basis-[70%] px-[1.25em] py-[0.625em]">
                <Skeleton className="h-[1.875em] w-32 bg-blue-200" />
              </div>
              <div className="flex flex-col basis-[30%] items-center justify-center px-[0.625em]">
                <Skeleton className="w-[6.25em] h-[5em] bg-blue-200" />
              </div>
            </div>

            {/* Body Skeleton */}
            <div className="flex flex-col p-[1.875em] gap-[1.875em]">
              {/* Details Section Skeleton */}
              <div className="mt-[1.875em] flex flex-row items-end justify-between gap-[2.5em]">
                <div className="flex flex-col basis-[40%] gap-[0.25em]">
                  <Skeleton className="h-[0.8125em] w-20 bg-blue-200 mb-[0.375em]" />
                  <Skeleton className="h-[0.8125em] w-32 bg-blue-200" />
                  <Skeleton className="h-[0.8125em] w-28 bg-blue-200" />
                  <Skeleton className="h-[0.8125em] w-36 bg-blue-200" />
                </div>
                <div className="flex basis-[40%] flex-col gap-[0.25em]">
                  <div className="flex flex-row items-center justify-between gap-[0.625em]">
                    <Skeleton className="h-[0.8125em] w-16 bg-blue-200" />
                    <Skeleton className="h-[0.8125em] w-20 bg-blue-200" />
                  </div>
                  <div className="flex flex-row items-center justify-between gap-[0.625em]">
                    <Skeleton className="h-[0.8125em] w-20 bg-blue-200" />
                    <Skeleton className="h-[0.8125em] w-16 bg-blue-200" />
                  </div>
                  <div className="flex flex-row items-center justify-between gap-[0.625em]">
                    <Skeleton className="h-[0.8125em] w-16 bg-blue-200" />
                    <Skeleton className="h-[0.8125em] w-18 bg-blue-200" />
                  </div>
                </div>
              </div>

              {/* Items Table Skeleton */}
              <div className="flex flex-col mt-[1.25em]">
                {/* Table Header */}
                <div className="flex flex-row items-center justify-between py-[0.5em] px-[0.375em] bg-blue-100">
                  <Skeleton className="h-[1em] basis-[50%] bg-blue-200" />
                  <Skeleton className="h-[1em] basis-[20%] bg-blue-200" />
                  <Skeleton className="h-[1em] basis-[10%] bg-blue-200" />
                  <Skeleton className="h-[1em] basis-[20%] bg-blue-200" />
                </div>
                {/* Table Rows */}
                <div className="flex flex-col">
                  {[1, 2, 3].map((item) => (
                    <div
                      key={item}
                      className="flex flex-row items-center justify-between py-[0.9375em] border-b border-blue-100"
                    >
                      <Skeleton className="h-[0.8125em] basis-[50%] bg-blue-200" />
                      <Skeleton className="h-[0.8125em] basis-[20%] bg-blue-200" />
                      <Skeleton className="h-[0.8125em] basis-[10%] bg-blue-200" />
                      <Skeleton className="h-[0.8125em] basis-[20%] bg-blue-200" />
                    </div>
                  ))}
                </div>
              </div>

              {/* Terms and Total Skeleton */}
              <div className="flex flex-row items-start justify-between gap-[2.5em]">
                <div className="flex flex-col basis-[40%] gap-[1.25em]">
                  <div className="flex flex-col gap-[0.25em]">
                    <Skeleton className="h-[0.8125em] w-32 bg-blue-200" />
                    <Skeleton className="h-[0.75em] w-full bg-blue-200" />
                    <Skeleton className="h-[0.75em] w-3/4 bg-blue-200" />
                  </div>
                  <div className="flex flex-col gap-[0.25em] mt-[1.25em]">
                    <div className="relative py-[0.375em] bg-blue-100">
                      <Skeleton className="h-[0.75em] w-24 bg-blue-200" />
                    </div>
                    <Skeleton className="h-[0.8125em] w-full bg-blue-200" />
                    <Skeleton className="h-[0.8125em] w-full bg-blue-200" />
                  </div>
                </div>

                <div className="flex flex-col basis-[40%] gap-[0.625em]">
                  <div className="flex flex-row items-center justify-between gap-[0.625em]">
                    <Skeleton className="h-[0.8125em] basis-[60%] bg-blue-200" />
                    <Skeleton className="h-[0.8125em] basis-[40%] bg-blue-200" />
                  </div>
                  <div className="flex flex-row items-center justify-between gap-[0.625em]">
                    <Skeleton className="h-[0.8125em] basis-[60%] bg-blue-200" />
                    <Skeleton className="h-[0.8125em] basis-[40%] bg-blue-200" />
                  </div>
                  <div className="flex flex-row items-center justify-between gap-[0.625em]">
                    <Skeleton className="h-[0.8125em] basis-[60%] bg-blue-200" />
                    <Skeleton className="h-[0.8125em] basis-[40%] bg-blue-200" />
                  </div>
                  <Skeleton className="w-full h-[0.0625em] bg-blue-300" />
                  <div className="flex flex-row items-center justify-between gap-[0.625em]">
                    <Skeleton className="h-[0.9375em] basis-[60%] bg-blue-200" />
                    <Skeleton className="h-[0.9375em] basis-[40%] bg-blue-200" />
                  </div>
                  <Skeleton className="w-full h-[0.0625em] bg-blue-300" />

                  {/* Signature Skeleton */}
                  <div className="flex flex-col items-center justify-center mt-[2.5em]">
                    <Skeleton className="w-[11.25em] h-16 bg-blue-200" />
                    <Skeleton className="w-full h-[0.0625em] bg-blue-300 mt-[1.25em]" />
                    <Skeleton className="h-[0.75em] w-32 bg-blue-200 mt-[0.375em]" />
                  </div>
                </div>
              </div>
            </div>

            {/* Footer Skeleton */}
            <div className="flex flex-row items-center p-[1.875em] bg-blue-100 gap-[0.625em]">
              <Skeleton className="h-[0.8125em] w-32 bg-blue-200" />
              <Skeleton className="h-[0.8125em] w-48 bg-blue-200" />
            </div>
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
      <InvoiceViewToolbar invoiceId={invoiceId} />

      <InvoiceTemplatePreview>
        <Template1
          invoice={invoice}
          userAndBusiness={userAndBusiness}
          client={client}
          paymentAccount={paymentAccount}
        />
      </InvoiceTemplatePreview>

      {/* PDF Viewer */}
      {/* <div className="flex-1 bg-gray-100">
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
      </div> */}
    </div>
  );
}
