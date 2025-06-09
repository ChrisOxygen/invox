import Logo from "@/components/Logo";
import React from "react";
import { INVOICE_DUMMY_DATA } from "../../constants";

function Template1() {
  const { invoice, agency, client, services, financial, terms } =
    INVOICE_DUMMY_DATA;

  return (
    <div className=" max-w-[794px] w-full bg-white aspect-70/99 overflow-x-clip flex flex-col gap-5">
      <div className=" px-10 flex">
        <div className=" pt-5 flex justify-center">
          <Logo />
        </div>
      </div>
      <div className="flex flex-col gap-5">
        <div className=" px-10 relative flex justify-end before:content-[' '] before:absolute before:inset-0 before:bg-orange-400 before:h-[50%] before:top-1/2 before:-translate-y-1/2">
          <p className=" uppercase relative  text-4xl  font-roboto-condensed bg-white px-3 py-1">
            Invoice
          </p>
        </div>
        <div className="px-10 relative flex flex-col">
          <span className=" font-bold text-lg">Invoice to:</span>
          <div className=" flex text-xs justify-between font-jetbrains-mono items-end">
            <div className=" flex flex-col w-[200px]">
              <h4 className="font-bold">{client.name}</h4>
              <span className="font-medium">{client.contactPerson}</span>
              <span className="">{client.address}</span>
            </div>
            <div className=" flex flex-col">
              <p className=" flex justify-between items-center">
                <span className=" font-bold">Invoice #</span>
                <span className="">{invoice.number}</span>
              </p>
              <p className=" flex justify-between items-center">
                <span className=" font-bold">Date</span>
                <span className="">{invoice.date}</span>
              </p>
              <p className=" flex justify-between items-center">
                <span className=" font-bold">Due Date</span>
                <span className="">{invoice.dueDate}</span>
              </p>
            </div>
          </div>
        </div>
        <div className="px-10 relative flex">
          <div className="border min-h-[400px] flex flex-col w-full font-jetbrains-mono text-xs">
            <div className="grid grid-cols-[20px_1fr_50px_25px_60px] p-2 text-white gap-5 bg-black">
              <span className="justify-self-center">sl.</span>
              <span className="">Item description</span>
              <span className="">Price</span>
              <span className=" justify-self-center">Qty.</span>
              <span className="">Total</span>
            </div>
            {services.map((service, index) => (
              <div
                key={service.id}
                className="grid grid-cols-[20px_1fr_50px_25px_60px] px-2 py-4 gap-5 even:bg-gray-100"
              >
                <span className=" justify-self-center">{index + 1}</span>
                <span>{service.description}</span>
                <span>${service.price.toFixed(2)}</span>
                <span className=" justify-self-center">{service.quantity}</span>
                <span>${service.total.toFixed(2)}</span>
              </div>
            ))}
          </div>
        </div>
        <div className="px-10 relative flex justify-between text-xs font-jetbrains-mono items-start">
          <div className=" flex flex-col gap-5 w-[230px]">
            <p className=" font-semibold">{terms.message}</p>
            <div className="flex flex-col gap-1">
              <span className=" font-bold">Terms and Conditions:</span>
              <span className="">{terms.conditions}</span>
            </div>
            <div className="flex flex-col gap-1">
              <span className=" font-bold">Payment info:</span>
              <p className=" flex justify-between">
                <span className=" font-semibold">account #:</span>
                <span className="">{agency.payment.accountNumber}</span>
              </p>
              <p className=" flex justify-between">
                <span className=" font-semibold shrink-0 mr-auto">
                  acc name:
                </span>
                <span className=" text-right">
                  {agency.payment.accountName}
                </span>
              </p>
              <p className=" flex justify-between">
                <span className=" font-semibold  shrink-0 mr-auto">
                  Bank Name:
                </span>
                <span className="text-right">{agency.payment.bankName}</span>
              </p>
            </div>
          </div>
          <div className=" flex flex-col gap-5 w-[150px]">
            <div className="flex flex-col gap-1">
              <p className=" flex justify-between">
                <span className=" font-semibold  shrink-0 mr-auto">
                  sub Total:
                </span>
                <span className="">${financial.subtotal.toFixed(2)}</span>
              </p>
              <p className=" flex justify-between">
                <span className=" font-semibold">Tax:</span>
                <span className="">${financial.taxAmount.toFixed(2)}</span>
              </p>
            </div>
            <div className="flex font-bold py-1 text-sm relative before:content-[' '] before:absolute before:inset-0 before:-left-5 before:w-[500px] before:bg-orange-400 justify-between">
              <span className=" z-10 font-semibold">Total:</span>
              <span className="z-10 ">${financial.total.toFixed(2)}</span>
            </div>
          </div>
        </div>
      </div>
      <div className=" border-t-3 border-t-orange-400 text-xs font-jetbrains-mono mt-auto flex items-center justify-between px-10 py-5">
        <div className="flex gap-2 items-center">
          <span className="  pr-2 font-semibold">{agency.phone}</span>
          <span className="  px-2 border-l font-semibold">{agency.email}</span>
          <span className="  px-2 border-l font-semibold">
            {agency.website}
          </span>
        </div>
        <div className=" bg-white flex-col px-4 -mt-20 flex">
          <span className=" h-10 border-t"></span>
          <span className=" border-t font-bold px-2 pt-1">Authorised Sign</span>
        </div>
      </div>
    </div>
  );
}

export default Template1;
