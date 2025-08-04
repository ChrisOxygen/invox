import Image from "next/image";

export default function FeaturesSection() {
  return (
    <section className=" bg-white">
      <div className="content-wrapper flex flex-col gap-16">
        <div className="flex flex-col lg:flex-row justify-between items-start gap-12">
          <div className="flex flex-col gap-6">
            <span className="uppercase font-semibold text-blue-600 text-xs sm:text-sm tracking-wider">
              Built for Small Business
            </span>
            <h2 className="font-bold text-2xl sm:text-3xl lg:text-4xl max-w-[500px] text-gray-900 leading-tight">
              Streamlining invoicing for
              <span className="bg-gradient-to-r from-blue-600 to-cyan-500 bg-clip-text text-transparent">
                {" "}
                entrepreneurs
              </span>
            </h2>
          </div>
          <p className="lg:max-w-[600px] max-w-full text-gray-600 text-base sm:text-lg lg:text-xl leading-relaxed">
            At Invox, we understand the challenges small business owners face
            with invoicing. Our platform is designed to simplify every step of
            the process, from creation to payment. Each feature reflects our
            commitment to helping entrepreneurs get paid faster and focus on
            what matters most - growing their business.
          </p>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          <div className="flex flex-col gap-6 p-8 bg-gradient-to-br from-blue-50 to-cyan-50 rounded-2xl border border-blue-100 hover:border-blue-200 hover:shadow-xl transition-all duration-300 transform hover:-translate-y-1">
            <div className="w-16 h-16 bg-gradient-to-br from-blue-600 to-cyan-500 rounded-xl flex items-center justify-center shadow-lg">
              <Image
                src="/assets/disruptive-innovation.png"
                alt="Smart Invoice Creation"
                width={32}
                height={32}
                className="object-contain filter brightness-0 invert"
              />
            </div>
            <h4 className="font-bold text-lg sm:text-xl text-gray-900">
              Smart Invoice Creation
            </h4>
            <p className="text-gray-600 text-sm sm:text-base leading-relaxed">
              Create professional invoices in seconds with customizable
              templates designed for your industry.
            </p>
          </div>
          <div className="flex flex-col gap-6 p-8 bg-gradient-to-br from-cyan-50 to-blue-50 rounded-2xl border border-cyan-100 hover:border-cyan-200 hover:shadow-xl transition-all duration-300 transform hover:-translate-y-1">
            <div className="w-16 h-16 bg-gradient-to-br from-cyan-500 to-blue-600 rounded-xl flex items-center justify-center shadow-lg">
              <Image
                src="/assets/reminder.png"
                alt="Automated Reminders"
                width={32}
                height={32}
                className="object-contain filter brightness-0 invert"
              />
            </div>
            <h4 className="font-bold text-lg sm:text-xl text-gray-900">
              Automated Reminders
            </h4>
            <p className="text-gray-600 text-sm sm:text-base leading-relaxed">
              Never chase payments again with smart, automated follow-up
              reminders that get results.
            </p>
          </div>
          <div className="flex flex-col gap-6 p-8 bg-gradient-to-br from-blue-50 to-cyan-50 rounded-2xl border border-blue-100 hover:border-blue-200 hover:shadow-xl transition-all duration-300 transform hover:-translate-y-1">
            <div className="w-16 h-16 bg-gradient-to-br from-blue-600 to-cyan-500 rounded-xl flex items-center justify-center shadow-lg">
              <Image
                src="/assets/mobile.png"
                alt="Instant Payments"
                width={32}
                height={32}
                className="object-contain filter brightness-0 invert"
              />
            </div>
            <h4 className="font-bold text-lg sm:text-xl text-gray-900">
              Instant Payments
            </h4>
            <p className="text-gray-600 text-sm sm:text-base leading-relaxed">
              Accept credit cards, bank transfers, and digital payments with
              seamless integration.
            </p>
          </div>
          <div className="flex flex-col gap-6 p-8 bg-gradient-to-br from-cyan-50 to-blue-50 rounded-2xl border border-cyan-100 hover:border-cyan-200 hover:shadow-xl transition-all duration-300 transform hover:-translate-y-1">
            <div className="w-16 h-16 bg-gradient-to-br from-cyan-500 to-blue-600 rounded-xl flex items-center justify-center shadow-lg">
              <Image
                src="/assets/real-time-monitoring.png"
                alt="Real-time Analytics"
                width={32}
                height={32}
                className="object-contain filter brightness-0 invert"
              />
            </div>
            <h4 className="font-bold text-lg sm:text-xl text-gray-900">
              Real-time Analytics
            </h4>
            <p className="text-gray-600 text-sm sm:text-base leading-relaxed">
              Track your revenue, outstanding payments, and cash flow with
              detailed reporting dashboards.
            </p>
          </div>
        </div>
      </div>
    </section>
  );
}
