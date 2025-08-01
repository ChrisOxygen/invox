"use client";

import { FAQ_DATA } from "@/constants";
import clsx from "clsx";
import { useState } from "react";

import { FaPlus } from "react-icons/fa6";
import { FaMinus } from "react-icons/fa6";

export default function FAQSection() {
  const [openFaqIndex, setOpenFaqIndex] = useState<null | number>(null);

  const toggleFaq = (index: number) => {
    setOpenFaqIndex((prevIndex) => (prevIndex === index ? null : index));
  };
  return (
    <section className=" bg-gray-50 bg-cover bg-right bg-[url('/assets/decor-grid-double-big.webp')]">
      <div className="content-wrapper flex flex-col items-center gap-16">
        <div className="flex flex-col items-center gap-6 text-center">
          <span className="uppercase font-semibold text-blue-600 text-sm tracking-wider">
            Got Questions?
          </span>
          <h2 className="font-bold text-4xl text-center max-w-[500px] text-gray-900 leading-tight">
            Everything you need to know about
            <span className="bg-gradient-to-r from-blue-600 to-cyan-500 bg-clip-text text-transparent">
              {" "}
              Invox
            </span>
          </h2>
          <p className="text-xl text-gray-600 max-w-[600px] leading-relaxed">
            Find answers to the most common questions about our invoice
            management platform
          </p>
        </div>
        <div className="flex flex-col gap-6 w-full max-w-[800px]">
          {FAQ_DATA.map((faq, index) => (
            <div
              key={index}
              className={clsx(
                "rounded-lg border transition-all duration-300 bg-white shadow-sm hover:shadow-md",
                openFaqIndex === index
                  ? "border-blue-200 shadow-lg"
                  : "border-gray-200"
              )}
            >
              <button
                className="w-full p-6 bg-transparent cursor-pointer flex justify-between items-center text-left hover:bg-gray-50 transition-all duration-200"
                onClick={() => toggleFaq(index)}
              >
                <h3 className="font-semibold text-xl text-gray-900 leading-relaxed">
                  {faq.question}
                </h3>
                <span
                  className={clsx(
                    "flex-shrink-0 ml-4 text-blue-600 transition-transform duration-300",
                    openFaqIndex === index ? "transform rotate-180" : ""
                  )}
                >
                  {openFaqIndex === index ? (
                    <FaMinus className="w-5 h-5" />
                  ) : (
                    <FaPlus className="w-5 h-5" />
                  )}
                </span>
              </button>
              <div
                className={clsx(
                  "overflow-hidden transition-all duration-300 ease-in-out",
                  openFaqIndex === index
                    ? "max-h-[300px] opacity-100"
                    : "max-h-0 opacity-0"
                )}
              >
                <p className="text-gray-600 text-lg leading-relaxed px-6 pb-6 border-t border-gray-100">
                  {faq.answer}
                </p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
