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
    <div className="space-y-4 sm:space-y-5">
      {/* Form Header with design system styling */}
      <div className="text-center space-y-2">
        <h3 className="text-lg sm:text-xl font-semibold bg-gradient-to-r from-blue-600 to-cyan-400 bg-clip-text text-transparent">
          Bank Transfer (ACH) Details
        </h3>
        <p className="text-xs sm:text-sm text-gray-600">
          Add your US bank account for ACH transfers
        </p>
      </div>

      <Form {...form}>
        <form
          onSubmit={form.handleSubmit(handleSubmit)}
          className="space-y-4 sm:space-y-5"
        >
          <div className="space-y-3 sm:space-y-4">
            <FormField
              control={form.control}
              name="bankName"
              render={({ field }) => (
                <FormItem>
                  <FormLabel className="text-xs sm:text-sm font-medium text-gray-700">
                    Bank Name
                  </FormLabel>
                  <FormControl>
                    <Input
                      {...field}
                      placeholder="e.g., Chase Bank"
                      className="h-10 sm:h-11 text-sm border-gray-200 focus:border-blue-400 focus:ring-blue-400/20 transition-all duration-200"
                      disabled={isLoading}
                    />
                  </FormControl>
                  <FormMessage className="text-xs" />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="routingNumber"
              render={({ field }) => (
                <FormItem>
                  <FormLabel className="text-xs sm:text-sm font-medium text-gray-700">
                    Routing Number
                  </FormLabel>
                  <FormControl>
                    <Input
                      {...field}
                      placeholder="123456789"
                      className="h-10 sm:h-11 text-sm border-gray-200 focus:border-blue-400 focus:ring-blue-400/20 transition-all duration-200"
                      disabled={isLoading}
                      maxLength={9}
                    />
                  </FormControl>
                  <FormMessage className="text-xs" />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="accountNumber"
              render={({ field }) => (
                <FormItem>
                  <FormLabel className="text-xs sm:text-sm font-medium text-gray-700">
                    Account Number
                  </FormLabel>
                  <FormControl>
                    <Input
                      {...field}
                      placeholder="1234567890"
                      className="h-10 sm:h-11 text-sm border-gray-200 focus:border-blue-400 focus:ring-blue-400/20 transition-all duration-200"
                      disabled={isLoading}
                      maxLength={17}
                    />
                  </FormControl>
                  <FormMessage className="text-xs" />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="accountType"
              render={({ field }) => (
                <FormItem>
                  <FormLabel className="text-xs sm:text-sm font-medium text-gray-700">
                    Account Type
                  </FormLabel>
                  <FormControl>
                    <select
                      {...field}
                      className="flex h-10 sm:h-11 w-full rounded-md border border-gray-200 bg-background px-3 py-2 text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-400/20 focus-visible:ring-offset-2 focus-visible:border-blue-400 disabled:cursor-not-allowed disabled:opacity-50 transition-all duration-200"
                      disabled={isLoading}
                    >
                      <option value="checking">Checking</option>
                      <option value="savings">Savings</option>
                    </select>
                  </FormControl>
                  <FormMessage className="text-xs" />
                </FormItem>
              )}
            />
            <div className="bg-gradient-to-r from-blue-50 to-cyan-50 border border-blue-100 p-3 sm:p-4 rounded-lg">
              <p className="text-xs sm:text-sm text-blue-800">
                <span className="font-semibold">Note:</span> ACH transfers
                typically take 1-3 business days to process. Make sure all
                details are accurate to avoid delays or fees.
              </p>
            </div>
          </div>

          <div className="flex flex-col-reverse sm:flex-row gap-2 sm:gap-3 pt-3 sm:pt-4">
            <Button
              type="button"
              onClick={onCancel}
              variant="outline"
              className="flex-1 h-10 sm:h-11 text-xs sm:text-sm border-gray-200 hover:border-gray-300 hover:bg-gray-50 transition-all duration-200"
              disabled={isLoading}
            >
              Cancel
            </Button>

            {showRemoveButton && (
              <Button
                type="button"
                onClick={onRemove}
                variant="destructive"
                className="flex-1 h-10 sm:h-11 text-xs sm:text-sm bg-red-600 hover:bg-red-700 transition-all duration-200"
                disabled={isLoading}
              >
                <Trash2 className="mr-2 w-3 h-3 sm:w-4 sm:h-4" />
                Remove Payment Method
              </Button>
            )}

            <Button
              type="submit"
              className="flex-1 h-10 sm:h-11 text-xs sm:text-sm bg-gradient-to-r from-blue-600 to-cyan-400 hover:from-blue-700 hover:to-cyan-500 text-white transition-all duration-200 shadow-lg shadow-blue-200/50 hover:shadow-xl hover:shadow-blue-300/50"
              disabled={isLoading}
            >
              {isLoading ? (
                <>
                  <Loader2 className="mr-2 w-3 h-3 sm:w-4 sm:h-4 animate-spin" />
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
