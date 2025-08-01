import Image from "next/image";

import { TbFileAnalytics } from "react-icons/tb";

import { GrDocumentPerformance } from "react-icons/gr";

export default function AnalyticsInsightsSection() {
  return (
    <section className="py-24 bg-gray-50 bg-cover bg-right bg-[url('/assets/decor-grid-double-big.webp')]">
      <div className="content-wrapper flex gap-16 items-center">
        <div className="basis-1/2 flex flex-col gap-12">
          <div className="flex flex-col gap-6">
            <div className="flex flex-col gap-4">
              <span className="uppercase font-semibold text-blue-600 text-sm tracking-wider">
                Smart business intelligence
              </span>
              <h2 className="font-bold text-4xl max-w-[400px] text-gray-900 leading-tight">
                Get powerful
                <span className="bg-gradient-to-r from-blue-600 to-cyan-500 bg-clip-text text-transparent">
                  {" "}
                  financial insights
                </span>
              </h2>
            </div>

            <p className="max-w-[600px] text-gray-600 text-xl leading-relaxed">
              Invox transforms your invoicing data into actionable business
              intelligence. Our advanced analytics help you understand payment
              patterns, identify your best clients, and optimize your cash flow
              for sustainable growth.
            </p>
          </div>
          <div className="flex gap-8">
            <div className="flex flex-col gap-4 flex-1">
              <div className="size-16 rounded-xl mb-3 grid place-items-center text-3xl bg-gradient-to-br from-blue-600 to-cyan-500 text-white shadow-lg">
                <TbFileAnalytics />
              </div>
              <h4 className="font-bold text-2xl text-gray-900 leading-tight">
                Cash Flow Forecasting
              </h4>
              <p className="text-gray-600 text-base leading-relaxed">
                Predict your future revenue with intelligent forecasting based
                on your invoicing history and payment patterns.
              </p>
            </div>
            <div className="flex flex-col gap-4 flex-1">
              <div className="size-16 rounded-xl mb-3 grid place-items-center text-3xl bg-gradient-to-br from-blue-600 to-cyan-500 text-white shadow-lg">
                <GrDocumentPerformance />
              </div>
              <h4 className="font-bold text-2xl text-gray-900 leading-tight">
                Performance Analytics
              </h4>
              <p className="text-gray-600 text-base leading-relaxed">
                Identify your most valuable clients and track payment behaviors
                to strengthen business relationships.
              </p>
            </div>
          </div>
        </div>
        <div className="basis-1/2 relative min-h-[600px]">
          <Image
            src="/assets/custom-img-10.jpg"
            alt="Analytics Dashboard"
            width={2000}
            height={2000}
            className="w-full object-cover absolute max-w-[450px] -top-10 left-0 rounded-2xl shadow-xl border border-gray-200"
          />
          <Image
            src="/assets/custom-img-11.jpg"
            alt="Financial Insights"
            width={2000}
            height={2000}
            className="w-full object-cover absolute max-w-[450px] -bottom-20 right-0 rounded-2xl shadow-xl border border-gray-200"
          />
        </div>
      </div>
    </section>
  );
}
