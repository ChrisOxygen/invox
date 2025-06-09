import React from "react";
import { Button } from "@/components/ui/button";
import { ArrowRight, Sparkles } from "lucide-react";
import { useOnboarding } from "../../context/OnboardingProvider";

function Step1() {
  const { nextStep } = useOnboarding();

  const handleGetStarted = () => {
    nextStep();
  };

  return (
    <div className="flex w-full max-w-[90vw] sm:max-w-[600px] flex-col items-center justify-center px-4 py-6 sm:px-6 md:px-8">
      <div className="max-w-2xl w-full text-center space-y-6 sm:space-y-8">
        {/* Header with sparkles icon */}
        <div className="space-y-3 sm:space-y-4">
          <div className="inline-flex items-center justify-center w-16 h-16 sm:w-20 sm:h-20 bg-gray-100 rounded-full mb-4 sm:mb-6">
            <Sparkles className="w-8 h-8 sm:w-10 sm:h-10 text-gray-900" />
          </div>

          <h1 className="font-space-grotesk text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-bold text-gray-900 leading-tight px-2">
            Welcome to Invox!
          </h1>

          <h2 className="font-space-grotesk text-xl sm:text-2xl md:text-3xl font-medium text-gray-700 px-2">
            Get started with professional invoicing
          </h2>
        </div>

        {/* Main content */}
        <div className="space-y-4 sm:space-y-6">
          <p className="font-inter text-base sm:text-lg text-gray-600 leading-relaxed max-w-xl mx-auto px-4 sm:px-2">
            Welcome! Get your professional invoicing set up in just a few
            minutes. This quick setup will help you create stunning invoices and
            get paid faster. Don&apos;t worry - you can always change these
            settings later.
          </p>
        </div>

        {/* CTA Button */}
        <div className="pt-2 sm:pt-4">
          <Button
            onClick={handleGetStarted}
            size="lg"
            className="bg-gray-900 hover:bg-gray-800 text-white font-inter font-medium px-6 py-3 sm:px-8 sm:py-4 h-auto text-base sm:text-lg transition-all duration-200 group w-full sm:w-auto min-h-[48px] cursor-pointer"
          >
            Let&apos;s Get Started!
            <ArrowRight className="ml-2 w-4 h-4 sm:w-5 sm:h-5 group-hover:translate-x-1 transition-transform duration-200" />
          </Button>
        </div>

        {/* Subtle footer */}
        <div className="pt-6 sm:pt-8 border-t border-gray-100 mt-6 sm:mt-8">
          <p className="font-inter text-xs sm:text-sm text-gray-400 px-4 sm:px-2">
            Setting up your professional invoicing experience
          </p>
        </div>
      </div>
    </div>
  );
}

export default Step1;
