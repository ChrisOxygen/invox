"use client";

import React from "react";
import { Item } from "@prisma/client";
import { Button } from "@/components/ui/button";
import AppDialog from "@/components/AppDialog";
import { FiEdit2 } from "react-icons/fi";

interface ItemPreviewDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  item: Item | null;
  onEdit?: (item: Item) => void;
}

export function ItemPreviewDialog({
  open,
  onOpenChange,
  item,
  onEdit,
}: ItemPreviewDialogProps) {
  if (!item) return null;

  const formatCurrency = (amount: number | null) => {
    if (amount === null || amount === undefined) return "—";
    return new Intl.NumberFormat("en-US", {
      style: "currency",
      currency: "USD",
    }).format(amount);
  };

  const handleEdit = () => {
    onEdit?.(item);
  };

  return (
    <AppDialog
      open={open}
      onOpenChange={onOpenChange}
      title="Item Details"
      description="View item information"
      maxWidth="md"
      footer={
        <div className="flex justify-end gap-3 w-full">
          <Button
            type="button"
            variant="outline"
            onClick={() => onOpenChange(false)}
            className="border-gray-300 text-gray-700 hover:bg-gray-50"
          >
            Close
          </Button>
          <Button
            type="button"
            onClick={handleEdit}
            className="bg-black text-white hover:bg-gray-800"
          >
            <FiEdit2 className="mr-2 h-4 w-4" />
            Edit
          </Button>
        </div>
      }
    >
      <div className="space-y-6">
        {/* Item Name */}
        <div>
          <label className="text-sm font-medium text-gray-900 block mb-2">
            Item Name
          </label>
          <div className="p-3 bg-gray-50 rounded-md border border-gray-200">
            <p className="text-gray-900 font-medium">{item.name}</p>
          </div>
        </div>

        {/* Description */}
        <div>
          <label className="text-sm font-medium text-gray-900 block mb-2">
            Description
          </label>
          <div className="p-3 bg-gray-50 rounded-md border border-gray-200 min-h-[80px]">
            <p className="text-gray-700">
              {item.description || (
                <span className="italic text-gray-400">
                  No description provided
                </span>
              )}
            </p>
          </div>
        </div>

        {/* Unit Price */}
        <div>
          <label className="text-sm font-medium text-gray-900 block mb-2">
            Unit Price
          </label>
          <div className="p-3 bg-gray-50 rounded-md border border-gray-200">
            <p className="text-gray-900 font-medium text-lg">
              {formatCurrency(item.unitPrice)}
            </p>
          </div>
        </div>

        {/* Metadata */}
        <div className="pt-4 border-t border-gray-200">
          <div className="grid grid-cols-2 gap-4 text-sm">
            <div>
              <label className="text-gray-500 block">Created</label>
              <p className="text-gray-900">
                {new Date(item.createdAt).toLocaleDateString()}
              </p>
            </div>
            <div>
              <label className="text-gray-500 block">Last Updated</label>
              <p className="text-gray-900">
                {new Date(item.updatedAt).toLocaleDateString()}
              </p>
            </div>
          </div>
        </div>
      </div>
    </AppDialog>
  );
}

export default ItemPreviewDialog;
