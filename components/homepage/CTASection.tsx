import { Button } from "../ui/button";
import Link from "next/link";

function CTASection() {
  return (
    <section className="bg-white">
      <div className="content-wrapper">
        <div className="rounded-3xl flex flex-col bg-cover bg-center bg-[url('/assets/cta-bg-1.webp')] relative overflow-hidden">
          {/* Overlay for better text readability */}
          <div className="absolute inset-0 bg-blue-900/20 rounded-3xl"></div>

          <div className="relative z-10 my-8 sm:my-10 lg:my-16 py-6 sm:py-8 lg:py-12 px-6 sm:px-8 lg:px-12 flex flex-col gap-6 sm:gap-8 items-center w-full mx-auto max-w-[800px]">
            <h2 className="text-2xl sm:text-3xl md:text-4xl lg:text-5xl xl:text-6xl font-bold text-center leading-tight bg-gradient-to-r from-white to-cyan-100 bg-clip-text text-transparent drop-shadow-lg">
              Take your invoicing to the next level!
            </h2>

            <p className="text-sm sm:text-base lg:text-lg text-white/90 max-w-[600px] text-center leading-relaxed drop-shadow-md">
              Join thousands of satisfied users and streamline your invoicing
              process today with our powerful, intuitive platform!
            </p>

            <div className="flex flex-col sm:flex-row gap-4 sm:gap-5 items-center justify-center w-full sm:w-auto">
              <Button
                asChild
                className="w-full sm:w-auto bg-gradient-to-r from-blue-600 to-cyan-500 hover:from-blue-700 hover:to-cyan-600 text-white font-medium py-6 px-6 sm:px-8 lg:px-12 rounded-lg border-0 shadow-xl hover:shadow-2xl transition-all duration-300 transform hover:scale-105 text-base sm:text-lg cursor-pointer"
              >
                <Link href="/signup">Create Your First Invoice</Link>
              </Button>

              <Button
                asChild
                className="w-full sm:w-auto bg-white/10 backdrop-blur-sm border-2 border-white/30 text-white hover:bg-white/20 hover:border-white/50 font-medium py-6 px-6 sm:px-8 lg:px-12 rounded-lg shadow-xl hover:shadow-2xl transition-all duration-300 transform hover:scale-105 text-base sm:text-lg cursor-pointer"
              >
                <Link href="/about">Learn More</Link>
              </Button>
            </div>

            {/* Trust indicators */}
            <div className="flex flex-col sm:flex-row items-center gap-3 sm:gap-6 text-white/80 text-xs sm:text-sm">
              <div className="flex items-center gap-2">
                <div className="w-2 h-2 bg-cyan-400 rounded-full animate-pulse"></div>
                <span>Free to start</span>
              </div>
              <div className="flex items-center gap-2">
                <div className="w-2 h-2 bg-cyan-400 rounded-full animate-pulse"></div>
                <span>No credit card required</span>
              </div>
              <div className="flex items-center gap-2">
                <div className="w-2 h-2 bg-cyan-400 rounded-full animate-pulse"></div>
                <span>30-day money back guarantee</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

export default CTASection;
