import React from "react";

function InBoxLoader() {
  return (
    <div className="z-50 grid h-full w-full place-items-center bg-white/90">
      <div className="flex flex-col items-center">
        <div className="h-[80px] w-[80px] animate-spin rounded-full border-8 border-gray-200 border-t-primary" />
        <p className="mt-4 text-sm font-medium text-muted-foreground">
          Loading...
        </p>
      </div>
    </div>
  );
}

export default InBoxLoader;
