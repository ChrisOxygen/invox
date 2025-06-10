import InvoiceForm from "@/features/invoice/components/create-invoice/InvoiceForm";
import InvoicePreview from "@/features/invoice/components/InvoicePreview";

function CreateInvoicePage() {
  return (
    <div className=" grid grid-cols-[minmax(350px,750px)_1fr] gap-4">
      <InvoiceForm />

      <div className="h-full overflow-hidden rounded-lg bg-gray-100">
        <InvoicePreview />
      </div>
    </div>
  );
}

export default CreateInvoicePage;
