"use client";
import { ClientSelect } from "./ClientSelect";
import { useInvoiceForm } from "../../index";
import DueDateInput from "./DueDateInput";
import ItemsInput from "./ItemsInput";
import CustomerNotesInput from "./CustomerNotesInput";
import TaxInput from "./TaxInput";
import PaymentDetailsSelect from "./PaymentDetailsSelect";
import LatenessFeeInput from "./LatenessFeeInput";
import DiscountInput from "./DiscountInput";

function InvoiceDetails() {
  const { state, setClient, setPaymentDueDate, setCustomNote } =
    useInvoiceForm();
  const { client, paymentDueDate } = state;
  return (
    <div className="flex flex-col gap-6">
      <h2 className="text-lg font-semibold">Invoice Details</h2>
      <div className="flex flex-col gap-5">
        <div className="flex flex-col gap-2">
          <label className="text-sm font-medium text-gray-900">
            Select a client/customer <span className="text-red-500">*</span>
          </label>
          <ClientSelect
            value={client}
            onChange={setClient}
            placeholder="Choose a client..."
          />
        </div>
        <div className="flex flex-col gap-2">
          <DueDateInput
            value={paymentDueDate}
            onChange={setPaymentDueDate}
            placeholder="Choose a due date..."
          />
        </div>
        <div className="flex flex-col gap-2">
          <label className="text-sm font-medium text-gray-900">
            Items <span className="text-red-500">*</span>
          </label>
          <ItemsInput />
        </div>
        <div className="flex gap-3 w-full">
          <div className="flex flex-col gap-2 flex-grow">
            <label className="text-sm font-medium text-gray-900">
              Tax Amount
            </label>
            <TaxInput />
          </div>
          <div className="flex flex-col gap-2 flex-grow">
            <label className="text-sm font-medium text-gray-900">
              Discount Amount
            </label>
            <DiscountInput />
          </div>
        </div>
        <div className="flex flex-col gap-2 flex-grow">
          <label className="text-sm font-medium text-gray-900">
            Payment details <span className="text-red-500">*</span>
          </label>
          <PaymentDetailsSelect />
        </div>
        <div className="flex flex-col gap-2 flex-grow">
          <label className="text-sm font-medium text-gray-900">
            Late Fee Options
          </label>
          <LatenessFeeInput />
        </div>

        <div className="flex flex-col gap-2">
          <CustomerNotesInput
            value={state.customNote}
            onChange={setCustomNote}
            placeholder="Thanks for trusting us"
            maxLength={500}
            rows={4}
          />
        </div>
      </div>
    </div>
  );
}

export default InvoiceDetails;
