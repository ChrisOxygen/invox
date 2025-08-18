import React from "react";
import { InvoiceTemplateProps } from "../pdf/reactPDFTemplate1";

function Template1({
  invoice,
  client,
  userAndBusiness,
  paymentAccount,
  theme = "classic",
}: InvoiceTemplateProps) {
  return <main className=""></main>;
}

export default Template1;
