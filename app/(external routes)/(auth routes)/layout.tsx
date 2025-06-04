"use client";

import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";
import { useEffect } from "react";

function AuthLayout({ children }: { children: React.ReactNode }) {
  const { data: session, status } = useSession();
  const router = useRouter();

  useEffect(() => {
    if (status === "authenticated" && session) {
      router.push("/dashboard");
    }
  }, [session, status, router]);

  // Show loading state while checking session
  if (status === "loading") {
    return (
      <main className="bg-[url('/assets/freelancer-bg-3.png')] bg-cover bg-center relative p-2 min-h-screen w-full grid grid-cols-1 lg:grid-cols-2">
        <span className="absolute inset-0 bg-black opacity-70"></span>
        <div className="hidden lg:block"></div>
        <div className="relative col-span-1 lg:col-start-2 flex items-center justify-center p-2">
          <div className="text-white">Loading...</div>
        </div>
      </main>
    );
  }

  // Only render auth pages if user is not authenticated
  if (status === "unauthenticated") {
    return (
      <main className="bg-[url('/assets/freelancer-bg-3.png')] bg-cover bg-center relative p-2 min-h-screen w-full grid grid-cols-1 lg:grid-cols-2">
        <span className="absolute inset-0 bg-black opacity-70"></span>

        {/* Left side - Hidden on mobile, visible on large screens */}
        <div className="hidden lg:block"></div>

        {/* Right side - Full width on mobile, half width on large screens */}
        <div className="relative col-span-1 lg:col-start-2 flex items-center justify-center p-2">
          <div className="w-full h-full">{children}</div>
        </div>
      </main>
    );
  }

  // Return null while redirecting
  return null;
}

export default AuthLayout;
