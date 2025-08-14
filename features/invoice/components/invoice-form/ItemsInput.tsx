"use client";

import { useState, useEffect } from "react";
import { useInvoiceForm } from "../../index";

import ItemRow from "./ItemRow";
import { Button } from "@/components/ui/button";

function ItemsInput() {
  const { state, addInvoiceItem } = useInvoiceForm();
  const { invoiceItems, validation } = state;
  const [hasUserTyped, setHasUserTyped] = useState(false);

  // Reset hasUserTyped when validation state changes (new submit)
  useEffect(() => {
    setHasUserTyped(false);
  }, [validation.isValid, validation.errors.invoiceItems]);

  const hasError = validation.errors.invoiceItems && !hasUserTyped;
  const itemsExist = invoiceItems && invoiceItems.length > 0;

  const handleAddItem = () => {
    setHasUserTyped(true);
    addInvoiceItem({
      description: "",
      quantity: 1,
      unitPrice: 0,
    });
  };
  return (
    <div className="flex flex-col gap-2 w-full">
      {/* Grid Header */}
      <div
        className="bg-gray-100 py-1 sm:py-2 w-full grid grid-cols-[minmax(120px,1fr)_40px_60px_60px_24px] sm:grid-cols-[minmax(200px,1fr)_minmax(20px,60px)_minmax(50px,90px)_minmax(50px,90px)_30px] gap-2 sm:gap-4"
        role="row"
        aria-label="Item table header"
      >
        <span className="pl-1 sm:pl-2 font-semibold capitalize text-xs sm:text-sm">
          Description
        </span>
        <span className="font-semibold capitalize justify-self-center text-xs sm:text-sm">
          Qty
        </span>
        <span className="font-semibold capitalize text-xs sm:text-sm">
          <span className="hidden sm:inline">Unit Price</span>
          <span className="sm:hidden">Price</span>
        </span>
        <span className="font-semibold capitalize text-xs sm:text-sm">
          Total
        </span>
        <span className="font-semibold capitalize"></span>
      </div>

      {/* Error Message */}
      {hasError && (
        <div className="p-2 sm:p-3 bg-red-50 border border-red-200 rounded-lg">
          <p className="text-red-500 text-xs sm:text-sm font-medium">
            {validation.errors.invoiceItems}
          </p>
        </div>
      )}

      {/* Items Section */}
      <div className="flex w-full flex-col gap-3 sm:gap-5">
        <div
          className="flex w-full flex-col gap-2 sm:gap-3"
          role="grid"
          aria-label="Invoice items"
        >
          {itemsExist
            ? invoiceItems.map((item, index) => (
                <ItemRow key={index} item={item} index={index} />
              ))
            : !hasError && (
                <div className="py-4 sm:py-8 text-center text-gray-500 border-2 border-dashed border-gray-200 rounded-lg">
                  <div className="flex flex-col items-center gap-1 sm:gap-2">
                    <span className="text-xs sm:text-sm font-medium">
                      No items added yet
                    </span>
                    <span className="text-xs text-gray-400">
                      <span className="hidden sm:inline">
                        Add your first item to get started with this invoice
                      </span>
                      <span className="sm:hidden">Add your first item</span>
                    </span>
                  </div>
                </div>
              )}
        </div>

        {/* Add Item Button */}
        <Button
          type="button"
          size="sm"
          onClick={handleAddItem}
          className="mt-1 sm:mt-2 bg-gradient-to-r from-blue-600 to-cyan-500 hover:from-blue-700 hover:to-cyan-600 text-white font-medium border-0 shadow-lg hover:shadow-xl transition-all duration-200 transform hover:scale-105 text-xs sm:text-sm py-2 sm:py-3"
          aria-label="Add new invoice item"
        >
          Add Item
        </Button>
      </div>
    </div>
  );
}

export default ItemsInput;
