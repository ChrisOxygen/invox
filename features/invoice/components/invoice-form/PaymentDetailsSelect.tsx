import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectLabel,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { useGetPaymentAccounts } from "@/hooks/payments/useGetPaymentAccounts";
import { useInvoiceForm } from "../../context/InvoiceFormProvider";
import { Button } from "@/components/ui/button";

function PaymentDetailsSelect() {
  const { state, setPaymentAccount } = useInvoiceForm();
  const { paymentAccount } = state;
  const { paymentAccounts, isPending: gettingPaymentAccounts } =
    useGetPaymentAccounts();

  return (
    <Select
      disabled={gettingPaymentAccounts}
      value={paymentAccount?.id}
      onValueChange={(value) => {
        const selectedAccount = paymentAccounts.find(
          (account) => account.id === value
        );
        if (selectedAccount) {
          setPaymentAccount(selectedAccount.id);
        }
      }}
    >
      <SelectTrigger className="w-full">
        <SelectValue
          defaultValue={paymentAccount?.id}
          placeholder="Select Payment details"
        />
      </SelectTrigger>
      <SelectContent>
        <SelectGroup>
          <SelectLabel>Available Accounts</SelectLabel>
          {paymentAccounts.map((account) => (
            <SelectItem
              defaultChecked={account.id === paymentAccount?.id}
              key={account.id}
              value={account.id}
              onClick={() => setPaymentAccount(account.id)}
            >
              {account.accountName}
            </SelectItem>
          ))}
        </SelectGroup>
        <div className=" border-t py-2">
          <Button variant="ghost" onClick={() => {}}>
            Add New Account
          </Button>
        </div>
      </SelectContent>
    </Select>
  );
}

export default PaymentDetailsSelect;
