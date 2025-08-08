"use client";
import { ClientSelect } from "./ClientSelect";
import DueDateInput from "./DueDateInput";
import ItemsInput from "./ItemsInput";
import CustomerNotesInput from "./CustomerNotesInput";
import TaxInput from "./TaxInput";
import PaymentDetailsSelect from "./PaymentDetailsSelect";
import LatenessFeeInput from "./LatenessFeeInput";
import DiscountInput from "./DiscountInput";
import TaxTypeInput from "./TaxTypeInput";
import DiscountTypeInput from "./DiscountTypeInput";

function InvoiceDetails() {
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
            <ClientSelect />
          </div>
        </div>

        {/* Due Date */}
        <div className="flex flex-col gap-3">
          <DueDateInput />
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

        {/* Discount Type and Discount Amount */}
        <div className="flex flex-col gap-6">
          <div className="relative">
            <DiscountTypeInput />
          </div>
          <div className="relative">
            <DiscountInput />
          </div>
        </div>

        {/* Tax Structure and Tax Amount */}
        <div className="flex flex-col gap-6">
          <div className="relative">
            <TaxTypeInput />
          </div>
          <div className="relative">
            <TaxInput />
          </div>
        </div>

        {/* Payment Details */}
        <div className="relative">
          <PaymentDetailsSelect />
        </div>

        {/* Late Fee Options */}
        <div className="relative">
          <LatenessFeeInput />
        </div>

        {/* Customer Notes */}
        <div className="relative">
          <CustomerNotesInput />
        </div>
      </div>
    </div>
  );
}

export default InvoiceDetails;
