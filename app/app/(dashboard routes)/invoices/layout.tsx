import { InvoiceFormProvider } from "@/features/invoice/context/InvoiceFormProvider";

function InvoiceLayout({ children }: { children: React.ReactNode }) {
  return <InvoiceFormProvider>{children}</InvoiceFormProvider>;
}

export default InvoiceLayout;
