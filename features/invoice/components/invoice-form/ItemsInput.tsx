"use client";

import { useInvoiceForm } from "../../index";

import ItemRow from "./ItemRow";
import { Button } from "@/components/ui/button";

function ItemsInput() {
  const {
    state,

    addInvoiceItem,
  } = useInvoiceForm();
  const { invoiceItems } = state;

  const itemsExist = invoiceItems && invoiceItems.length > 0;
  return (
    <div className="flex flex-col  gap-2 w-full">
      <div className=" bg-gray-100  py-1 w-full grid grid-cols-[minmax(200px,1fr)_minmax(20px,60px)_minmax(50px,90px)_minmax(50px,90px)_30px] gap-4">
        <span className=" pl-2 font-semibold capitalize">Description</span>
        <span className=" font-semibold capitalize justify-self-center">
          Qty
        </span>
        <span className=" font-semibold capitalize">Unit Price</span>
        <span className=" font-semibold capitalize">Total</span>
        <span className=" font-semibold capitalize"></span>
      </div>
      <div className="flex w-full flex-col gap-5">
        <div className="flex w-full flex-col gap-3">
          {itemsExist &&
            invoiceItems.map((item, index) => (
              <ItemRow key={index} item={item} index={index} />
            ))}
        </div>
        <Button
          type="button"
          onClick={() =>
            addInvoiceItem({
              description: "",
              quantity: 1,
              unitPrice: 0,
            })
          }
          className="mt-2 bg-gradient-to-r from-blue-600 to-cyan-500 hover:from-blue-700 hover:to-cyan-600 text-white font-medium border-0 shadow-lg hover:shadow-xl transition-all duration-200 transform hover:scale-105"
        >
          Add Item
        </Button>
      </div>
    </div>
  );
}

export default ItemsInput;
