"use client";

import { Input } from "@/components/ui/input";
import React from "react";
import { useInvoiceForm } from "../../index";

function DiscountInput() {
  const { state, setDiscount } = useInvoiceForm();
  const { discount } = state;

  return (
    <div className="">
      <Input
        type="number"
        placeholder="Discount Amount"
        value={discount}
        onChange={(e) => setDiscount(Number(e.target.value))}
      />
    </div>
  );
}

export default DiscountInput;
