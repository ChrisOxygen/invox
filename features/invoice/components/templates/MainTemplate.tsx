"use client";

import React from "react";
import { useInvoiceForm } from "../../context/InvoiceFormProvider";
import { formatInvoiceData } from "../../utils";
import Image from "next/image";

// Define props interface for the template
interface MainTemplateProps {
  previewMode?: boolean;
}

function MainTemplate({ previewMode = false }: MainTemplateProps) {
  // Get invoice data from context
  const { state } = useInvoiceForm();
  const formattedData = formatInvoiceData(state);

  const {
    invoiceNumber,
    invoiceDate,
    invoiceDueDate,
    clientName,
    clientBusinessName,
    clientAddress,
    items,
    paymentAccount,
    businessDetails,
    calculations,
    discount,
    tax,
    lateFeeText,
    customNotes,
  } = formattedData;

  const { subtotal, finalTotal } = calculations;
  const { accountData, gatewayType } = paymentAccount || {
    accountData: {},
    gatewayType: "",
  };
  const { businessName, email } = businessDetails || {};

  // Convert accountData to array for easier rendering
  const accountDataArray = accountData
    ? Object.entries(accountData).map(([key, value]) => ({
        key,
        value: String(value),
      }))
    : [];

  // Default signature to business name if no signature available
  const signatureName = state.businessDetails?.signature
    ? state.businessDetails?.signature
    : state.businessDetails?.name || "";

  return (
    <div
      className={`w-[794px] min-h-[1123px] bg-white text-black flex flex-col ${
        previewMode ? "border border-gray-200 shadow-sm" : ""
      }`}
    >
      {/* Invoice Title with Horizontal Line */}
      <div className="px-10 mt-5">
        <div className="flex items-center justify-end">
          <div className="flex justify-center items-center">
            {state.businessDetails?.business?.logo ? (
              <Image
                src={state.businessDetails?.business?.logo}
                alt="Logo"
                width={100}
                height={100}
                className=" flex-1 max-w-[220px] items-start max-h-[100px] mr-3 -mb-[10px] object-contain"
              />
            ) : (
              <div className="w-[100px] h-[100px] bg-gray-200 flex items-center justify-center">
                <span className="text-gray-500">No Logo</span>
              </div>
            )}
          </div>
          <div className="border-t-2 border-gray-800 flex-grow mr-3"></div>
          <p className="uppercase text-4xl bg-white px-3 py-1 font-bold">
            Invoice
          </p>
        </div>
      </div>

      {/* Client and Invoice Details */}
      <div className="px-10 flex flex-col mt-6">
        <span className="font-bold text-lg">Invoice to:</span>
        <div className="flex text-xs justify-between items-end">
          <div className="flex flex-col w-[200px]">
            <h4 className="font-bold">{clientBusinessName}</h4>
            <span className="font-medium">{clientName}</span>
            <span className="whitespace-pre-line">{clientAddress}</span>
          </div>
          <div className="flex flex-col">
            <p className="flex justify-between items-center">
              <span className="font-bold mr-4">Invoice #</span>
              <span>{invoiceNumber}</span>
            </p>
            <p className="flex justify-between items-center">
              <span className="font-bold mr-4">Date</span>
              <span>{invoiceDate}</span>
            </p>
            <p className="flex justify-between items-center">
              <span className="font-bold mr-4">Due Date</span>
              <span>{invoiceDueDate}</span>
            </p>
          </div>
        </div>
      </div>

      {/* Items Table */}
      <div className="px-10 mt-8">
        <div className="border border-gray-300 w-full flex flex-col">
          {/* Table Header */}
          <div className="flex bg-black text-white text-xs p-2">
            <div className="w-[20px] text-center">sl.</div>
            <div className="flex-1 ml-5">Item description</div>
            <div className="w-[50px] text-right">Price</div>
            <div className="w-[25px] text-center mx-5">Qty.</div>
            <div className="w-[60px] text-right">Total</div>
          </div>

          {/* Table Body */}
          {items.map((item, index) => (
            <div
              key={item.id}
              className={`flex text-xs p-2 ${
                index % 2 === 1 ? "bg-gray-100" : ""
              }`}
            >
              <div className="w-[20px] text-center">{index + 1}</div>
              <div className="flex-1 ml-5">{item.description}</div>
              <div className="w-[50px] text-right">
                ${item.unitPrice.toFixed(2)}
              </div>
              <div className="w-[25px] text-center mx-5">{item.quantity}</div>
              <div className="w-[60px] text-right">
                ${item.total.toFixed(2)}
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Payment Info and Totals */}
      <div className="px-10 mt-6 flex justify-between text-xs">
        <div className="flex flex-col gap-5 w-[230px]">
          {customNotes && <p className="font-semibold">{customNotes}</p>}

          {lateFeeText && (
            <div className="flex flex-col gap-1">
              <span className="font-bold">Terms and Conditions:</span>
              <span>Lateness fee: {lateFeeText}</span>
            </div>
          )}

          {gatewayType && (
            <div className="flex flex-col gap-1">
              <span className="font-bold">Payment info:</span>
              <p className="flex justify-between">
                <span className="font-semibold">Pay to:</span>
                <span>{gatewayType}</span>
              </p>
              {accountDataArray.map((item, index) => (
                <p key={index} className="flex justify-between items-center">
                  <span className="font-semibold shrink-0 mr-auto">
                    {item.key}:
                  </span>
                  <span className="text-right">{item.value}</span>
                </p>
              ))}
            </div>
          )}
        </div>

        <div className="flex flex-col gap-5 w-[150px]">
          <div className="flex flex-col gap-1">
            <p className="flex justify-between">
              <span className="font-semibold shrink-0 mr-auto">Sub Total:</span>
              <span>${subtotal.toFixed(2)}</span>
            </p>

            {tax > 0 && (
              <p className="flex justify-between">
                <span className="font-semibold">Tax ({tax}%):</span>
                <span>${((subtotal * tax) / 100).toFixed(2)}</span>
              </p>
            )}

            {discount > 0 && (
              <p className="flex justify-between">
                <span className="font-semibold">Discount:</span>
                <span>-${((subtotal * discount) / 100).toFixed(2)}</span>
              </p>
            )}
          </div>

          <div className="flex font-bold py-1 text-sm">
            <span className="z-10 font-semibold bg-white pr-2">Total:</span>
            <span className="z-10 ml-auto bg-white pl-2">
              ${finalTotal.toFixed(2)}
            </span>
          </div>
        </div>
      </div>

      <div className=" flex px-10 mt-20 justify-end">
        <div className="flex flex-col ">
          <div className="">
            {state.businessDetails?.signature ? (
              <Image
                src={state.businessDetails?.signature}
                alt="signature"
                width={1000}
                height={1000}
                className=" flex-1 max-w-[180px]  object-center -mb-[5px] object-contain"
              />
            ) : (
              <span className="text-gray-500 capitalize">{signatureName}</span>
            )}
          </div>
          <div className="border-t-2 border-gray-800 text-xs flex items-center justify-center">
            <span className="text-xs font-semibold">Authorized Signature</span>
          </div>
        </div>
      </div>

      {/* Signature Section */}
      <div className="mt-auto border-t-10 border-gray-800 text-xs flex items-center justify-between px-10 py-5">
        <div className="flex gap-2 items-center">
          {businessName && (
            <span className="pr-2 font-semibold">{businessName}</span>
          )}
          {email && (
            <span className="px-2 border-l border-gray-300 font-semibold">
              {email}
            </span>
          )}
        </div>
      </div>
    </div>
  );
}

export default MainTemplate;
