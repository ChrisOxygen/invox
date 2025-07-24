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
    <div className="flex flex-col gap-6 p-6 sm:p-8">
      {/* Header Section */}
      <div className="flex flex-col gap-2">
        <h2 className="text-2xl sm:text-3xl font-bold tracking-tight bg-gradient-to-r from-blue-600 via-cyan-500 to-blue-500 bg-clip-text text-transparent">
          Invoice Details
        </h2>
        <p className="text-sm text-gray-600">
          Complete the form below to create your invoice
        </p>
      </div>

      {/* Form Section */}
      <div className="flex flex-col gap-6">
        {/* Client Selection */}
        <div className="flex flex-col gap-3">
          <label className="text-sm font-semibold text-gray-900 flex items-center gap-2">
            Select a client/customer
            <span className="text-red-500 text-base">*</span>
          </label>
          <div className="relative">
            <ClientSelect
              value={client}
              onChange={setClient}
              placeholder="Choose a client..."
            />
          </div>
        </div>

        {/* Due Date */}
        <div className="flex flex-col gap-3">
          <DueDateInput
            value={paymentDueDate}
            onChange={setPaymentDueDate}
            placeholder="Choose a due date..."
          />
        </div>

        {/* Items Section */}
        <div className="flex flex-col gap-3">
          <label className="text-sm font-semibold text-gray-900 flex items-center gap-2">
            Items
            <span className="text-red-500 text-base">*</span>
          </label>
          <div className="relative">
            <ItemsInput />
          </div>
        </div>

        {/* Tax and Discount Row */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 sm:gap-6">
          <div className="flex flex-col gap-3">
            <label className="text-sm font-semibold text-gray-900">
              Tax Amount
            </label>
            <div className="relative">
              <TaxInput />
            </div>
          </div>
          <div className="flex flex-col gap-3">
            <label className="text-sm font-semibold text-gray-900">
              Discount Amount
            </label>
            <div className="relative">
              <DiscountInput />
            </div>
          </div>
        </div>

        {/* Payment Details */}
        <div className="flex flex-col gap-3">
          <label className="text-sm font-semibold text-gray-900 flex items-center gap-2">
            Payment details
            <span className="text-red-500 text-base">*</span>
          </label>
          <div className="relative">
            <PaymentDetailsSelect />
          </div>
        </div>

        {/* Late Fee Options */}
        <div className="flex flex-col gap-3">
          <label className="text-sm font-semibold text-gray-900">
            Late Fee Options
          </label>
          <div className="relative">
            <LatenessFeeInput />
          </div>
        </div>

        {/* Customer Notes */}
        <div className="flex flex-col gap-3">
          <label className="text-sm font-semibold text-gray-900">
            Customer Notes
          </label>
          <div className="relative">
            <CustomerNotesInput
              value={state.customNote}
              onChange={setCustomNote}
              placeholder="Thanks for trusting us with your business..."
              maxLength={500}
              rows={4}
            />
          </div>
        </div>
      </div>
    </div>
  );
}

export default InvoiceDetails;
