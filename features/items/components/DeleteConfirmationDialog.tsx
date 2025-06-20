"use client";

import React from "react";
import { Item } from "@prisma/client";
import { Button } from "@/components/ui/button";
import AppDialog from "@/components/AppDialog";
import { FiTrash2, FiAlertTriangle } from "react-icons/fi";
import { useDeleteItem } from "@/features/items/hooks";
import { toast } from "sonner";

interface DeleteConfirmationDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  item: Item | null;
  onSuccess?: () => void;
}

export function DeleteConfirmationDialog({
  open,
  onOpenChange,
  item,
  onSuccess,
}: DeleteConfirmationDialogProps) {
  const deleteItem = useDeleteItem({
    onSuccess: () => {
      toast.success("Item deleted successfully!");
      onSuccess?.();
      onOpenChange(false);
    },
    onError: (error) => {
      toast.error(`Failed to delete item: ${error.message}`);
    },
  });

  if (!item) return null;

  const handleDelete = async () => {
    try {
      await deleteItem.deleteItemAsync(item.id);
    } catch (error) {
      // Error handling is done in the hook
      console.error("Delete error:", error);
    }
  };

  const isLoading = deleteItem.isPending;

  return (
    <AppDialog
      open={open}
      onOpenChange={onOpenChange}
      title="Delete Item"
      description="This action cannot be undone"
      maxWidth="sm"
      footer={
        <div className="flex justify-end gap-3 w-full">
          <Button
            type="button"
            variant="outline"
            onClick={() => onOpenChange(false)}
            disabled={isLoading}
            className="border-gray-300 text-gray-700 hover:bg-gray-50"
          >
            Cancel
          </Button>
          <Button
            type="button"
            onClick={handleDelete}
            disabled={isLoading}
            className="bg-red-600 text-white hover:bg-red-700 focus:ring-red-500"
          >
            <FiTrash2 className="mr-2 h-4 w-4" />
            {isLoading ? "Deleting..." : "Delete"}
          </Button>
        </div>
      }
    >
      <div className="space-y-4">
        {/* Warning Icon */}
        <div className="flex items-center justify-center w-12 h-12 mx-auto bg-red-100 rounded-full">
          <FiAlertTriangle className="h-6 w-6 text-red-600" />
        </div>

        {/* Confirmation Message */}
        <div className="text-center">
          {" "}
          <p className="text-gray-900 mb-2">
            Are you sure you want to delete{" "}
            <span className="font-semibold">&ldquo;{item.name}&rdquo;</span>?
          </p>
          <p className="text-sm text-gray-500">
            This item will be permanently removed from your inventory. This
            action cannot be undone.
          </p>
        </div>

        {/* Item Info */}
        <div className="bg-gray-50 rounded-lg p-3 border border-gray-200">
          <div className="space-y-1">
            <div className="flex justify-between">
              <span className="text-sm text-gray-500">Item:</span>
              <span className="text-sm font-medium text-gray-900">
                {item.name}
              </span>
            </div>
            {item.description && (
              <div className="flex justify-between">
                <span className="text-sm text-gray-500">Description:</span>
                <span className="text-sm text-gray-700 text-right max-w-[200px] truncate">
                  {item.description}
                </span>
              </div>
            )}
            {item.unitPrice !== null && (
              <div className="flex justify-between">
                <span className="text-sm text-gray-500">Price:</span>
                <span className="text-sm font-medium text-gray-900">
                  {new Intl.NumberFormat("en-US", {
                    style: "currency",
                    currency: "USD",
                  }).format(item.unitPrice)}
                </span>
              </div>
            )}
          </div>
        </div>
      </div>
    </AppDialog>
  );
}

export default DeleteConfirmationDialog;
