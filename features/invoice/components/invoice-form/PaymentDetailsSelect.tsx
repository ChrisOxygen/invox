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
import { useInvoiceForm } from "../../index";
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
      <SelectTrigger className="w-full h-11 border-2 border-blue-200 hover:border-blue-400 focus:border-blue-600 focus:ring-2 focus:ring-blue-100 transition-all duration-200">
        <SelectValue
          defaultValue={paymentAccount?.id}
          placeholder="Select Payment details"
        />
      </SelectTrigger>
      <SelectContent className="bg-white border-2 border-blue-200 shadow-xl rounded-lg">
        <SelectGroup>
          <SelectLabel className="text-gray-700 font-semibold">
            Available Accounts
          </SelectLabel>
          {paymentAccounts.map((account) => (
            <SelectItem
              defaultChecked={account.id === paymentAccount?.id}
              key={account.id}
              value={account.id}
              onClick={() => setPaymentAccount(account.id)}
              className="hover:bg-blue-50 focus:bg-blue-50 cursor-pointer transition-colors duration-200"
            >
              {account.accountName}
            </SelectItem>
          ))}
        </SelectGroup>
        <div className="border-t border-blue-100 py-2">
          <Button
            className="bg-transparent text-blue-600 hover:bg-blue-50 hover:text-blue-700 transition-all duration-200"
            onClick={() => {}}
          >
            Add New Account
          </Button>
        </div>
      </SelectContent>
    </Select>
  );
}

export default PaymentDetailsSelect;
