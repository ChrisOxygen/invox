import { useState } from "react";
import Step1 from "./Step1";
import Logo from "@/components/Logo";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import StepIndicator from "./StepIndicator";

function OnBoarding() {
  const [step, setStep] = useState(1);
  const [hasCreatedBusiness, setHasCreatedBusiness] = useState(false);
  return (
    <main className="bg-[url('/assets/freelancer-bg-3.png')] bg-cover bg-center relative  w-full min-h-screen grid p-4 ">
      <div className=" rounded-lg border-white/20 w-full h-full grid grid-cols-2 overflow-clip">
        <div className=" flex bg-white/80 h-full flex-col p-4">
          <div className=" flex  items-center gap-5 ">
            <Logo color="black" rootLink="/dashboard" />
            <Link href="/help" className="text-white ml-auto">
              need help?
            </Link>
            <Button className="text-white">sign out</Button>
          </div>
          <StepIndicator currentStep={step} />
          <div className=" flex flex-col gap-5">
            <h2 className="">
              Welcome to Invox!
              <br /> Let&apos;s get you started
            </h2>
            <p className="text-gray-600 text-sm leading-relaxed">
              Please follow the steps below to create your business profile.
              This will help us personalize your experience and ensure you have
              access to all the features you need to manage your invoicing and
              business operations effectively.
            </p>
          </div>
        </div>
        <div className=" border-l bg-white"></div>
      </div>
    </main>
  );
}

export default OnBoarding;
