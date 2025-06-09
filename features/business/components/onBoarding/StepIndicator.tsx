import clsx from "clsx";
import React from "react";

function StepIndicator({ currentStep }: { currentStep: number }) {
  return (
    <div className=" flex gap-3 items-center w-full ">
      {Array.from({ length: 3 }, (_, index) => (
        <span
          key={index}
          className={clsx(
            "h-[4px]  flex-1 rounded-full",
            currentStep === index + 1 ? "bg-black" : "bg-black/30"
          )}
          style={{ transition: "background-color 0.3s ease" }}
        ></span>
      ))}
    </div>
  );
}

export default StepIndicator;
