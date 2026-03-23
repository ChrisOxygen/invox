"use client";

import InnerPageHeader from "@/components/InnerPageHeader";
import { FAQSection } from "@/components/homepage";
import CTASection from "@/components/homepage/CTASection";
import { ContactForm } from "@/components/contactpage";

export default function ContactPage() {
  return (
    <>
      <InnerPageHeader
        title="Contact us"
        description=" We would love to hear from you! Whether you have a question, feedback, or just want to say hello, feel free to reach out."
      />
      <section className="bg-white bg-contain bg-no-repeat bg-top bg-[url('/assets/shape-grid-top.svg')]">
        <div className="content-wrapper">
          <div className="flex flex-col lg:flex-row gap-12 lg:gap-16 items-center">
            {/* Left Side - Contact Info */}
            <div className="flex-1 flex flex-col gap-8">
              <div className="flex flex-col gap-4">
                <span className="uppercase font-semibold text-blue-600 text-xs sm:text-sm tracking-wider">
                  GET IN TOUCH
                </span>
                <h2 className="font-bold text-2xl sm:text-3xl lg:text-4xl max-w-[400px] text-gray-900 leading-tight">
                  Let&apos;s Talk.
                  <br />
                  <span className="bg-gradient-to-r from-blue-600 to-cyan-500 bg-clip-text text-transparent">
                    {" "}
                    We&apos;re All Ears.
                  </span>
                </h2>
              </div>

              <p className="text-base sm:text-lg text-gray-600 leading-relaxed max-w-[500px]">
                Whether you&apos;ve got a burning question, a big idea, or just
                want to say hi — we&apos;re ready to help and connect with you.
              </p>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-8">
                <div className="flex flex-col gap-3">
                  <h4 className="text-lg sm:text-xl font-semibold text-gray-900">
                    📧 Email us
                  </h4>
                  <div className="space-y-1">
                    <a
                      href="mailto:support@invox.com"
                      className="text-blue-600 font-medium text-base sm:text-lg hover:text-blue-700 transition-colors duration-200"
                    >
                      support@invox.com
                    </a>
                    <p className="text-gray-600 text-sm sm:text-base">
                      We reply within 24 hours.
                    </p>
                  </div>
                </div>

                <div className="flex flex-col gap-3">
                  <h4 className="text-lg sm:text-xl font-semibold text-gray-900">
                    🕒 Working Hours
                  </h4>
                  <div className="space-y-1">
                    <p className="text-gray-900 font-medium text-base sm:text-lg">
                      Monday to Friday
                    </p>
                    <p className="text-gray-600 text-sm sm:text-base">
                      9:00 AM – 5:00 PM (PST)
                    </p>
                  </div>
                </div>
              </div>

              <div className="bg-gradient-to-br from-blue-50 to-cyan-50 p-6 rounded-xl border border-blue-100">
                <h4 className="text-lg font-semibold text-gray-900 mb-2">
                  Quick Response
                </h4>
                <p className="text-gray-600 text-sm sm:text-base">
                  Need urgent support? Include &quot;URGENT&quot; in your
                  subject line and we&apos;ll prioritize your message.
                </p>
              </div>
            </div>

            {/* Right Side - Contact Form */}
            <ContactForm />
          </div>
        </div>
      </section>
      <FAQSection />
      <CTASection />
    </>
  );
}
