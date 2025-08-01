import Image from "next/image";

export default function SeenOnSection() {
  return (
    <section className=" lg:pt-[300px] pt-5 sm:pt-[200px]">
      <div className="max-w-[1250px] mx-auto flex flex-col items-center py-20 gap-5">
        <span className=" uppercase text-gray-500 text-sm font-semibold">
          as seen on
        </span>
        <div className=" flex items-center gap-7 relative overflow-x-clip">
          <span className="absolute top-1/2 -translate-y-1/2 h-[80px] w-[110px] bg-gradient-to-r from-white to-transparent left-0"></span>
          <span className="absolute top-1/2 -translate-y-1/2 h-[80px] w-[110px] bg-gradient-to-l from-white to-transparent right-0"></span>
          <Image
            src="/assets/invox-main-logo.webp"
            alt="Logo"
            width={120}
            height={50}
            className="object-contain"
          />
          <Image
            src="/assets/invox-main-logo.webp"
            alt="Logo"
            width={120}
            height={50}
            className="object-contain"
          />
          <Image
            src="/assets/invox-main-logo.webp"
            alt="Logo"
            width={120}
            height={50}
            className="object-contain"
          />
          <Image
            src="/assets/invox-main-logo.webp"
            alt="Logo"
            width={120}
            height={50}
            className="object-contain"
          />
          <Image
            src="/assets/invox-main-logo.webp"
            alt="Logo"
            width={120}
            height={50}
            className="object-contain"
          />
        </div>
      </div>
    </section>
  );
}
