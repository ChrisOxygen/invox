import ExternalNavMenu from "@/components/ExternalNavMenu";
import { FAQSection, TestimonialsSection } from "@/components/homepage";
import CTASection from "@/components/homepage/CTASection";
import MovingTextSection from "@/components/homepage/MovingTextSection";
import Image from "next/image";

export default function AboutPage() {
  return (
    <>
      <section className="min-h-[300px] grid grid-rows-[80px_1fr] w-full bg-contain bg-no-repeat bg-top bg-[url('/assets/shape-grid-top.svg')]">
        <ExternalNavMenu />
        <div className="row-start-2 content-wrapper flex flex-col justify-center w-full">
          <div className="flex  gap-6 justify-between w-full">
            <h2 className="font-bold text-2xl sm:text-3xl lg:text-5xl max-w-[600px] text-gray-900 leading-tight">
              Building Solutions from
              <span className="bg-gradient-to-r from-blue-600 to-cyan-500 bg-clip-text text-transparent">
                {" "}
                Personal Experience
              </span>
            </h2>
            <p className="max-w-[500px]">
              Invox is a modern invoicing platform designed specifically for
              small businesses and entrepreneurs who need to get paid faster.
              Our app transforms the tedious process of creating, sending, and
              tracking invoices into a seamless experience that takes minutes,
              not hours
            </p>
          </div>
          <Image
            src="/assets/team.webp"
            alt="About Invox"
            width={2000}
            height={2000}
            className="w-full object-cover mt-10 rounded-lg shadow-lg"
            style={{
              maskImage: "url('/assets/shape.png')",
              WebkitMaskImage: "url('/assets/shape.png')",
              maskSize: "100% 100%",
              WebkitMaskSize: "100% 100%",
              maskRepeat: "no-repeat",
              WebkitMaskRepeat: "no-repeat",
              maskPosition: "center",
              WebkitMaskPosition: "center",
            }}
          />
        </div>
      </section>
      <section className="bg-[url('/assets/decor-grid-double-big.webp')]">
        <div className="content-wrapper flex flex-col gap-8">
          <div className="flex flex-col gap-6 border-l-4 border-blue-500 py-6 pl-8 ">
            <div className="flex flex-col gap-4">
              <span className="uppercase font-semibold text-blue-600 text-xs sm:text-sm tracking-wider">
                OUR MISSION
              </span>
              <h3 className="font-bold text-2xl sm:text-3xl lg:text-4xl text-gray-900 leading-tight max-w-[800px]">
                To eliminate the frustration of invoicing for
                <span className="bg-gradient-to-r from-blue-600 to-cyan-500 bg-clip-text text-transparent">
                  {" "}
                  small businesses worldwide.
                </span>
              </h3>
            </div>
            <p className="text-base sm:text-lg text-gray-600 leading-relaxed max-w-[600px]">
              We believe every entrepreneur deserves tools that work as hard as
              they do – simple, reliable, and designed to get them paid faster
              so they can focus on growing their business.
            </p>
          </div>
          <div className="flex flex-col items-end self-end gap-6 border-r-4 border-blue-500 py-6 pr-8 ">
            <div className="flex flex-col justify-end gap-4">
              <span className="uppercase text-right font-semibold text-blue-600 text-xs sm:text-sm tracking-wider">
                OUR VISION
              </span>
              <h3 className="font-bold text-right text-2xl sm:text-3xl lg:text-4xl text-gray-900 leading-tight max-w-[800px]">
                A world where small business owners
                <span className="bg-gradient-to-r from-blue-600 to-cyan-500 bg-clip-text text-transparent">
                  {" "}
                  never have to chase payments again.
                </span>
              </h3>
            </div>
            <p className="text-base sm:text-lg text-right text-gray-600 leading-relaxed max-w-[600px]">
              We envision Invox becoming the go-to invoicing solution that
              transforms how entrepreneurs manage their cash flow, turning
              invoicing from a tedious chore into a seamless part of business
              growth.
            </p>
          </div>
        </div>
      </section>

      <MovingTextSection />

      <TestimonialsSection />
      <FAQSection />
      <CTASection />
    </>
  );
}
