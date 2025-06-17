"use client";

import React, { useState } from "react";
import { SaveStatusIndicator, SaveStatus } from "./SaveStatusIndicator";
import { ActionsDropdown } from "./ActionsDropdown";
import { FavoriteButton } from "./FavoriteButton";
import { DownloadPDFButton } from "./DownloadPDFButton";
import { SendInvoiceButton } from "./SendInvoiceButton";
import { useInvoiceForm } from "../context/InvoiceFormProvider";

function InvoiceFormHeader() {
  // Demo state for save status
  const [saveStatus, setSaveStatus] = useState<SaveStatus>("unsaved");

  const { state } = useInvoiceForm();

  const { formMode, invoiceNumber } = state;

  // Demo handlers
  const handleDelete = async () => {
    console.log("Deleting invoice...");
    // Simulate API call
    await new Promise((resolve) => setTimeout(resolve, 1000));
    console.log("Invoice deleted!");
  };

  const handleReset = async () => {
    console.log("Resetting form...");
    // Simulate form reset
    await new Promise((resolve) => setTimeout(resolve, 500));
    setSaveStatus("unsaved");
    console.log("Form reset!");
  };

  const handleFavoriteToggle = (isFavorite: boolean) => {
    console.log(
      `Invoice ${isFavorite ? "added to" : "removed from"} favorites`
    );
  };

  const handleDownloadPDF = async () => {
    console.log("Generating PDF...");
    // Simulate PDF generation
    await new Promise((resolve) => setTimeout(resolve, 2000));
    console.log("PDF downloaded!");
  };

  const handleSendInvoice = async () => {
    console.log("Sending invoice...");
    // Simulate sending
    await new Promise((resolve) => setTimeout(resolve, 1500));
    setSaveStatus("saved");
    console.log("Invoice sent successfully!");
  };

  return (
    <div className="border-b flex p-4 justify-between items-center bg-white">
      <div className="flex items-center gap-4">
        <h2 className="text-2xl font-semibold capitalize text-gray-900">
          {formMode} Invoice {invoiceNumber ? `#${invoiceNumber}` : ""}
        </h2>
      </div>

      <div className="flex items-center gap-2">
        {/* Component 1: Save Status Indicator */}

        <SaveStatusIndicator status={saveStatus} />
        {/* Component 2: Actions Dropdown */}
        <ActionsDropdown onDelete={handleDelete} onReset={handleReset} />

        {/* Component 3: Favorite Button */}
        <FavoriteButton onToggle={handleFavoriteToggle} />

        {/* Component 4: Download PDF Button */}
        <DownloadPDFButton
          onDownload={handleDownloadPDF}
          fileName="invoice-2024-001.pdf"
        />

        {/* Component 5: Send Invoice Button */}
        <SendInvoiceButton
          onSend={handleSendInvoice}
          recipientEmail="client@example.com"
        />
      </div>
    </div>
  );
}

export default InvoiceFormHeader;
