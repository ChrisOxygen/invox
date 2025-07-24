import React from "react";
import {
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { UseFormReturn } from "react-hook-form";

// Use a more flexible form data type
interface PaymentFormData {
  accountName: string;
  accountData: Record<string, string>;
}

interface PaymentMethodFormProps {
  form: UseFormReturn<PaymentFormData>;
  paymentAccount?: {
    gatewayType: string;
    accountData: Record<string, string>;
  };
  disabled?: boolean;
  className?: string;
}

export function PaymentMethodForm({
  form,
  paymentAccount,
  disabled = false,
  className = "",
}: PaymentMethodFormProps) {
  const renderAccountDataFields = () => {
    if (!paymentAccount?.accountData) return null;

    return (
      <div className="space-y-4">
        <Label className="text-sm font-semibold text-gray-700 uppercase tracking-wide">
          Account Details
        </Label>
        {Object.entries(paymentAccount.accountData).map(([key]) => (
          <div key={key}>
            <Label className="capitalize">
              {key
                .replace(/([A-Z])/g, " $1")
                .replace(/^./, (str) => str.toUpperCase())}
            </Label>
            <Input
              type={
                key.toLowerCase().includes("secret") ||
                key.toLowerCase().includes("key")
                  ? "password"
                  : "text"
              }
              disabled={disabled}
              placeholder={`Enter ${key
                .replace(/([A-Z])/g, " $1")
                .toLowerCase()}`}
              value={form.watch(`accountData.${key}`) || ""}
              onChange={(e) =>
                form.setValue(`accountData.${key}`, e.target.value)
              }
            />
          </div>
        ))}
      </div>
    );
  };

  return (
    <div className={`space-y-6 ${className}`}>
      {/* Account Name */}
      <FormField
        control={form.control}
        name="accountName"
        render={({ field }) => (
          <FormItem>
            <FormLabel>Account Name</FormLabel>
            <FormControl>
              <Input
                placeholder="Enter a name for this payment account"
                disabled={disabled}
                {...field}
              />
            </FormControl>
            <FormMessage />
          </FormItem>
        )}
      />

      {/* Dynamic Account Data Fields */}
      {renderAccountDataFields()}
    </div>
  );
}
