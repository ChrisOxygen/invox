import React, { useState } from "react";
import { useForm } from "react-hook-form";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import {
  Form,
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
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { RiPaypalLine } from "react-icons/ri";
import { SiWise } from "react-icons/si";
import { BsBank } from "react-icons/bs";
import { FiCreditCard, FiSave, FiX } from "react-icons/fi";
import { useCreatePaymentAccount } from "@/features/payments/hooks";
import { PaymentGatewayType } from "@prisma/client";
import {
  showSuccessToast,
  showErrorToast,
  showWarningToast,
} from "@/components/toast-templates";

interface CreatePaymentAccountModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSuccess?: () => void;
}

// Simple form interface
interface PaymentAccountForm {
  gatewayType: string;
  accountName: string;
  // Dynamic fields based on gateway type
  email?: string;
  accountNumber?: string;
  bankName?: string;
  accountHolderName?: string;
  routingNumber?: string;
  accountType?: string;
  isActive: boolean;
  isDefault: boolean;
}

// Gateway type configurations
interface FieldConfig {
  key: string;
  label: string;
  type: string;
  placeholder: string;
  options?: string[];
  required?: boolean;
}

const gatewayConfigs: Record<
  string,
  {
    name: string;
    icon: React.ReactNode;
    color: string;
    fields: FieldConfig[];
  }
> = {
  PAYPAL: {
    name: "PayPal",
    icon: <RiPaypalLine className="h-5 w-5 text-blue-600" />,
    color: "bg-blue-100 text-blue-800",
    fields: [
      {
        key: "email",
        label: "PayPal Email",
        type: "email",
        placeholder: "your-email@example.com",
        required: true,
      },
    ],
  },
  WISE: {
    name: "Wise",
    icon: <SiWise className="h-5 w-5 text-green-600" />,
    color: "bg-green-100 text-green-800",
    fields: [
      {
        key: "email",
        label: "Wise Email",
        type: "email",
        placeholder: "your-email@example.com",
        required: true,
      },
    ],
  },
  NIGERIAN_BANK: {
    name: "Nigerian Bank",
    icon: <BsBank className="h-5 w-5 text-gray-600" />,
    color: "bg-gray-100 text-gray-800",
    fields: [
      {
        key: "accountNumber",
        label: "Account Number",
        type: "text",
        placeholder: "1234567890",
        required: true,
      },
      {
        key: "bankName",
        label: "Bank Name",
        type: "text",
        placeholder: "Access Bank",
        required: true,
      },
      {
        key: "accountHolderName",
        label: "Account Holder Name",
        type: "text",
        placeholder: "John Doe",
        required: true,
      },
    ],
  },
  ACH: {
    name: "ACH Transfer",
    icon: <FiCreditCard className="h-5 w-5 text-purple-600" />,
    color: "bg-purple-100 text-purple-800",
    fields: [
      {
        key: "routingNumber",
        label: "Routing Number",
        type: "text",
        placeholder: "021000021",
        required: true,
      },
      {
        key: "accountNumber",
        label: "Account Number",
        type: "text",
        placeholder: "1234567890",
        required: true,
      },
      {
        key: "accountType",
        label: "Account Type",
        type: "select",
        placeholder: "Select account type",
        options: ["checking", "savings"],
        required: true,
      },
      {
        key: "bankName",
        label: "Bank Name",
        type: "text",
        placeholder: "Your Bank Name",
        required: true,
      },
    ],
  },
};

