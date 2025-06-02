import React from "react";
import { Button } from "@/components/ui/button";
import Link from "next/link";

function Home() {
  return (
    <div className="min-h-screen bg-white  flex items-center justify-center px-4">
      <div className="max-w-4xl mx-auto text-center">
        {/* Hero Section */}
        <div className="space-y-8">
          {/* Main Heading */}
          <h1 className="text-6xl md:text-8xl font-bold text-black tracking-tight">
            Invox
          </h1>

          {/* Description */}
          <p className="text-xl md:text-2xl text-gray-600 max-w-2xl mx-auto leading-relaxed">
            Streamline your invoicing process with our simple, powerful
            platform. Create, send, and track invoices effortlessly.
          </p>

          {/* Action Buttons */}
          <div className="flex flex-col sm:flex-row gap-4 justify-center items-center pt-8">
            <Button
              asChild
              size="lg"
              className="bg-black text-white hover:bg-gray-800 px-8 py-6 text-lg font-medium"
            >
              <Link href="/sign-up">Get Started</Link>
            </Button>

            <Button
              asChild
              variant="outline"
              size="lg"
              className="border-black text-black hover:bg-gray-100 px-8 py-6 text-lg font-medium"
            >
              <Link href="/login">Login</Link>
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Home;
