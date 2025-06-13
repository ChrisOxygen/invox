"use client";

import React, { useEffect } from "react";
import { useFieldArray, useFormContext } from "react-hook-form";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Plus, Trash2 } from "lucide-react";
import { ItemDescriptionSelect } from "./ItemDescriptionSelect";
import { InvoiceItemFormData } from "@/types/forms/invoice";

interface InvoiceItemsFormProps {
  disabled?: boolean;
  currency?: string;
}

export function InvoiceItemsForm({
  disabled = false,
  currency = "USD",
}: InvoiceItemsFormProps) {
  const form = useFormContext();
  const { control, watch, setValue } = form;

  const { fields, append, remove } = useFieldArray({
    control,
    name: "items",
  });

  // Watch all items to calculate totals
  const watchedItems = watch("items") as InvoiceItemFormData[];

  // Calculate total amount for each item when quantity or unitPrice changes
  useEffect(() => {
    watchedItems.forEach((item, index) => {
      if (item.quantity && item.unitPrice) {
        const totalAmount = Number((item.quantity * item.unitPrice).toFixed(2));
        if (item.totalAmount !== totalAmount) {
          setValue(`items.${index}.totalAmount`, totalAmount);
        }
      }
    });
  }, [watchedItems, setValue]);

  // Calculate grand total
  const grandTotal = watchedItems.reduce((sum, item) => {
    return sum + (item.totalAmount || 0);
  }, 0);

  const addItem = () => {
    append({
      description: "",
      quantity: 1,
      unitPrice: 0,
      totalAmount: 0,
    });
  };

  const removeItem = (index: number) => {
    if (fields.length > 1) {
      remove(index);
    }
  };

  // Add first item if none exist
  useEffect(() => {
    if (fields.length === 0) {
      append({
        description: "",
        quantity: 1,
        unitPrice: 0,
        totalAmount: 0,
      });
    }
  }, [fields.length, append]);

  return (
    <div className="flex flex-col gap-4">
      <div className="block @[600px]:hidden space-y-4 ">
        {fields.map((field, index) => (
          <div
            key={field.id}
            className=" flex flex-col gap-3 pb-6 border-b border-black/40 last:border-b-0"
          >
            {/* Description - Full width */}
            <FormField
              control={control}
              name={`items.${index}.description`}
              render={({ field }) => (
                <FormItem>
                  <FormLabel className="text-sm">Description</FormLabel>
                  <FormControl>
                    <ItemDescriptionSelect
                      value={field.value}
                      onChange={field.onChange}
                      disabled={disabled}
                      placeholder="Select or type description..."
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />{" "}
            {/* Quantity, Price, Total, and Remove in a row */}
            <div className="grid grid-cols-[60px_1fr_1fr_40px] gap-3">
              <FormField
                control={control}
                name={`items.${index}.quantity`}
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className="text-sm">Qty</FormLabel>
                    <FormControl>
                      <Input
                        type="number"
                        min="1"
                        max="9999"
                        step="1"
                        placeholder="1"
                        {...field}
                        onChange={(e) => {
                          const value = e.target.value;
                          field.onChange(value ? parseInt(value, 10) : 0);
                        }}
                        disabled={disabled}
                        className="h-9 text-center"
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={control}
                name={`items.${index}.unitPrice`}
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className="text-sm">
                      Price ({currency})
                    </FormLabel>
                    <FormControl>
                      <Input
                        type="number"
                        min="0.01"
                        max="999999.99"
                        step="0.01"
                        placeholder="0.00"
                        {...field}
                        onChange={(e) => {
                          const value = e.target.value;
                          field.onChange(value ? parseFloat(value) : 0);
                        }}
                        disabled={disabled}
                        className="h-9"
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={control}
                name={`items.${index}.totalAmount`}
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className="text-sm">Total</FormLabel>
                    <FormControl>
                      <Input
                        type="text"
                        value={`${currency === "USD" ? "$" : currency} ${(
                          field.value || 0
                        ).toFixed(2)}`}
                        disabled={true}
                        className="h-9 bg-gray-50 text-gray-700"
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              {/* Remove Button - Icon only */}
              <div className="flex items-end">
                <Button
                  type="button"
                  variant="outline"
                  size="sm"
                  onClick={() => removeItem(index)}
                  disabled={disabled || fields.length === 1}
                  className="h-9 w-10 p-0 text-red-600 hover:text-red-700 hover:bg-red-50 border-red-200"
                >
                  <Trash2 className="h-4 w-4" />
                </Button>
              </div>
            </div>
          </div>
        ))}
      </div>
      {/* Desktop Table Layout (>= 600px) */}
      <div className="hidden @[600px]:block">
        <div className="border min-h-[200px] flex flex-col w-full">
          {/* Table Header */}{" "}
          <div className="grid grid-cols-[30px_1fr_80px_80px_100px_50px] p-3 text-white gap-4 bg-black">
            <span className="justify-self-center text-sm font-medium">No.</span>
            <span className="text-sm font-medium">Description</span>
            <span className="text-sm font-medium text-center">
              Price ({currency})
            </span>
            <span className="text-sm font-medium text-center">Qty</span>
            <span className="text-sm font-medium text-center">Total</span>
            <span className="text-sm font-medium text-center">Action</span>
          </div>
          {/* Table Rows */}
          {fields.map((field, index) => (
            <div
              key={field.id}
              className="grid grid-cols-[30px_1fr_80px_80px_100px_50px] p-3 gap-4 border-b hover:bg-gray-50 transition-colors"
            >
              {/* Serial Number */}
              <span className="justify-self-center text-sm flex items-center">
                {index + 1}
              </span>

              {/* Description */}
              <div className="flex items-center">
                <FormField
                  control={control}
                  name={`items.${index}.description`}
                  render={({ field }) => (
                    <FormItem className="w-full">
                      <FormControl>
                        <ItemDescriptionSelect
                          value={field.value}
                          onChange={field.onChange}
                          disabled={disabled}
                          placeholder="Select or type description..."
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>

              {/* Unit Price */}
              <div className="flex items-center">
                <FormField
                  control={control}
                  name={`items.${index}.unitPrice`}
                  render={({ field }) => (
                    <FormItem className="w-full">
                      <FormControl>
                        <Input
                          type="number"
                          min="0.01"
                          max="999999.99"
                          step="0.01"
                          placeholder="0.00"
                          {...field}
                          onChange={(e) => {
                            const value = e.target.value;
                            field.onChange(value ? parseFloat(value) : 0);
                          }}
                          disabled={disabled}
                          className="h-9 text-center"
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>

              {/* Quantity */}
              <div className="flex items-center">
                <FormField
                  control={control}
                  name={`items.${index}.quantity`}
                  render={({ field }) => (
                    <FormItem className="w-full">
                      <FormControl>
                        <Input
                          type="number"
                          min="1"
                          max="9999"
                          step="1"
                          placeholder="1"
                          {...field}
                          onChange={(e) => {
                            const value = e.target.value;
                            field.onChange(value ? parseInt(value, 10) : 0);
                          }}
                          disabled={disabled}
                          className="h-9 text-center"
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>

              {/* Total Amount */}
              <div className="flex items-center">
                <FormField
                  control={control}
                  name={`items.${index}.totalAmount`}
                  render={({ field }) => (
                    <FormItem className="w-full">
                      {" "}
                      <FormControl>
                        <Input
                          type="text"
                          value={`${currency === "USD" ? "$" : currency} ${(
                            field.value || 0
                          ).toFixed(2)}`}
                          disabled={true}
                          className="h-9 bg-gray-50 text-gray-700 text-center"
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>

              {/* Remove Button */}
              <div className="flex items-center justify-center">
                <Button
                  type="button"
                  variant="outline"
                  size="sm"
                  onClick={() => removeItem(index)}
                  disabled={disabled || fields.length === 1}
                  className="h-8 w-8 p-0"
                >
                  <Trash2 className="h-3 w-3" />
                </Button>
              </div>
            </div>
          ))}
        </div>
      </div>{" "}
      {/* Add Item Button */}
      <div className="flex justify-start">
        <Button
          type="button"
          variant="outline"
          onClick={addItem}
          disabled={disabled || fields.length >= 50}
          className="h-9 w-full @[600px]:w-auto"
        >
          <Plus className="h-4 w-4 mr-2" /> Add Item
        </Button>
      </div>
      {/* Grand Total */}
      <div className="border-t pt-4">
        <div className="flex justify-end">
          <div className="text-right">
            <div className="text-sm text-muted-foreground">Grand Total</div>
            <div className="text-2xl font-bold">
              {currency === "USD" ? "$" : currency} {grandTotal.toFixed(2)}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