export function CreatePaymentAccountModal({
  isOpen,
  onClose,
  onSuccess,
}: CreatePaymentAccountModalProps) {
  const [selectedGateway, setSelectedGateway] = useState<string>("");
  const [isSubmitting, setIsSubmitting] = useState(false);

  const { mutateAsync: createPaymentAccount } = useCreatePaymentAccount({
    onSuccess: (response) => {
      showSuccessToast("Payment Account Created", response.message);
      onSuccess?.();
      onClose();
      form.reset();
      setIsSubmitting(false);
    },
    onError: (error) => {
      showErrorToast("Creation Failed", error);
      setIsSubmitting(false);
    },
  });

  const form = useForm<PaymentAccountForm>({
    defaultValues: {
      gatewayType: "",
      accountName: "",
      isActive: true,
      isDefault: false,
    },
  });

  const handleGatewayChange = (value: string) => {
    setSelectedGateway(value);
    form.setValue("gatewayType", value);
    // Reset all dynamic fields
    form.setValue("email", "");
    form.setValue("accountNumber", "");
    form.setValue("bankName", "");
    form.setValue("accountHolderName", "");
    form.setValue("routingNumber", "");
    form.setValue("accountType", "");
  };

  const onSubmit = async (data: PaymentAccountForm) => {
    if (!selectedGateway) {
      showWarningToast("Gateway Required", "Please select a payment gateway");
      return;
    }

    setIsSubmitting(true);
    try {
      // Build type-safe payload based on gateway type
      let payload: Record<string, unknown> = {};

      if (data.gatewayType === "PAYPAL") {
        if (!data.email) {
          showErrorToast(
            "Missing Information",
            "Email is required for PayPal integration"
          );
          setIsSubmitting(false);
          return;
        }
        payload = {
          gatewayType: PaymentGatewayType.PAYPAL,
          accountName: data.accountName,
          accountData: { email: data.email },
          isActive: data.isActive,
          isDefault: data.isDefault,
        };
      } else if (data.gatewayType === "WISE") {
        if (!data.email) {
          showErrorToast(
            "Missing Information",
            "Email is required for Wise integration"
          );
          setIsSubmitting(false);
          return;
        }
        payload = {
          gatewayType: PaymentGatewayType.WISE,
          accountName: data.accountName,
          accountData: { email: data.email },
          isActive: data.isActive,
          isDefault: data.isDefault,
        };
      } else if (data.gatewayType === "NIGERIAN_BANK") {
        if (!data.accountNumber || !data.bankName || !data.accountHolderName) {
          showErrorToast(
            "Missing Bank Details",
            "All bank details are required for Nigerian bank integration"
          );
          setIsSubmitting(false);
          return;
        }
        payload = {
          gatewayType: PaymentGatewayType.NIGERIAN_BANK,
          accountName: data.accountName,
          accountData: {
            accountNumber: data.accountNumber,
            bankName: data.bankName,
            accountName: data.accountHolderName,
          },
          isActive: data.isActive,
          isDefault: data.isDefault,
        };
      } else if (data.gatewayType === "ACH") {
        if (
          !data.routingNumber ||
          !data.accountNumber ||
          !data.accountType ||
          !data.bankName
        ) {
          showErrorToast(
            "Missing ACH Details",
            "All ACH details are required for bank transfer integration"
          );
          setIsSubmitting(false);
          return;
        }
        payload = {
          gatewayType: PaymentGatewayType.ACH,
          accountName: data.accountName,
          accountData: {
            routingNumber: data.routingNumber,
            accountNumber: data.accountNumber,
            accountType: data.accountType as "checking" | "savings",
            bankName: data.bankName,
          },
          isActive: data.isActive,
          isDefault: data.isDefault,
        };
      } else {
        showErrorToast("Invalid Selection", "Invalid gateway type selected");
        setIsSubmitting(false);
        return;
      }

      // Call the API using the mutation hook
      await createPaymentAccount(
        payload as Parameters<typeof createPaymentAccount>[0]
      );
    } catch (error) {
      console.error("Error creating payment account:", error);
      showErrorToast(
        "Creation Failed",
        "Failed to create payment account. Please try again."
      );
      setIsSubmitting(false);
    }
  };

  const handleClose = () => {
    onClose();
    form.reset();
    setSelectedGateway("");
  };

  const currentGateway = selectedGateway
    ? gatewayConfigs[selectedGateway as keyof typeof gatewayConfigs]
    : null;

  return (
    <Dialog open={isOpen} onOpenChange={handleClose}>
      <DialogContent className="sm:max-w-[600px] max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="text-xl font-semibold">
            Add Payment Account
          </DialogTitle>
          <DialogDescription>
            Connect a new payment gateway to receive payments from clients.
          </DialogDescription>
        </DialogHeader>

        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
            {/* Gateway Type Selection */}
            <FormField
              control={form.control}
              name="gatewayType"
              render={({ field }) => (
                <FormItem>
                  <FormLabel className="text-base font-medium">
                    Payment Gateway Type
                  </FormLabel>
                  <Select
                    onValueChange={handleGatewayChange}
                    defaultValue={field.value}
                  >
                    <FormControl>
                      <SelectTrigger className="w-full">
                        <SelectValue placeholder="Select a payment gateway" />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                      {Object.entries(gatewayConfigs).map(([key, config]) => (
                        <SelectItem key={key} value={key}>
                          <div className="flex items-center gap-3">
                            {config.icon}
                            <span>{config.name}</span>
                          </div>
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                  <FormMessage />
                </FormItem>
              )}
            />

            {/* Gateway Info Badge */}
            {currentGateway && (
              <div className="flex items-center gap-3 p-3 rounded-lg bg-gray-50">
                {currentGateway.icon}
                <div>
                  <h4 className="font-medium">{currentGateway.name}</h4>
                  <Badge className={currentGateway.color}>
                    Selected Gateway
                  </Badge>
                </div>
              </div>
            )}

            <Separator />

            {/* Account Name */}
            <FormField
              control={form.control}
              name="accountName"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Account Name</FormLabel>
                  <FormControl>
                    <Input
                      placeholder="Enter a name for this account"
                      {...field}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            {/* Dynamic Fields Based on Gateway */}
            {currentGateway && (
              <div className="space-y-4">
                <h3 className="text-lg font-medium">
                  {currentGateway.name} Configuration
                </h3>

                {currentGateway.fields.map((fieldConfig) => (
                  <FormField
                    key={fieldConfig.key}
                    control={form.control}
                    name={fieldConfig.key as keyof PaymentAccountForm}
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>{fieldConfig.label}</FormLabel>
                        <FormControl>
                          {fieldConfig.type === "select" ? (
                            <Select
                              onValueChange={field.onChange}
                              defaultValue={field.value as string}
                            >
                              <SelectTrigger>
                                <SelectValue
                                  placeholder={fieldConfig.placeholder}
                                />
                              </SelectTrigger>
                              <SelectContent>
                                {fieldConfig.options?.map((option: string) => (
                                  <SelectItem key={option} value={option}>
                                    {option.charAt(0).toUpperCase() +
                                      option.slice(1)}
                                  </SelectItem>
                                ))}
                              </SelectContent>
                            </Select>
                          ) : (
                            <Input
                              type={fieldConfig.type}
                              placeholder={fieldConfig.placeholder}
                              value={(field.value as string) || ""}
                              onChange={field.onChange}
                              onBlur={field.onBlur}
                              name={field.name}
                              ref={field.ref}
                            />
                          )}
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                ))}
              </div>
            )}

            {/* Account Settings */}
            <div className="space-y-4">
              <h3 className="text-lg font-medium">Account Settings</h3>

              <div className="flex items-center space-x-4">
                <FormField
                  control={form.control}
                  name="isActive"
                  render={({ field }) => (
                    <FormItem className="flex items-center space-x-2">
                      <FormControl>
                        <input
                          type="checkbox"
                          checked={field.value}
                          onChange={field.onChange}
                          className="rounded border-gray-300"
                        />
                      </FormControl>
                      <FormLabel className="text-sm">
                        Activate account immediately
                      </FormLabel>
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="isDefault"
                  render={({ field }) => (
                    <FormItem className="flex items-center space-x-2">
                      <FormControl>
                        <input
                          type="checkbox"
                          checked={field.value}
                          onChange={field.onChange}
                          className="rounded border-gray-300"
                        />
                      </FormControl>
                      <FormLabel className="text-sm">
                        Set as default account
                      </FormLabel>
                    </FormItem>
                  )}
                />
              </div>
            </div>

            {/* Action Buttons */}
            <div className="flex justify-end space-x-3 pt-4 border-t">
              <Button
                type="button"
                variant="outline"
                onClick={handleClose}
                disabled={isSubmitting}
              >
                <FiX className="h-4 w-4 mr-2" />
                Cancel
              </Button>
              <Button
                type="submit"
                disabled={isSubmitting || !selectedGateway}
                className="bg-gradient-to-r from-blue-600 to-cyan-600 text-white hover:from-blue-700 hover:to-cyan-700"
              >
                {isSubmitting ? (
                  <>
                    <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                    Creating...
                  </>
                ) : (
                  <>
                    <FiSave className="h-4 w-4 mr-2" />
                    Create Account
                  </>
                )}
              </Button>
            </div>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
}
