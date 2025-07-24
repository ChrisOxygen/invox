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
      className={`bg-white text-black flex flex-col ${
        previewMode ? "border border-gray-200 shadow-sm" : ""
      }`}
      style={{
        // A4 paper dimensions in em units (794px ÷ 16px = 49.625em, 1123px ÷ 16px = 70.1875em)
        width: "49.625em",
        minHeight: "70.1875em",
        fontSize: "1em", // Inherit font size from parent for proper scaling
      }}
    >
      {/* Invoice Title with Horizontal Line */}
      <div style={{ padding: "0 0.625em", marginTop: "0.3125em" }}>
        <div className="flex items-center justify-end">
          <div className="flex justify-center items-center">
            {state.businessDetails?.business?.logo ? (
              <Image
                src={state.businessDetails?.business?.logo}
                alt="Logo"
                width={100}
                height={100}
                className="flex-1 items-start mr-3 -mb-[10px] object-contain"
                style={{ maxWidth: "13.75em", maxHeight: "6.25em" }}
              />
            ) : (
              <div
                style={{ width: "6.25em", height: "6.25em" }}
                className="bg-gray-200 flex items-center justify-center"
              >
                <span className="text-gray-500">No Logo</span>
              </div>
            )}
          </div>
          <div className="border-t-2 border-gray-800 flex-grow mr-3"></div>
          <p
            className="uppercase bg-white px-3 py-1 font-bold"
            style={{ fontSize: "2.25em" }}
          >
            Invoice
          </p>
        </div>
      </div>

      {/* Client and Invoice Details */}
      <div style={{ padding: "0 0.625em" }} className="flex flex-col mt-6">
        <span className="font-bold" style={{ fontSize: "1.125em" }}>
          Invoice to:
        </span>
        <div
          className="flex justify-between items-end"
          style={{ fontSize: "0.75em" }}
        >
          <div className="flex flex-col" style={{ width: "12.5em" }}>
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
      <div style={{ padding: "0 0.625em", marginTop: "0.5em" }}>
        <div className="border border-gray-300 w-full flex flex-col">
          {/* Table Header */}
          <div
            className="flex bg-black text-white p-2"
            style={{ fontSize: "0.75em" }}
          >
            <div style={{ width: "1.25em" }} className="text-center">
              sl.
            </div>
            <div className="flex-1 ml-5">Item description</div>
            <div style={{ width: "3.125em" }} className="text-right">
              Price
            </div>
            <div
              style={{ width: "1.5625em", margin: "0 0.3125em" }}
              className="text-center"
            >
              Qty.
            </div>
            <div style={{ width: "3.75em" }} className="text-right">
              Total
            </div>
          </div>

          {/* Table Body */}
          {items.map((item, index) => (
            <div
              key={item.id}
              className={`flex p-2 ${index % 2 === 1 ? "bg-gray-100" : ""}`}
              style={{ fontSize: "0.75em" }}
            >
              <div style={{ width: "1.25em" }} className="text-center">
                {index + 1}
              </div>
              <div className="flex-1 ml-5">{item.description}</div>
              <div style={{ width: "3.125em" }} className="text-right">
                ${item.unitPrice.toFixed(2)}
              </div>
              <div
                style={{ width: "1.5625em", margin: "0 0.3125em" }}
                className="text-center"
              >
                {item.quantity}
              </div>
              <div style={{ width: "3.75em" }} className="text-right">
                ${item.total.toFixed(2)}
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Payment Info and Totals */}
      <div
        style={{
          padding: "0 0.625em",
          marginTop: "0.375em",
          fontSize: "0.75em",
        }}
        className="flex justify-between"
      >
        <div className="flex flex-col gap-5" style={{ width: "14.375em" }}>
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

        <div className="flex flex-col gap-5" style={{ width: "9.375em" }}>
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

          <div className="flex font-bold py-1" style={{ fontSize: "0.875em" }}>
            <span className="z-10 font-semibold bg-white pr-2">Total:</span>
            <span className="z-10 ml-auto bg-white pl-2">
              ${finalTotal.toFixed(2)}
            </span>
          </div>
        </div>
      </div>

      <div
        style={{ padding: "0 0.625em", marginTop: "1.25em" }}
        className="flex justify-end"
      >
        <div className="flex flex-col ">
          <div className="">
            {state.businessDetails?.signature ? (
              <Image
                src={state.businessDetails?.signature}
                alt="signature"
                width={1000}
                height={1000}
                className="flex-1 object-center -mb-[5px] object-contain"
                style={{ maxWidth: "11.25em" }}
              />
            ) : (
              <span className="text-gray-500 capitalize">{signatureName}</span>
            )}
          </div>
          <div
            className="border-t-2 border-gray-800 flex items-center justify-center"
            style={{ fontSize: "0.75em" }}
          >
            <span className="font-semibold">Authorized Signature</span>
          </div>
        </div>
      </div>

      {/* Signature Section */}
      <div
        style={{ padding: "0.3125em 0.625em", fontSize: "0.75em" }}
        className="mt-auto border-t-10 border-gray-800 flex items-center justify-between"
      >
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
