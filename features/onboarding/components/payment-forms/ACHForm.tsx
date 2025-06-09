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
import { Loader2, Trash2 } from "lucide-react";
import { achAccountSchema } from "@/dataSchemas/payments/gateways";
import { AchAccount } from "@/types/schemas/payments";

interface ACHFormProps {
  onSubmit: (data: AchAccount) => void;
  onCancel: () => void;
  onRemove?: () => void;
  isLoading?: boolean;
  defaultValues?: Partial<AchAccount>;
}

const ACHForm: React.FC<ACHFormProps> = ({
  onSubmit,
  onCancel,
  onRemove,
  isLoading = false,
  defaultValues,
}) => {
  const form = useForm<AchAccount>({
    resolver: zodResolver(achAccountSchema),
    defaultValues: {
      routingNumber: defaultValues?.routingNumber || "",
      accountNumber: defaultValues?.accountNumber || "",
      accountType: defaultValues?.accountType || "checking",
      bankName: defaultValues?.bankName || "",
    },
  });

  const handleSubmit = (data: AchAccount) => {
    try {
      onSubmit(data);
    } catch (error) {
      console.error("Error submitting ACH details:", error);
    }
  };

  const hasExistingData =
    defaultValues && Object.keys(defaultValues).length > 0;
  const showRemoveButton = hasExistingData && onRemove;

  return (
    <div className="space-y-6">
      {/* Form Header */}
      <div className="text-center space-y-2">
        <h3 className="font-space-grotesk text-xl font-semibold text-gray-900">
          Bank Transfer (ACH) Details
        </h3>
        <p className="font-inter text-sm text-gray-600">
          Add your US bank account for ACH transfers
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
                      placeholder="e.g., Chase Bank"
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
              name="routingNumber"
              render={({ field }) => (
                <FormItem>
                  <FormLabel className="font-inter text-sm font-medium text-gray-700">
                    Routing Number
                  </FormLabel>
                  <FormControl>
                    <Input
                      {...field}
                      placeholder="123456789"
                      className="font-inter"
                      disabled={isLoading}
                      maxLength={9}
                    />
                  </FormControl>
                  <FormMessage className="font-inter text-xs" />
                </FormItem>
              )}
            />{" "}
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
                      maxLength={17}
                    />
                  </FormControl>
                  <FormMessage className="font-inter text-xs" />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="accountType"
              render={({ field }) => (
                <FormItem>
                  <FormLabel className="font-inter text-sm font-medium text-gray-700">
                    Account Type
                  </FormLabel>
                  <FormControl>
                    <select
                      {...field}
                      className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50 font-inter"
                      disabled={isLoading}
                    >
                      <option value="checking">Checking</option>
                      <option value="savings">Savings</option>
                    </select>
                  </FormControl>
                  <FormMessage className="font-inter text-xs" />
                </FormItem>
              )}
            />
            <div className="bg-yellow-50 p-4 rounded-lg">
              <p className="font-inter text-sm text-yellow-800">
                <span className="font-semibold">Note:</span> ACH transfers
                typically take 1-3 business days to process. Make sure all
                details are accurate to avoid delays or fees.
              </p>
            </div>
          </div>

          <div className="flex flex-col-reverse sm:flex-row gap-3 pt-4">
            <Button
              type="button"
              onClick={onCancel}
              variant="outline"
              className="flex-1 font-inter font-medium border-gray-300 text-gray-600 hover:bg-gray-50"
              disabled={isLoading}
            >
              Cancel
            </Button>

            {showRemoveButton && (
              <Button
                type="button"
                onClick={onRemove}
                variant="destructive"
                className="flex-1 font-inter font-medium"
                disabled={isLoading}
              >
                <Trash2 className="mr-2 w-4 h-4" />
                Remove Payment Method
              </Button>
            )}

            <Button
              type="submit"
              className="flex-1 bg-gray-900 hover:bg-gray-800 text-white font-inter font-medium"
              disabled={isLoading}
            >
              {isLoading ? (
                <>
                  <Loader2 className="mr-2 w-4 h-4 animate-spin" />
                  Saving...
                </>
              ) : hasExistingData ? (
                "Update ACH Details"
              ) : (
                "Save ACH Details"
              )}
            </Button>
          </div>
        </form>
      </Form>
    </div>
  );
};

export default ACHForm;
