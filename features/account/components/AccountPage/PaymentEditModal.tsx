import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Form } from "@/components/ui/form";
import { Button } from "@/components/ui/button";
import { VscCreditCard } from "react-icons/vsc";
import { FiX } from "react-icons/fi";
import { UseFormReturn } from "react-hook-form";
import { PaymentMethodForm } from "@/shared/components";
import { PaymentMethodFormData } from "@/shared/types";

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
  form: UseFormReturn<PaymentMethodFormData>;
  isUpdating: boolean;
  onSave: (data: PaymentMethodFormData) => void;
  defaultPaymentAccount?: PaymentAccount;
}

export function PaymentEditModal({
  isOpen,
  onClose,
  form,
  isUpdating,
  onSave,
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
            <PaymentMethodForm form={form} />

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
