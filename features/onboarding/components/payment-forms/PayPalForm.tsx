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
    <div className="space-y-6">
      {/* Form Header */}
      <div className="text-center space-y-2">
        <h3 className="font-space-grotesk text-xl font-semibold text-gray-900">
          PayPal Details
        </h3>
        <p className="font-inter text-sm text-gray-600">
          Connect your PayPal account for easy payments
        </p>
      </div>

      <Form {...form}>
        <form onSubmit={form.handleSubmit(handleSubmit)} className="space-y-6">
          <div className="space-y-4">
            <FormField
              control={form.control}
              name="email"
              render={({ field }) => (
                <FormItem>
                  <FormLabel className="font-inter text-sm font-medium text-gray-700">
                    PayPal Email Address
                  </FormLabel>
                  <FormControl>
                    <Input
                      {...field}
                      type="email"
                      placeholder="your-paypal@email.com"
                      className="font-inter"
                      disabled={isLoading}
                    />
                  </FormControl>
                  <FormMessage className="font-inter text-xs" />
                </FormItem>
              )}
            />

            <div className="bg-blue-50 p-4 rounded-lg">
              <p className="font-inter text-sm text-blue-800">
                <span className="font-semibold">Note:</span> This should be the
                email address associated with your PayPal business account. Your
                clients will use this email to send payments.
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
