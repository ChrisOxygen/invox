import React from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Loader2 } from "lucide-react";
import { nigerianBankAccountSchema } from "@/dataSchemas/payments";
import { NigerianBankAccount } from "@/types/schemas/payments";

interface NigerianBankFormProps {
  onSubmit: (data: NigerianBankAccount) => void; // Removed Promise<void>
  onCancel: () => void;
  onRemove?: () => void;
  isLoading?: boolean;
  defaultValues?: Partial<NigerianBankAccount>;
}

const NigerianBankForm: React.FC<NigerianBankFormProps> = ({
  onSubmit,
  onCancel,
  onRemove,
  isLoading = false,
  defaultValues,
}) => {
  const form = useForm<NigerianBankAccount>({
    resolver: zodResolver(nigerianBankAccountSchema),
    defaultValues: {
      accountNumber: defaultValues?.accountNumber || "",
      accountName: defaultValues?.accountName || "",
      bankName: defaultValues?.bankName || "",
    },
  });

  const handleSubmit = (data: NigerianBankAccount) => {
    try {
      onSubmit(data); // Removed await
    } catch (error) {
      console.error("Error submitting Nigerian bank details:", error);
    }
  };

  const showRemoveButton = defaultValues && onRemove;

  return (
    <div className="space-y-6">
      {/* Form title */}
      <div className="text-center">
        <h3 className="text-lg font-semibold">Nigerian Bank Details</h3>
        <p className="text-sm text-gray-600">
          Enter your bank account information
        </p>
      </div>

      <Form {...form}>
        <form onSubmit={form.handleSubmit(handleSubmit)} className="space-y-6">
          <div className="space-y-4">
            <FormField
              control={form.control}
              name="bankName"
              render={({ field }) => (
                <FormItem>
                  <FormLabel className="font-inter text-sm font-medium text-gray-700">
                    Bank Name
                  </FormLabel>
                  <FormControl>
                    <Input
                      {...field}
                      placeholder="e.g., First Bank of Nigeria"
                      className="font-inter"
                      disabled={isLoading}
                    />
                  </FormControl>
                  <FormMessage className="font-inter text-xs" />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="accountNumber"
              render={({ field }) => (
                <FormItem>
                  <FormLabel className="font-inter text-sm font-medium text-gray-700">
                    Account Number
                  </FormLabel>
                  <FormControl>
                    <Input
                      {...field}
                      placeholder="1234567890"
                      className="font-inter"
                      disabled={isLoading}
                      maxLength={10}
                    />
                  </FormControl>
                  <FormMessage className="font-inter text-xs" />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="accountName"
              render={({ field }) => (
                <FormItem>
                  <FormLabel className="font-inter text-sm font-medium text-gray-700">
                    Account Name
                  </FormLabel>
                  <FormControl>
                    <Input
                      {...field}
                      placeholder="John Doe Business Account"
                      className="font-inter"
                      disabled={isLoading}
                    />
                  </FormControl>
                  <FormMessage className="font-inter text-xs" />
                </FormItem>
              )}
            />
          </div>

          {/* Action buttons */}
          <div className="flex flex-col-reverse sm:flex-row gap-3 pt-4">
            <Button
              type="button"
              onClick={onCancel}
              variant="outline"
              disabled={isLoading}
              className="flex-1"
            >
              Cancel
            </Button>

            {showRemoveButton && (
              <Button
                type="button"
                onClick={onRemove}
                variant="destructive"
                disabled={isLoading}
                className="flex-1"
              >
                Remove Payment Method
              </Button>
            )}

            <Button type="submit" disabled={isLoading} className="flex-1">
              {isLoading ? (
                <>
                  <Loader2 className="mr-2 w-4 h-4 animate-spin" />
                  Saving...
                </>
              ) : defaultValues ? (
                "Update Details"
              ) : (
                "Save Details"
              )}
            </Button>
          </div>
        </form>
      </Form>
    </div>
  );
};

export default NigerianBankForm;
