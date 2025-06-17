import { Button } from "@/components/ui/button";
import Link from "next/link";
import React from "react";
import { IoCheckmarkCircle } from "react-icons/io5";
import { FaFileInvoice, FaUsers, FaTachometerAlt } from "react-icons/fa";

function FinalStep() {
  return (
    <div className="w-full flex items-center justify-center p-4">
      <div className="w-full max-w-2xl mx-auto">
        {/* Success Icon */}
        <div className="text-center mb-4">
          <div className="inline-flex items-center justify-center w-20 h-20 bg-black rounded-full mb-6 shadow-lg transform transition-all duration-300 hover:scale-105">
            <IoCheckmarkCircle className="w-12 h-12 text-white" />
          </div>
        </div>

        {/* Main Content */}
        <div className="text-center mb-12">
          <h1 className="text-4xl md:text-5xl font-bold text-black mb-4 leading-tight">
            🎉 Welcome to Invox!
          </h1>
          <h2 className="text-xl md:text-2xl font-semibold text-gray-700 mb-6">
            Your account is ready to go
          </h2>{" "}
          <p className="text-gray-600 text-lg leading-relaxed max-w-xl mx-auto">
            Congratulations! You&apos;ve successfully completed the onboarding
            process. Your invoicing workspace is now set up and ready to help
            you manage your business with ease.
          </p>
        </div>

        {/* Achievement Summary */}
        <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6 mb-10">
          {" "}
          <h3 className="text-lg font-semibold text-black mb-4 text-center">
            What you&apos;ve accomplished:
          </h3>
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            <div className="text-center">
              <div className="w-8 h-8 bg-black rounded-full flex items-center justify-center mx-auto mb-2">
                <IoCheckmarkCircle className="w-5 h-5 text-white" />
              </div>
              <p className="text-sm text-gray-600">Account Created</p>
            </div>
            <div className="text-center">
              <div className="w-8 h-8 bg-black rounded-full flex items-center justify-center mx-auto mb-2">
                <IoCheckmarkCircle className="w-5 h-5 text-white" />
              </div>
              <p className="text-sm text-gray-600">Profile Setup</p>
            </div>
            <div className="text-center">
              <div className="w-8 h-8 bg-black rounded-full flex items-center justify-center mx-auto mb-2">
                <IoCheckmarkCircle className="w-5 h-5 text-white" />
              </div>
              <p className="text-sm text-gray-600">Business Configured</p>
            </div>
          </div>
        </div>

        {/* Action Buttons */}
        <div className="space-y-4">
          {/* Primary Action */}
          <Button
            asChild
            className="w-full h-14 text-lg font-semibold bg-black hover:bg-gray-800 text-white transition-all duration-200 transform hover:scale-[1.02] active:scale-[0.98] shadow-lg hover:shadow-xl"
          >
            <Link
              href="/app/dashboard/invoice/create"
              className="flex items-center justify-center gap-3"
            >
              <FaFileInvoice className="w-5 h-5" />
              Create Your First Invoice
            </Link>
          </Button>

          {/* Secondary Actions */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <Button
              asChild
              variant="outline"
              className="h-12 font-medium border-2 border-gray-300 hover:border-black hover:bg-black hover:text-white transition-all duration-200 transform hover:scale-[1.02] active:scale-[0.98]"
            >
              <Link
                href="/app/dashboard/clients"
                className="flex items-center justify-center gap-2"
              >
                <FaUsers className="w-4 h-4" />
                Add a Client
              </Link>
            </Button>

            <Button
              asChild
              variant="outline"
              className="h-12 font-medium border-2 border-gray-300 hover:border-black hover:bg-black hover:text-white transition-all duration-200 transform hover:scale-[1.02] active:scale-[0.98]"
            >
              <Link
                href="/app/dashboard"
                className="flex items-center justify-center gap-2"
              >
                <FaTachometerAlt className="w-4 h-4" />
                Go to Dashboard
              </Link>
            </Button>
          </div>
        </div>

        {/* Footer Message */}
        <div className="text-center mt-10 pt-8 border-t border-gray-100">
          <p className="text-sm text-gray-500">
            Need help getting started? Check out our{" "}
            <a
              href="#"
              className="text-black hover:underline font-medium transition-colors duration-200"
            >
              quick start guide
            </a>{" "}
            or{" "}
            <a
              href="#"
              className="text-black hover:underline font-medium transition-colors duration-200"
            >
              contact support
            </a>
            .
          </p>
        </div>
      </div>
    </div>
  );
}

export default FinalStep;
