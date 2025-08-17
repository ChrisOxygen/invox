"use client";

import React from "react";
import { SaveStatusIndicator } from "./SaveStatusIndicator";
import { ActionsDropdown } from "./ActionsDropdown";
import { FavoriteButton } from "./FavoriteButton";
import { InvoiceSaveActions } from "./InvoiceSaveActions";
import InvoiceFormSideBarMenu from "./InvoiceFormSideBarMenu";
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
      <div className="flex sm:flex-row sm:items-center justify-between p-3 sm:p-4 md:p-6 gap-3 sm:gap-4 md:gap-2">
        {/* Left Section - Mobile Menu & Title */}
        <div className="flex items-center gap-2 sm:gap-4">
          {/* Mobile Navigation Menu - Only visible on mobile/tablet */}
          <div className="lg:hidden">
            <InvoiceFormSideBarMenu />
          </div>

          <h1 className="text-lg sm:text-2xl md:text-3xl font-semibold tracking-tight bg-gradient-to-r from-blue-600 via-cyan-500 to-blue-500 bg-clip-text text-transparent capitalize">
            <span className="hidden sm:inline">
              {formMode} Invoice {invoiceNumber ? `#${invoiceNumber}` : ""}
            </span>
            <span className="sm:hidden">
              {formMode} {invoiceNumber ? `#${invoiceNumber}` : "Invoice"}
            </span>
          </h1>
        </div>

        {/* Right Section - Actions */}
        <div className="flex flex-wrap items-center gap-1 sm:gap-2 md:gap-3">
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
          <div className="hidden md:block">
            <InvoiceSaveActions />
          </div>
        </div>
      </div>
    </div>
  );
}

export default InvoiceFormHeader;
