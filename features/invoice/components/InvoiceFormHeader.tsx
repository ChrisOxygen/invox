"use client";

import React from "react";
import { SaveStatusIndicator } from "./SaveStatusIndicator";
import { ActionsDropdown } from "./ActionsDropdown";
import { FavoriteButton } from "./FavoriteButton";
import { InvoiceSaveActions } from "./InvoiceSaveActions";
import { useInvoiceForm } from "../index";

function InvoiceFormHeader() {
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

    console.log("Form reset!");
  };

  const handleFavoriteToggle = (isFavorite: boolean) => {
    console.log(
      `Invoice ${isFavorite ? "added to" : "removed from"} favorites`
    );
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

        <SaveStatusIndicator />
        {/* Component 2: Actions Dropdown */}
        <ActionsDropdown onDelete={handleDelete} onReset={handleReset} />

        {/* Component 3: Favorite Button */}
        <FavoriteButton onToggle={handleFavoriteToggle} />

        {/* Component 4 & 5: Save Actions (replaces Download PDF and Send Invoice buttons) */}
        <InvoiceSaveActions />
      </div>
    </div>
  );
}

export default InvoiceFormHeader;
