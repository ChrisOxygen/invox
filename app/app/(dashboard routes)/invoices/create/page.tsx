import InvoiceEditor from "@/features/invoice/components/invoice-form/InvoiceEditor";
import InvoiceFormHeader from "@/features/invoice/components/InvoiceFormHeader";
import InvoiceFormSideBar from "@/features/invoice/components/InvoiceFormSideBar";

function CreateInvoicePage() {
  return (
    <div className="h-screen w-full grid grid-rows-[60px_1fr] sm:grid-rows-[70px_1fr] md:grid-rows-[80px_1fr]">
      <InvoiceFormHeader />
      <div className="w-full h-full lg:grid lg:grid-cols-[80px_1fr]">
        <div className="hidden lg:block">
          <InvoiceFormSideBar />
        </div>
        <div className="w-full h-[calc(100vh-60px)] sm:h-[calc(100vh-70px)] md:h-[calc(100vh-80px)]">
          <InvoiceEditor />
        </div>
      </div>
    </div>
  );
}

export default CreateInvoicePage;
