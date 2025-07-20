import { Button } from "@/components/ui/button";
import Link from "next/link";
import React, { useEffect } from "react";
import { useRouter } from "next/navigation";
import { useQueryClient } from "@tanstack/react-query";
import { IoCheckmarkCircle } from "react-icons/io5";
import { FaFileInvoice, FaUsers, FaTachometerAlt } from "react-icons/fa";

function FinalStep() {
  const router = useRouter();
  const queryClient = useQueryClient();

  // Auto-navigation functionality: invalidate user query and navigate to /app after 1 minute
  useEffect(() => {
    const timeoutId = setTimeout(async () => {
      // Invalidate user queries to ensure fresh data is fetched
      await queryClient.invalidateQueries({ queryKey: ["user"] });
      await queryClient.invalidateQueries({ queryKey: ["currentUser"] });

      // Navigate to /app with fresh user data
      router.push("/app");

      console.log(
        "User queries invalidated and navigated to /app after 1 minute"
      );
    }, 60 * 1000); // 1 minute in milliseconds

    // Cleanup function to clear timeout if component unmounts before 1 minute
    return () => {
      clearTimeout(timeoutId);
      console.log("Auto-navigation timeout cleared");
    };
  }, [router, queryClient]);

  return (
    <div className="flex w-full max-w-4xl flex-col items-center justify-center px-4 py-4 sm:px-6 sm:py-6 md:px-8 md:py-8">
      <div className="w-full text-center space-y-4 sm:space-y-5">
        {/* Success Icon with enhanced styling */}
        <div className="space-y-3 sm:space-y-4">
          <div className="inline-flex items-center justify-center w-16 h-16 sm:w-20 sm:h-20 md:w-24 md:h-24 bg-gradient-to-br from-blue-50 to-cyan-50 border-2 border-blue-100 rounded-full mb-3 sm:mb-4 shadow-lg shadow-blue-100/50">
            <IoCheckmarkCircle className="w-8 h-8 sm:w-10 sm:h-10 md:w-12 md:h-12 text-blue-600" />
          </div>

          {/* Main Content with enhanced styling */}
          <div className="space-y-2 sm:space-y-3">
            <h1 className="text-2xl sm:text-3xl md:text-4xl lg:text-5xl font-bold bg-gradient-to-r from-blue-600 to-cyan-400 bg-clip-text text-transparent leading-tight">
              🎉 Welcome to Invox!
            </h1>
            <h2 className="text-base sm:text-lg md:text-xl font-semibold text-gray-800 max-w-3xl mx-auto">
              Your account is ready to go
            </h2>
            <p className="text-sm sm:text-base text-gray-600 leading-relaxed max-w-2xl mx-auto">
              Congratulations! You&apos;ve successfully completed the onboarding
              process. Your invoicing workspace is now set up and ready to help
              you manage your business with ease.
            </p>
          </div>
        </div>

        {/* Achievement Summary with enhanced styling */}
        <div className="bg-gradient-to-r from-blue-50/30 to-cyan-50/30 border border-blue-100 rounded-xl p-4 sm:p-5 max-w-2xl mx-auto">
          <h3 className="text-sm sm:text-base font-semibold text-gray-800 mb-3 sm:mb-4">
            What you&apos;ve accomplished:
          </h3>
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 sm:gap-4">
            <div className="text-center">
              <div className="w-6 h-6 sm:w-8 sm:h-8 bg-gradient-to-r from-blue-600 to-cyan-400 rounded-full flex items-center justify-center mx-auto mb-2 shadow-lg shadow-blue-200/50">
                <IoCheckmarkCircle className="w-3 h-3 sm:w-5 sm:h-5 text-white" />
              </div>
              <p className="text-xs sm:text-sm text-gray-600">
                Account Created
              </p>
            </div>
            <div className="text-center">
              <div className="w-6 h-6 sm:w-8 sm:h-8 bg-gradient-to-r from-blue-600 to-cyan-400 rounded-full flex items-center justify-center mx-auto mb-2 shadow-lg shadow-blue-200/50">
                <IoCheckmarkCircle className="w-3 h-3 sm:w-5 sm:h-5 text-white" />
              </div>
              <p className="text-xs sm:text-sm text-gray-600">Profile Setup</p>
            </div>
            <div className="text-center">
              <div className="w-6 h-6 sm:w-8 sm:h-8 bg-gradient-to-r from-blue-600 to-cyan-400 rounded-full flex items-center justify-center mx-auto mb-2 shadow-lg shadow-blue-200/50">
                <IoCheckmarkCircle className="w-3 h-3 sm:w-5 sm:h-5 text-white" />
              </div>
              <p className="text-xs sm:text-sm text-gray-600">
                Business Configured
              </p>
            </div>
          </div>
        </div>

        {/* Action Buttons with enhanced styling */}
        <div className="space-y-3 sm:space-y-4 max-w-2xl mx-auto">
          {/* Primary Action */}
          <Button
            asChild
            className="w-full h-12 sm:h-14 text-sm sm:text-base font-semibold bg-gradient-to-r from-blue-600 to-cyan-400 hover:from-blue-700 hover:to-cyan-500 text-white transition-all duration-300 hover:scale-105 active:scale-95 shadow-lg shadow-blue-200/50 hover:shadow-xl hover:shadow-blue-300/50 rounded-xl"
          >
            <Link
              href="/app/dashboard/invoice/create"
              className="flex items-center justify-center gap-2 sm:gap-3"
            >
              <FaFileInvoice className="w-4 h-4 sm:w-5 sm:h-5" />
              Create Your First Invoice
            </Link>
          </Button>

          {/* Secondary Actions */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <Button
              asChild
              variant="outline"
              className="h-10 sm:h-12 text-xs sm:text-sm font-medium border-2 border-gray-300 hover:border-blue-400 hover:bg-gradient-to-r hover:from-blue-50 hover:to-cyan-50 hover:text-blue-700 transition-all duration-300 hover:scale-105 active:scale-95 rounded-xl"
            >
              <Link
                href="/app/dashboard/clients"
                className="flex items-center justify-center gap-2"
              >
                <FaUsers className="w-3 h-3 sm:w-4 sm:h-4" />
                Add a Client
              </Link>
            </Button>

            <Button
              asChild
              variant="outline"
              className="h-10 sm:h-12 text-xs sm:text-sm font-medium border-2 border-gray-300 hover:border-blue-400 hover:bg-gradient-to-r hover:from-blue-50 hover:to-cyan-50 hover:text-blue-700 transition-all duration-300 hover:scale-105 active:scale-95 rounded-xl"
            >
              <Link
                href="/app/dashboard"
                className="flex items-center justify-center gap-2"
              >
                <FaTachometerAlt className="w-3 h-3 sm:w-4 sm:h-4" />
                Go to Dashboard
              </Link>
            </Button>
          </div>
        </div>

        {/* Footer Message with enhanced styling */}
        <div className="pt-4 sm:pt-6 border-t border-gray-200 mt-4 sm:mt-6">
          <div className="bg-gradient-to-r from-blue-50 to-cyan-50 border border-blue-100 rounded-lg p-3 sm:p-4">
            <p className="text-xs sm:text-sm text-gray-600">
              Need help getting started? Check out our{" "}
              <a
                href="#"
                className="text-blue-600 hover:text-blue-700 hover:underline font-medium transition-colors duration-200"
              >
                quick start guide
              </a>{" "}
              or{" "}
              <a
                href="#"
                className="text-blue-600 hover:text-blue-700 hover:underline font-medium transition-colors duration-200"
              >
                contact support
              </a>
              .
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}

export default FinalStep;
