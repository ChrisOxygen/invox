"use client";

import { Button } from "@/components/ui/button";
import { ArrowRight, Sparkles } from "lucide-react";
import { useOnboardingActions as useOnboardingActionsContext } from "../../context/OnboardingActionsContext";

function Step1() {
  const { nextStep } = useOnboardingActionsContext();

  const handleGetStarted = () => {
    nextStep();
  };

  return (
    <div className="flex w-full max-w-4xl flex-col items-center justify-center px-4 py-4 sm:px-6 sm:py-6 md:px-8 md:py-8">
      <div className="w-full text-center space-y-6 sm:space-y-8">
        {/* Header with enhanced icon */}
        <div className="space-y-4 sm:space-y-6">
          <div className="inline-flex items-center justify-center w-16 h-16 sm:w-20 sm:h-20 md:w-24 md:h-24 bg-gradient-to-br from-blue-50 to-cyan-50 border-2 border-blue-100 rounded-full mb-4 sm:mb-6 shadow-lg shadow-blue-100/50">
            <Sparkles className="w-8 h-8 sm:w-10 sm:h-10 md:w-12 md:h-12 text-blue-600" />
          </div>

          <div className="space-y-3 sm:space-y-4">
            <h1 className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-bold bg-gradient-to-r from-blue-600 to-cyan-400 bg-clip-text text-transparent leading-tight">
              Welcome to Invox!
            </h1>

            <h2 className="text-base sm:text-lg md:text-xl lg:text-2xl font-semibold text-gray-800 max-w-3xl mx-auto">
              Get started with professional invoicing that grows your business
            </h2>
          </div>
        </div>

        {/* Enhanced main content */}
        <div className="space-y-4 sm:space-y-6">
          <p className="text-sm sm:text-base md:text-lg text-gray-600 leading-relaxed max-w-2xl mx-auto">
            Transform your invoicing experience in just a few minutes. Our
            streamlined setup process will help you create beautiful,
            professional invoices and get paid faster than ever before.
          </p>

          {/* Feature highlights */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 sm:gap-4 max-w-3xl mx-auto mt-4 sm:mt-6">
            <div className="bg-gradient-to-b from-blue-50 to-white border border-blue-100 rounded-xl p-3 sm:p-4">
              <div className="text-blue-600 font-semibold text-xs sm:text-sm mb-1">
                Professional Design
              </div>
              <div className="text-gray-600 text-xs">
                Beautiful templates that impress clients
              </div>
            </div>
            <div className="bg-gradient-to-b from-cyan-50 to-white border border-cyan-100 rounded-xl p-3 sm:p-4">
              <div className="text-cyan-600 font-semibold text-xs sm:text-sm mb-1">
                Fast Setup
              </div>
              <div className="text-gray-600 text-xs">
                Get up and running in under 5 minutes
              </div>
            </div>
            <div className="bg-gradient-to-b from-gray-50 to-white border border-gray-200 rounded-xl p-3 sm:p-4">
              <div className="text-gray-800 font-semibold text-xs sm:text-sm mb-1">
                Easy Customization
              </div>
              <div className="text-gray-600 text-xs">
                Change any setting anytime you need
              </div>
            </div>
          </div>
        </div>

        {/* Enhanced CTA Button */}
        <div className="pt-3 sm:pt-4">
          <Button
            onClick={handleGetStarted}
            size="lg"
            className="bg-gradient-to-r from-blue-600 to-cyan-400 hover:from-blue-700 hover:to-cyan-500 text-white font-semibold px-6 py-3 sm:px-8 sm:py-4 md:px-10 md:py-5 h-auto text-base sm:text-lg transition-all duration-300 group w-full sm:w-auto min-h-[48px] sm:min-h-[56px] rounded-xl shadow-lg shadow-blue-200/50 hover:shadow-xl hover:shadow-blue-300/50 hover:scale-105"
          >
            Let&apos;s Get Started!
            <ArrowRight className="ml-2 w-4 h-4 sm:w-5 sm:h-5 group-hover:translate-x-1 transition-transform duration-300" />
          </Button>
        </div>

        {/* Enhanced footer */}
        <div className="pt-4 sm:pt-6 border-t border-gray-200 mt-4 sm:mt-6">
          <div className="bg-gradient-to-r from-blue-50 to-cyan-50 border border-blue-100 rounded-lg p-3 sm:p-4">
            <p className="text-xs sm:text-sm font-medium text-gray-700 mb-1">
              🚀 Setting up your professional invoicing experience
            </p>
            <p className="text-xs text-gray-600">
              Join thousands of professionals who trust Invox for their business
              invoicing
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Step1;
