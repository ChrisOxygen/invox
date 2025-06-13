import React from "react";
import { INVOICE_DUMMY_DATA } from "../../constants";
import Logo from "@/components/Logo";

function Template2() {
  const { invoice, agency, client, services, financial, terms } =
    INVOICE_DUMMY_DATA;
  return (
    <div className=" max-w-[794px] w-full bg-white font-jetbrains-mono flex flex-col gap-5">
      <div className=" px-12 w-full items-center flex justify-between">
        <span className="text-4xl text-teal-700 py-10 uppercase font-bold font-inter">
          Invoice
        </span>
        <Logo />
      </div>
      <div className=" px-12 flex flex-col gap-6">
        <div className=" flex  justify-between items-start w-full">
          <div className="flex flex-col text-teal-700 max-w-[300px]">
            <span className="font-extrabold capitalize font-inter mb-1">
              Bill to:
            </span>
            <span className="">{client.name}</span>
            <span className="">{client.address}</span>
          </div>
          <div className="flex flex-col gap-2 items-end text-teal-700 max-w-[240px]">
            <div className="flex flex-col items-end text-teal-700 max-w-[240px]">
              <span className="font-extrabold capitalize font-inter mb-1">
                Invoice #:
              </span>
              <span className="">{invoice.number}</span>
            </div>
            <div className="flex flex-col items-end text-teal-700 max-w-[240px]">
              <span className="font-extrabold capitalize font-inter mb-1">
                Billed date:
              </span>
              <span className="">{invoice.date}</span>
            </div>
            <div className="flex flex-col items-end text-teal-700 max-w-[240px]">
              <span className="font-extrabold capitalize font-inter mb-1">
                Due Date:
              </span>
              <span className="">{invoice.dueDate}</span>
            </div>
          </div>
        </div>
      </div>
      <div className="px-12">
        <div className=" relative h-[1px] bg-teal-700 w-full before:absolute before:content-[''] before:rounded-full before:size-2 before:bg-teal-700 before:left-0 before:top-1/2 before:-translate-y-1/2  after:absolute after:content-[''] after:rounded-full after:size-2 after:bg-teal-700 after:right-0 after:top-1/2 after:-translate-y-1/2"></div>
      </div>
      <div className="px-12">
        <div className="flex flex-col w-full">
          <div className="min-h-[400px] flex flex-col w-full font-jetbrains-mono text-xs">
            <div className="grid grid-cols-[20px_1fr_80px_25px_100px] p-2 font-extrabold font-inter text-sm text-teal-700 gap-5">
              <span className="justify-self-center">sl.</span>
              <span className="">Item description</span>
              <span className="">Price</span>
              <span className=" justify-self-center">Qty.</span>
              <span className=" justify-self-end">Total</span>
            </div>
            {services.map((service, index) => (
              <div
                key={service.id}
                className="grid grid-cols-[20px_1fr_80px_25px_100px] px-2 py-4 text-teal-700 gap-5 "
              >
                <span className=" justify-self-center">{index + 1}</span>
                <span>{service.description}</span>
                <span>${service.price.toFixed(2)}</span>
                <span className=" justify-self-center">{service.quantity}</span>
                <span className=" justify-self-end">
                  ${service.total.toFixed(2)}
                </span>
              </div>
            ))}
          </div>
        </div>
      </div>
      <div className="px-12">
        <div className=" relative h-[1px] bg-teal-700 w-full before:absolute before:content-[''] before:rounded-full before:size-2 before:bg-teal-700 before:left-0 before:top-1/2 before:-translate-y-1/2  after:absolute after:content-[''] after:rounded-full after:size-2 after:bg-teal-700 after:right-0 after:top-1/2 after:-translate-y-1/2"></div>
      </div>
      <div className="px-12">
        <div className="relative text-teal-700 flex justify-between text-xs font-jetbrains-mono items-start">
          <div className=" flex flex-col gap-5 w-[230px]">
            <div className="flex flex-col gap-1">
              <span className=" font-extrabold font-inter text-sm text-teal-700">
                Terms and Conditions:
              </span>
              <span className="">{terms.conditions}</span>
            </div>
            <div className="flex flex-col gap-1">
              <span className=" font-extrabold font-inter text-sm text-teal-700">
                Payment info:
              </span>
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
              <p className=" grid grid-cols-[minmax(max-content,1fr)_1fr] gap-3 items-center justify-end">
                <span className="font-extrabold font-inter text-right text-sm text-teal-700  shrink-0 mr-auto">
                  Sub Total:
                </span>
                <span className=" text-right">
                  ${financial.subtotal.toFixed(2)}
                </span>
              </p>
              <p className=" grid grid-cols-[minmax(max-content,1fr)_1fr] gap-3 items-center justify-end">
                <span className="font-extrabold text-right font-inter text-sm text-teal-700">
                  Tax:
                </span>
                <span className=" text-right">
                  ${financial.taxAmount.toFixed(2)}
                </span>
              </p>
            </div>
            <div className="grid grid-cols-[minmax(max-content,1fr)_1fr] font-bold py-1 text-sm relative justify-between">
              <span className=" z-10 text-right font-extrabold capitalize font-inter text-sm text-teal-700">
                Total:
              </span>
              <span className="z-10 text-right">
                ${financial.total.toFixed(2)}
              </span>
            </div>
          </div>
        </div>
      </div>
      <div className="px-12 w-full py-8 bg-teal-700 text-white flex items-center gap-4 justify-between">
        <span className="  ">{agency.email}</span>
        <span className="  ">{agency.website}</span>
      </div>
    </div>
  );
}

export default Template2;
