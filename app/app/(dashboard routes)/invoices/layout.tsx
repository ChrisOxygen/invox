import { InvoiceFormProvider } from "@/features/invoice/context/invoiceProviderDEMO";

function InvoiceLayout({ children }: { children: React.ReactNode }) {
  return <InvoiceFormProvider>{children}</InvoiceFormProvider>;
}

export default InvoiceLayout;
