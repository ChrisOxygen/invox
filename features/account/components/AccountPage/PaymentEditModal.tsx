import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
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
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { VscCreditCard } from "react-icons/vsc";
import { FiX } from "react-icons/fi";
import { UseFormReturn } from "react-hook-form";
import { EditablePaymentAccountData } from "../../validation";

interface PaymentAccount {
  id: string;
  gatewayType: string;
  accountName: string;
  isActive: boolean;
  accountData?: Record<string, unknown> | null;
}

interface PaymentEditModalProps {
  isOpen: boolean;
  onClose: () => void;
  form: UseFormReturn<EditablePaymentAccountData>;
  isUpdating: boolean;
  onSave: (data: EditablePaymentAccountData) => void;
  defaultPaymentAccount?: PaymentAccount;
}

export function PaymentEditModal({
  isOpen,
  onClose,
  form,
  isUpdating,
  onSave,
  defaultPaymentAccount,
}: PaymentEditModalProps) {
  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-2xl">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <VscCreditCard className="h-5 w-5" />
            Edit Payment Account
          </DialogTitle>
          <DialogDescription>
            Update your payment account information.
          </DialogDescription>
        </DialogHeader>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSave)} className="space-y-6">
            <FormField
              control={form.control}
              name="accountName"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Account Name</FormLabel>
                  <FormControl>
                    <Input placeholder="Enter account name" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            {/* Dynamic Account Data Fields */}
            {defaultPaymentAccount && (
              <div className="space-y-4">
                <Label className="text-sm font-medium text-gray-700">
                  Account Details
                </Label>
                {Object.entries(defaultPaymentAccount.accountData || {}).map(
                  ([key]) => (
                    <FormField
                      key={key}
                      control={form.control}
                      name={`accountData.${key}`}
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel className="capitalize">
                            {key
                              .replace(/([A-Z])/g, " $1")
                              .replace(/^./, (str) => str.toUpperCase())}
                          </FormLabel>
                          <FormControl>
                            <Input
                              placeholder={`Enter ${key.toLowerCase()}`}
                              type={
                                key.toLowerCase().includes("secret") ||
                                key.toLowerCase().includes("key")
                                  ? "password"
                                  : "text"
                              }
                              {...field}
                            />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                  )
                )}
              </div>
            )}

            <DialogFooter className="flex flex-col sm:flex-row gap-2">
              <Button
                type="button"
                variant="outline"
                onClick={onClose}
                disabled={isUpdating}
                className="w-full sm:w-auto"
              >
                <FiX className="h-4 w-4 mr-2" />
                Cancel
              </Button>
              <Button
                type="submit"
                disabled={isUpdating}
                className="w-full sm:w-auto bg-gradient-to-r from-blue-600 to-blue-700 text-white hover:from-blue-700 hover:to-blue-800"
              >
                {isUpdating ? "Saving..." : "Save Changes"}
              </Button>
            </DialogFooter>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
}
