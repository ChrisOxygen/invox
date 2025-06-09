import React from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
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

// ACH Form Schema - Updated to match OnboardingProvider interface
const achSchema = z.object({
  routingNumber: z
    .string()
    .min(9, "Routing number must be 9 digits")
    .max(9, "Routing number must be 9 digits")
    .regex(/^\d+$/, "Routing number must contain only digits"),
  accountNumber: z
    .string()
    .min(4, "Account number must be at least 4 digits")
    .max(20, "Account number must not exceed 20 digits")
    .regex(/^\d+$/, "Account number must contain only digits"),
  accountHolderName: z
    .string()
    .min(2, "Account holder name must be at least 2 characters")
    .max(100, "Account holder name must not exceed 100 characters"),
  bankName: z
    .string()
    .min(2, "Bank name is required")
    .max(100, "Bank name must not exceed 100 characters"),
});

export type ACHDetails = z.infer<typeof achSchema>;

interface ACHFormProps {
  onSubmit: (data: ACHDetails) => void; // Removed Promise<void> to match updated context
  onCancel: () => void;
  onRemove?: () => void;
  isLoading?: boolean;
  defaultValues?: Partial<ACHDetails>;
}

const ACHForm: React.FC<ACHFormProps> = ({
  onSubmit,
  onCancel,
  onRemove,
  isLoading = false,
  defaultValues,
}) => {
  const form = useForm<ACHDetails>({
    resolver: zodResolver(achSchema),
    defaultValues: {
      routingNumber: defaultValues?.routingNumber || "",
      accountNumber: defaultValues?.accountNumber || "",
      accountHolderName: defaultValues?.accountHolderName || "",
      bankName: defaultValues?.bankName || "",
    },
  });

  const handleSubmit = (data: ACHDetails) => {
    try {
      onSubmit(data); // Removed await since it's now synchronous
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
                      maxLength={20}
                    />
                  </FormControl>
                  <FormMessage className="font-inter text-xs" />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="accountHolderName"
              render={({ field }) => (
                <FormItem>
                  <FormLabel className="font-inter text-sm font-medium text-gray-700">
                    Account Holder Name
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
