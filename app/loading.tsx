import InBoxLoader from "@/components/InBoxLoader";

function loading() {
  return (
    <div className="w-full h-screen grid place-items-center">
      <InBoxLoader />
    </div>
  );
}

export default loading;
