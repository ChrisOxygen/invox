"use client";

import { useInvoiceForm } from "../context/invoiceProviderDEMO";
import { ClientSelect } from "./ClientSelect";
import DueDateInput from "./DueDateInput";
import { InvoiceItemsFormDemo } from "./InvoiceItemsFormDemo";
import CustomerNotesInput from "./CustomerNotesInput";

function InvoiceFormDemo() {
  const {
    state,
    setClient,
    setPaymentDueDate,
    setCustomNote,
    validateForm,
    getValidationErrors,
  } = useInvoiceForm();

  const isFormValid = validateForm();
  const validationErrors = getValidationErrors();

  return (
    <div className="flex flex-col gap-5">
      <div className="border p-4">
        <h2 className="text-lg font-bold">Invoice Form State</h2>
        <p className="text-sm">Current mode: {state.formMode}</p>
        {state.invoiceId && (
          <p className="text-sm">Current ID: {state.invoiceId}</p>
        )}
        {state.client && (
          <p className="text-sm">
            Selected client: {state.client.BusinessName}
          </p>
        )}
        {state.paymentDueDate && (
          <p className="text-sm">
            Due date: {state.paymentDueDate.toLocaleDateString()}
          </p>
        )}
        <p className="text-sm">Notes: {state.customNote}</p>
        <div className="mt-2">
          <p
            className={`text-sm font-medium ${
              isFormValid ? "text-green-600" : "text-red-600"
            }`}
          >
            Form Status: {isFormValid ? "Valid" : "Invalid"}
          </p>
          {!isFormValid && (
            <ul className="text-xs text-red-600 mt-1 list-disc list-inside">
              {validationErrors.map((error, index) => (
                <li key={index}>{error}</li>
              ))}
            </ul>
          )}
        </div>
      </div>

      <div className="w-full max-w-2xl mx-auto p-4 space-y-6">
        <div>
          <label className="block text-sm font-medium mb-2">
            Select Client
          </label>
          <ClientSelect
            value={state.client}
            onChange={setClient}
            placeholder="Choose a client..."
          />
        </div>{" "}
        <div>
          <DueDateInput
            value={state.paymentDueDate}
            onChange={setPaymentDueDate}
            placeholder="Select payment terms..."
            disabled={false}
          />
        </div>
        <div>
          <label className="block text-sm font-medium mb-2">
            Invoice Items
          </label>
          <InvoiceItemsFormDemo />
        </div>{" "}
        <div>
          <CustomerNotesInput
            value={state.customNote}
            onChange={setCustomNote}
          />
        </div>
      </div>
    </div>
  );
}

export default InvoiceFormDemo;
