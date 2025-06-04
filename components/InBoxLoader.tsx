import React from "react";

function InBoxLoader() {
  return (
    <div className="z-50 grid h-full w-full place-items-center bg-white/85">
      <div className="flex flex-col items-center">
        <div className="h-[80px] w-[80px] animate-spin rounded-full border-8 border-[#F8E5DB] border-t-[#BF4008]" />
        <p className="mt-4 font-[Lato] tracking-[0.08px] text-[#404040]">
          Loading...
        </p>
      </div>
    </div>
  );
}

export default InBoxLoader;
