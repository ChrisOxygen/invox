import React from "react";
import {
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { UseFormReturn } from "react-hook-form";
import { BusinessAddressFormData } from "@/shared/types";

interface BusinessAddressFormProps {
  form: UseFormReturn<BusinessAddressFormData>;
  disabled?: boolean;
  className?: string;
}

export function BusinessAddressForm({
  form,
  disabled = false,
  className = "",
}: BusinessAddressFormProps) {
  return (
    <div className={`space-y-4 ${className}`}>
      {/* Address Line 1 */}
      <FormField
        control={form.control}
        name="addressLine1"
        render={({ field }) => (
          <FormItem>
            <FormLabel>Address Line 1</FormLabel>
            <FormControl>
              <Input
                placeholder="Enter street address"
                disabled={disabled}
                {...field}
              />
            </FormControl>
            <FormMessage />
          </FormItem>
        )}
      />

      {/* Address Line 2 */}
      <FormField
        control={form.control}
        name="addressLine2"
        render={({ field }) => (
          <FormItem>
            <FormLabel>Address Line 2 (Optional)</FormLabel>
            <FormControl>
              <Input
                placeholder="Apartment, suite, etc."
                disabled={disabled}
                {...field}
              />
            </FormControl>
            <FormMessage />
          </FormItem>
        )}
      />

      {/* City, State, ZIP in a row */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <FormField
          control={form.control}
          name="city"
          render={({ field }) => (
            <FormItem>
              <FormLabel>City</FormLabel>
              <FormControl>
                <Input
                  placeholder="Enter city"
                  disabled={disabled}
                  {...field}
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="state"
          render={({ field }) => (
            <FormItem>
              <FormLabel>State</FormLabel>
              <FormControl>
                <Input
                  placeholder="Enter state"
                  disabled={disabled}
                  {...field}
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="zipCode"
          render={({ field }) => (
            <FormItem>
              <FormLabel>ZIP Code</FormLabel>
              <FormControl>
                <Input
                  placeholder="Enter ZIP code"
                  disabled={disabled}
                  {...field}
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
      </div>

      {/* Phone Number */}
      <FormField
        control={form.control}
        name="phone"
        render={({ field }) => (
          <FormItem>
            <FormLabel>Phone Number (Optional)</FormLabel>
            <FormControl>
              <Input
                placeholder="Enter phone number"
                disabled={disabled}
                {...field}
              />
            </FormControl>
            <FormMessage />
          </FormItem>
        )}
      />
    </div>
  );
}
