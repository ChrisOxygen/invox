"use client";

import Image from "next/image";

function AuthLayout({ children }: { children: React.ReactNode }) {
  return (
    <main className="bg-gradient-to-br from-blue-600 via-cyan-500 to-blue-700 bg-cover bg-center relative p-2 min-h-screen w-full grid grid-cols-1 lg:grid-cols-2">
      {/* Enhanced gradient overlay */}
      <span className="absolute inset-0 bg-gradient-to-br from-blue-800/30 via-cyan-600/20 to-blue-900/40"></span>

      {/* Subtle animated background elements */}
      <div className="absolute inset-0 overflow-hidden">
        <div className="absolute top-1/4 left-1/4 w-32 h-32 bg-white/5 rounded-full blur-xl animate-pulse"></div>
        <div className="absolute bottom-1/3 right-1/4 w-48 h-48 bg-cyan-400/10 rounded-full blur-2xl animate-pulse delay-1000"></div>
        <div className="absolute top-2/3 left-1/3 w-24 h-24 bg-blue-300/8 rounded-full blur-lg animate-pulse delay-500"></div>
      </div>

      {/* Left side - Hidden on mobile, visible on large screens */}
      <div className="hidden lg:flex lg:flex-col lg:justify-center lg:items-center lg:px-8 relative z-10">
        <div className="max-w-sm text-center text-white">
          {/* Brand Logo */}
          <div className="mb-8">
            <div className="w-20 h-20 mx-auto bg-white/20 backdrop-blur-sm rounded-2xl flex items-center justify-center shadow-2xl border border-white/30">
              <Image
                src="/assets/logo-white-icon.webp"
                alt="Invox Logo"
                width={40}
                height={40}
                className="w-10 h-10"
              />
            </div>
          </div>

          {/* Brand Text */}
          <h1 className="text-4xl font-bold mb-6 leading-tight">
            Welcome to{" "}
            <span className="bg-gradient-to-r from-white to-cyan-200 bg-clip-text text-transparent">
              Invox
            </span>
          </h1>

          <p className="text-xl text-blue-100 mb-8 leading-relaxed">
            Create professional invoices with ease and get paid faster.
          </p>
        </div>
      </div>

      {/* Right side - Full width on mobile, half width on large screens */}
      <div className="relative col-span-1 lg:col-start-2 flex items-center justify-center p-2 z-10">
        {/* Mobile brand header */}
        <div className="lg:hidden absolute top-4 left-1/2 transform -translate-x-1/2">
          <div className="flex items-center space-x-2 text-white">
            <div className="w-8 h-8 bg-white/20 backdrop-blur-sm rounded-lg flex items-center justify-center border border-white/30">
              <Image
                src="/assets/logo-white-icon.webp"
                alt="Invox Logo"
                width={20}
                height={20}
                className="w-5 h-5"
              />
            </div>
            <span className="text-xl font-bold">Invox</span>
          </div>
        </div>

        <div className="w-full h-full pt-16 lg:pt-0">{children}</div>
      </div>
    </main>
  );
}

export default AuthLayout;
