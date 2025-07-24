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
        className="h-11 border-2 border-blue-200 hover:border-blue-400 focus:border-blue-600 focus:ring-2 focus:ring-blue-100 transition-all duration-200"
      />
    </div>
  );
}

export default TaxInput;
