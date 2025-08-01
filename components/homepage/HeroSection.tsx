import { Button } from "@/components/ui/button";
import Image from "next/image";
import Link from "next/link";
import ExternalNavMenu from "../ExternalNavMenu";

export default function HeroSection() {
  return (
    <section className=" h-screen grid grid-rows-[80px_1fr] w-full bg-cover bg-[url('/assets/bg-scaled.webp')]">
      <ExternalNavMenu />
      <div className="row-start-2 flex flex-col gap-7 items-center justify-center">
        <div className="flex flex-col items-center text-center max-w-4xl mx-auto px-6">
          <h1 className="text-4xl md:text-5xl lg:text-5xl font-bold bg-gradient-to-r from-blue-600 to-cyan-500 bg-clip-text text-transparent mb-6 leading-tight">
            From Draft to Payment: <br />
            Professional Invoices in Minutes
          </h1>
          <p className="text-lg md:text-xl text-gray-600 mb-8 leading-relaxed">
            Create, send, and track invoices effortlessly. Get paid faster with
            automated reminders and seamless payment processing.
          </p>
          <div className="flex flex-col items-center gap-2">
            <Button className="bg-gradient-to-r from-blue-600 to-cyan-500 hover:from-blue-700 hover:to-cyan-600 text-white font-medium py-7 px-12 rounded-lg border-0 shadow-lg hover:shadow-xl transition-all duration-200 transform hover:scale-105 text-lg">
              Create Your First Invoice
            </Button>
            <Link
              href="/about"
              className="text-gray-800 text-sm hover:text-cyan-500 font-medium hover:underline transition-all duration-200"
            >
              Watch how it works
            </Link>
          </div>
        </div>
        <div className=" w-full max-w-[1400px] -mb-[500px]">
          <Image
            src="/assets/custom-img-08.webp"
            alt="Invoice Hero Image"
            width={2000}
            height={2000}
            className="w-full object-cover "
          />
        </div>
      </div>
    </section>
  );
}
