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
import { nigerianBankAccountSchema } from "@/shared/validators/payment";
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
    <div className="space-y-4 sm:space-y-5">
      {/* Form title with design system styling */}
      <div className="text-center space-y-2">
        <h3 className="text-lg sm:text-xl font-semibold bg-gradient-to-r from-blue-600 to-cyan-400 bg-clip-text text-transparent">
          Nigerian Bank Details
        </h3>
        <p className="text-xs sm:text-sm text-gray-600">
          Enter your bank account information
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
                      placeholder="e.g., First Bank of Nigeria"
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
                      maxLength={10}
                    />
                  </FormControl>
                  <FormMessage className="text-xs" />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="accountName"
              render={({ field }) => (
                <FormItem>
                  <FormLabel className="text-xs sm:text-sm font-medium text-gray-700">
                    Account Name
                  </FormLabel>
                  <FormControl>
                    <Input
                      {...field}
                      placeholder="John Doe Business Account"
                      className="h-10 sm:h-11 text-sm border-gray-200 focus:border-blue-400 focus:ring-blue-400/20 transition-all duration-200"
                      disabled={isLoading}
                    />
                  </FormControl>
                  <FormMessage className="text-xs" />
                </FormItem>
              )}
            />
          </div>

          {/* Action buttons with design system styling */}
          <div className="flex flex-col-reverse sm:flex-row gap-2 sm:gap-3 pt-3 sm:pt-4">
            <Button
              type="button"
              onClick={onCancel}
              variant="outline"
              disabled={isLoading}
              className="flex-1 h-10 sm:h-11 text-xs sm:text-sm border-gray-200 hover:border-gray-300 hover:bg-gray-50 transition-all duration-200"
            >
              Cancel
            </Button>

            {showRemoveButton && (
              <Button
                type="button"
                onClick={onRemove}
                variant="destructive"
                disabled={isLoading}
                className="flex-1 h-10 sm:h-11 text-xs sm:text-sm bg-red-600 hover:bg-red-700 transition-all duration-200"
              >
                Remove Payment Method
              </Button>
            )}

            <Button
              type="submit"
              disabled={isLoading}
              className="flex-1 h-10 sm:h-11 text-xs sm:text-sm bg-gradient-to-r from-blue-600 to-cyan-400 hover:from-blue-700 hover:to-cyan-500 text-white transition-all duration-200 shadow-lg shadow-blue-200/50 hover:shadow-xl hover:shadow-blue-300/50"
            >
              {isLoading ? (
                <>
                  <Loader2 className="mr-2 w-3 h-3 sm:w-4 sm:h-4 animate-spin" />
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
