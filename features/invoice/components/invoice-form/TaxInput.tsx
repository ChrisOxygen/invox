"use client";

import { Input } from "@/components/ui/input";
import React from "react";
import { useInvoiceForm } from "../../index";

function TaxInput() {
  const { state, setTax } = useInvoiceForm();
  const { tax } = state;

  return (
    <div className="">
      <Input
        type="number"
        placeholder="Tax Amount"
        value={tax}
        onChange={(e) => setTax(Number(e.target.value))}
      />
    </div>
  );
}

export default TaxInput;
