import React from "react";

function Step1() {
  return (
    <div className="flex flex-col relative gap-5 max-w-[500px]">
      <h1 className="text-white text-[61px] leading-[61px] font-bold tracking-[-4px] font-['Space_Grotesk']">
        Welcome to InvoX!
      </h1>
      <p className="font-['Inter'] text-lg leading-7 font-semibold tracking-normal text-white">
        Your all-in-one solution for professional invoicing. Create, send, and
        track invoices effortlessly while getting paid faster.
      </p>
    </div>
  );
}

export default Step1;
