"use client";

import React from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Item } from "@prisma/client";
import { showSuccessToast, showErrorToast } from "@/components/toast-templates";

import AppDialog from "@/components/AppDialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";

import { useCreateItem } from "@/features/items/hooks/useCreateItem";
import { useUpdateItem } from "@/features/items/hooks/useUpdateItem";
import {
  createItemSchema,
  updateItemSchema,
  ZCreateItemInput,
  ZUpdateItemInput,
} from "../validation";

interface ItemFormProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  item?: Item | null;
  onSuccess?: (item: Item) => void;
  mode?: "create" | "edit";
}

export function ItemForm({
  open,
  onOpenChange,
  item = null,
  onSuccess,
  mode = "create",
}: ItemFormProps) {
  const isEditing = mode === "edit" && item;
  // Hooks
  const createItem = useCreateItem({
    onSuccess: (data) => {
      showSuccessToast(
        "Item created successfully!",
        "Your new item has been added to the inventory."
      );
      onSuccess?.(data.data!);
      handleClose();
    },
    onError: (error) => {
      showErrorToast("Failed to create item", error.message);
    },
  });

  const updateItem = useUpdateItem({
    onSuccess: (data) => {
      showSuccessToast(
        "Item updated successfully!",
        "Your item changes have been saved."
      );
      onSuccess?.(data.data!);
      handleClose();
    },
    onError: (error) => {
      showErrorToast("Failed to update item", error.message);
    },
  });

  // Form setup - use appropriate schema based on mode
  const form = useForm<ZCreateItemInput | ZUpdateItemInput>({
    resolver: zodResolver(isEditing ? updateItemSchema : createItemSchema),
    defaultValues: {
      name: item?.name || "",
      description: item?.description || "",
      unitPrice: item?.unitPrice || 0,
    },
  });

  // Reset form when item changes or dialog opens/closes
  React.useEffect(() => {
    if (open) {
      form.reset({
        name: item?.name || "",
        description: item?.description || "",
        unitPrice: item?.unitPrice || 0,
      });
    }
  }, [open, item, form]);

  const handleClose = () => {
    form.reset();
    onOpenChange(false);
  };
  const onSubmit = async (data: ZCreateItemInput | ZUpdateItemInput) => {
    try {
      if (isEditing && item) {
        // For editing, use updateItem
        await updateItem.updateItemAsync({
          itemId: item.id,
          data: data as ZUpdateItemInput,
        });
      } else {
        // For creating, use createItem
        await createItem.createItemAsync(data as ZCreateItemInput);
      }
    } catch (error) {
      // Error handling is done in the hooks
      console.error("Form submission error:", error);
    }
  };

  const isLoading = createItem.isPending || updateItem.isPending;

  return (
    <AppDialog
      open={open}
      onOpenChange={onOpenChange}
      title={isEditing ? "Edit Item" : "Add New Item"}
      description={
        isEditing
          ? "Update the item information below."
          : "Fill in the details to create a new item."
      }
      maxWidth="md"
      onClose={handleClose}
      footer={
        <div className="flex justify-end gap-3 w-full">
          <Button
            type="button"
            variant="outline"
            onClick={handleClose}
            disabled={isLoading}
            className="border-blue-200 text-blue-700 hover:bg-blue-50 hover:border-blue-300 transition-all duration-200"
          >
            Cancel
          </Button>
          <Button
            type="submit"
            form="item-form"
            disabled={isLoading}
            className="bg-gradient-to-r from-blue-600 to-cyan-400 hover:from-blue-700 hover:to-cyan-500 text-white shadow-lg shadow-blue-200/50 hover:shadow-xl hover:shadow-blue-300/50 transition-all duration-300"
          >
            {isLoading
              ? "Saving..."
              : isEditing
              ? "Update Item"
              : "Create Item"}
          </Button>
        </div>
      }
    >
      <Form {...form}>
        <form
          id="item-form"
          onSubmit={form.handleSubmit(onSubmit)}
          className="space-y-6"
        >
          {/* Item Name */}
          <FormField
            control={form.control}
            name="name"
            render={({ field }) => (
              <FormItem>
                <FormLabel className="text-sm font-medium text-gray-900">
                  Item Name *
                </FormLabel>
                <FormControl>
                  <Input
                    {...field}
                    placeholder="Enter item name"
                    disabled={isLoading}
                    className="border-blue-200 focus-visible:border-blue-400 focus-visible:ring-blue-200 transition-all duration-200"
                  />
                </FormControl>
                <FormMessage className="text-xs text-red-600" />
              </FormItem>
            )}
          />

          {/* Description */}
          <FormField
            control={form.control}
            name="description"
            render={({ field }) => (
              <FormItem>
                <FormLabel className="text-sm font-medium text-gray-900">
                  Description
                </FormLabel>
                <FormControl>
                  <Textarea
                    {...field}
                    value={field.value || ""}
                    placeholder="Enter item description"
                    disabled={isLoading}
                    rows={3}
                    className="border-blue-200 focus-visible:border-blue-400 focus-visible:ring-blue-200 resize-none transition-all duration-200"
                  />
                </FormControl>
                <FormMessage className="text-xs text-red-600" />
              </FormItem>
            )}
          />

          {/* Unit Price */}
          <FormField
            control={form.control}
            name="unitPrice"
            render={({ field }) => (
              <FormItem>
                <FormLabel className="text-sm font-medium text-gray-900">
                  Unit Price
                </FormLabel>
                <FormControl>
                  <Input
                    {...field}
                    value={field.value ?? 0}
                    type="number"
                    step="0.01"
                    min="0"
                    placeholder="Enter unit price"
                    disabled={isLoading}
                    className="border-blue-200 focus-visible:border-blue-400 focus-visible:ring-blue-200 transition-all duration-200"
                    onChange={(e) =>
                      field.onChange(parseFloat(e.target.value) || 0)
                    }
                  />
                </FormControl>
                <FormMessage className="text-xs text-red-600" />
              </FormItem>
            )}
          />
        </form>
      </Form>
    </AppDialog>
  );
}

export default ItemForm;
