"use client";

import React from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Item } from "@prisma/client";
import { toast } from "sonner";

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

import { useCreateItem, useUpdateItem } from "@/hooks/items";
import { createItemSchema, updateItemSchema } from "@/dataSchemas";
import { CreateItemInput, UpdateItemInput } from "@/types/schemas/item";

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
      toast.success("Item created successfully!");
      if (data.data) {
        onSuccess?.(data.data);
      }
      handleClose();
    },
    onError: (error) => {
      toast.error(`Failed to create item: ${error.message}`);
    },
  });

  const updateItem = useUpdateItem({
    onSuccess: (data) => {
      toast.success("Item updated successfully!");
      if (data.data) {
        onSuccess?.(data.data);
      }
      handleClose();
    },
    onError: (error) => {
      toast.error(`Failed to update item: ${error}`);
    },
  });

  // Form setup
  const form = useForm<CreateItemInput | UpdateItemInput>({
    resolver: zodResolver(isEditing ? updateItemSchema : createItemSchema),
    defaultValues: {
      name: item?.name || "",
      description: item?.description || "",
      unitPrice: item?.unitPrice || undefined,
    },
  });

  // Reset form when item changes or dialog opens/closes
  React.useEffect(() => {
    if (open) {
      form.reset({
        name: item?.name || "",
        description: item?.description || "",
        unitPrice: item?.unitPrice || undefined,
      });
    }
  }, [open, item, form]);

  const handleClose = () => {
    form.reset();
    onOpenChange(false);
  };

  const onSubmit = async (data: CreateItemInput | UpdateItemInput) => {
    try {
      if (isEditing && item) {
        await updateItem.updateItemAsync({
          itemId: item.id,
          data: data as UpdateItemInput,
        });
      } else {
        await createItem.createItemAsync(data as CreateItemInput);
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
            className="border-gray-300 text-gray-700 hover:bg-gray-50"
          >
            Cancel
          </Button>
          <Button
            type="submit"
            form="item-form"
            disabled={isLoading}
            className="bg-black text-white hover:bg-gray-800"
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
                    className="border-gray-300 focus:border-black focus:ring-black"
                  />
                </FormControl>
                <FormMessage className="text-xs text-gray-600" />
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
                    className="border-gray-300 focus:border-black focus:ring-black resize-none"
                  />
                </FormControl>
                <FormMessage className="text-xs text-gray-600" />
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
                  Unit Price (USD)
                </FormLabel>
                <FormControl>
                  <Input
                    {...field}
                    type="number"
                    step="0.01"
                    min="0"
                    placeholder="0.00"
                    value={field.value || ""}
                    onChange={(e) => {
                      const value = e.target.value;
                      field.onChange(value ? parseFloat(value) : undefined);
                    }}
                    disabled={isLoading}
                    className="border-gray-300 focus:border-black focus:ring-black"
                  />
                </FormControl>
                <FormMessage className="text-xs text-gray-600" />
              </FormItem>
            )}
          />
        </form>
      </Form>
    </AppDialog>
  );
}

export default ItemForm;
