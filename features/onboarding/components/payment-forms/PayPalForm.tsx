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
import { paypalAccountSchema } from "@/dataSchemas/payments";
import { PaypalAccount } from "@/types/schemas/payments";

interface PayPalFormProps {
  onSubmit: (data: PaypalAccount) => void; // Removed Promise<void>
  onCancel: () => void;
  onRemove?: () => void;
  isLoading?: boolean;
  defaultValues?: Partial<PaypalAccount>;
}

const PayPalForm: React.FC<PayPalFormProps> = ({
  onSubmit,
  onCancel,
  onRemove,
  isLoading = false,
  defaultValues,
}) => {
  const form = useForm<PaypalAccount>({
    resolver: zodResolver(paypalAccountSchema),
    defaultValues: {
      email: defaultValues?.email || "",
    },
  });

  const handleSubmit = (data: PaypalAccount) => {
    try {
      onSubmit(data); // Removed await
    } catch (error) {
      console.error("Error submitting PayPal details:", error);
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
          PayPal Details
        </h3>
        <p className="text-xs sm:text-sm text-gray-600">
          Connect your PayPal account for easy payments
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
              name="email"
              render={({ field }) => (
                <FormItem>
                  <FormLabel className="text-xs sm:text-sm font-medium text-gray-700">
                    PayPal Email Address
                  </FormLabel>
                  <FormControl>
                    <Input
                      {...field}
                      type="email"
                      placeholder="your-paypal@email.com"
                      className="h-10 sm:h-11 text-sm border-gray-200 focus:border-blue-400 focus:ring-blue-400/20 transition-all duration-200"
                      disabled={isLoading}
                    />
                  </FormControl>
                  <FormMessage className="text-xs" />
                </FormItem>
              )}
            />

            <div className="bg-gradient-to-r from-blue-50 to-cyan-50 border border-blue-100 p-3 sm:p-4 rounded-lg">
              <p className="text-xs sm:text-sm text-blue-800">
                <span className="font-semibold">Note:</span> This should be the
                email address associated with your PayPal business account. Your
                clients will use this email to send payments.
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
                "Update PayPal Details"
              ) : (
                "Save PayPal Details"
              )}
            </Button>
          </div>
        </form>
      </Form>
    </div>
  );
};

export default PayPalForm;
