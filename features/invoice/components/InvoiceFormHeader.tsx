"use client";

import React from "react";
import { SaveStatusIndicator } from "./SaveStatusIndicator";
import { ActionsDropdown } from "./ActionsDropdown";
import { FavoriteButton } from "./FavoriteButton";
import { InvoiceSaveActions } from "./InvoiceSaveActions";
import { useInvoiceForm } from "../index";

function InvoiceFormHeader() {
  const { state, toggleIsFavorite } = useInvoiceForm();

  const { formMode, invoiceNumber, isFavorite } = state;

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

  const handleFavoriteToggle = () => {
    toggleIsFavorite();
  };

  return (
    <div className="border-b bg-white shadow-sm">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between p-4 sm:p-6 gap-4 sm:gap-2">
        {/* Left Section - Title */}
        <div className="flex items-center gap-4">
          <h1 className="text-2xl sm:text-3xl font-bold tracking-tight bg-gradient-to-r from-blue-600 via-cyan-500 to-blue-500 bg-clip-text text-transparent capitalize">
            {formMode} Invoice {invoiceNumber ? `#${invoiceNumber}` : ""}
          </h1>
        </div>

        {/* Right Section - Actions */}
        <div className="flex flex-wrap items-center gap-2 sm:gap-3">
          {/* Save Status Indicator */}
          <SaveStatusIndicator />

          {/* Actions Dropdown */}
          <ActionsDropdown onDelete={handleDelete} onReset={handleReset} />

          {/* Favorite Button */}
          <FavoriteButton
            isFavorite={isFavorite}
            onToggle={handleFavoriteToggle}
          />

          {/* Save Actions */}
          <div className="hidden [800px]:block">
            <InvoiceSaveActions />
          </div>
        </div>
      </div>
    </div>
  );
}

export default InvoiceFormHeader;
