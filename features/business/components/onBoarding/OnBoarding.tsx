import { useState } from "react";
import Step1 from "./Step1";

function OnBoarding() {
  const [step, setStep] = useState(1);
  return (
    <main className=" w-firstmin-h-screen grid place-items-center">
      <div className="flex flex-col items-center justify-center gap-4">
        <h1 className="text-2xl font-bold">Welcome to Invox</h1>
        <p className="text-gray-600">Let's get you started!</p>
        <button
          onClick={() => setStep(1)}
          className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600"
        >
          Start Onboarding
        </button>
        {step === 1 && <Step1 />}
      </div>
    </main>
  );
}

export default OnBoarding;
