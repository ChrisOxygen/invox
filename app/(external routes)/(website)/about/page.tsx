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
          <div className="flex flex-col sm:flex-row  gap-6 justify-between w-full">
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
          <div className="flex flex-col items-end self-end gap-6 border-r-4 border-cyan-500 py-6 pr-8 ">
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
      <section className="bg-white ">
        <div className="content-wrapper flex flex-col gap-12 sm:gap-16">
          <div className="flex flex-col gap-4">
            <span className="uppercase font-semibold text-blue-600 text-xs sm:text-sm tracking-wider">
              FOUNDER & DEVELOPER OF INVOX
            </span>
            <h2 className="font-bold text-4xl sm:text-5xl lg:text-6xl xl:text-7xl text-gray-900 leading-tight">
              Christopher
              <span className="bg-gradient-to-r from-blue-600 to-cyan-500 bg-clip-text text-transparent">
                {" "}
                Okafor
              </span>
            </h2>
          </div>

          <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6">
            <Image
              src="/assets/abt-img-1.webp"
              alt="Christopher Okafor - Founder of Invox"
              width={300}
              height={400}
              className="w-full aspect-[3/4] object-cover rounded-lg border-2 border-blue-500 shadow-sm hover:shadow-md transition-shadow duration-200"
            />
            <Image
              src="/assets/abt-img-2.webp"
              alt="Christopher Okafor - Developer"
              width={300}
              height={400}
              className="w-full aspect-[3/4] object-cover rounded-lg border-2 border-blue-500 shadow-sm hover:shadow-md transition-shadow duration-200"
            />
            <Image
              src="/assets/abt-img-3.webp"
              alt="Christopher Okafor - Entrepreneur"
              width={300}
              height={400}
              className="w-full aspect-[3/4] object-cover rounded-lg border-2 border-blue-500 shadow-sm hover:shadow-md transition-shadow duration-200"
            />
            <Image
              src="/assets/abt-img-4.webp"
              alt="Christopher Okafor - Tech Leader"
              width={300}
              height={400}
              className="w-full aspect-[3/4] object-cover rounded-lg border-2 border-blue-500 shadow-sm hover:shadow-md transition-shadow duration-200"
            />
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 lg:gap-12">
            <div className="flex flex-col gap-6">
              <div className="flex flex-col gap-3">
                <h4 className="text-xl sm:text-2xl font-semibold text-gray-900">
                  From Challenge to Solution
                </h4>
                <p className="text-base sm:text-lg text-gray-600 leading-relaxed">
                  In 2022, I started my programming journey in my thirties while
                  living in Nigeria. As a small business owner myself, I
                  experienced firsthand the frustration of slow, complicated
                  invoicing and chasing clients for payments. I knew there had
                  to be a better way.
                </p>
              </div>

              <div className="flex flex-col gap-3">
                <h4 className="text-xl sm:text-2xl font-semibold text-gray-900">
                  The Birth of Invox
                </h4>
                <p className="text-base sm:text-lg text-gray-600 leading-relaxed">
                  Invox began as my second Next.js project – what I initially
                  considered practice. But as I poured my heart into every
                  feature, it became something much more meaningful. This
                  isn&apos;t just an app; it&apos;s my commitment to fellow
                  entrepreneurs who deserve tools that work as hard as they do.
                </p>
              </div>
            </div>

            <div className="flex flex-col gap-6">
              <div className="flex flex-col gap-3">
                <h4 className="text-xl sm:text-2xl font-semibold text-gray-900">
                  Built with AI, Powered by Purpose
                </h4>
                <p className="text-base sm:text-lg text-gray-600 leading-relaxed">
                  I believe in leveraging every available tool to create better
                  solutions. Invox was built with AI assistance – from
                  generating clean code to optimizing algorithms. This
                  collaboration allowed me to focus on what matters most:
                  creating an intuitive user experience that solves real
                  problems.
                </p>
              </div>

              <div className="flex flex-col gap-3">
                <h4 className="text-xl sm:text-2xl font-semibold text-gray-900">
                  Still Learning, Always Growing
                </h4>
                <p className="text-base sm:text-lg text-gray-600 leading-relaxed">
                  I&apos;m still learning and discovering new ways to make Invox
                  better. Every user becomes part of this journey. When you use
                  Invox, you&apos;re supporting a dream that started with a
                  simple belief: small businesses deserve software that
                  understands their hustle and helps them get paid quickly.
                </p>
              </div>
            </div>
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
