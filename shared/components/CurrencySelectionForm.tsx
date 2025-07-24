import React from "react";
import {
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { UseFormReturn } from "react-hook-form";
import { CURRENCIES } from "@/constants";

interface CurrencySelectionFormData {
  currency: string;
}

interface CurrencySelectionFormProps {
  form: UseFormReturn<CurrencySelectionFormData>;
  disabled?: boolean;
  className?: string;
  label?: string;
  placeholder?: string;
}

export function CurrencySelectionForm({
  form,
  disabled = false,
  className = "",
  label = "Currency",
  placeholder = "Select your currency",
}: CurrencySelectionFormProps) {
  return (
    <div className={className}>
      <FormField
        control={form.control}
        name="currency"
        render={({ field }) => (
          <FormItem>
            <FormLabel>{label}</FormLabel>
            <Select
              onValueChange={field.onChange}
              value={field.value}
              disabled={disabled}
            >
              <FormControl>
                <SelectTrigger className="w-full">
                  <SelectValue placeholder={placeholder} />
                </SelectTrigger>
              </FormControl>
              <SelectContent>
                {CURRENCIES.map((currency) => (
                  <SelectItem key={currency.value} value={currency.value}>
                    {currency.label}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
            <FormMessage />
          </FormItem>
        )}
      />
    </div>
  );
}
