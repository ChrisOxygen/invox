import Image from 'next/image'

export default function SeenOnSection() {
  return (
    <section className="bg-(--surface-page) pt-5 sm:pt-52 lg:pt-96">
      <div className="max-w-312.5 mx-auto px-5 lg:px-0 py-16 flex flex-col items-center gap-5">
        <span className="text-xs font-semibold text-(--ink-300) uppercase tracking-widest font-display">
          As seen on
        </span>
        <div className="relative flex items-center gap-10 overflow-x-clip w-full justify-center">
          <span className="absolute top-1/2 -translate-y-1/2 h-full w-20 bg-linear-to-r from-(--surface-page) to-transparent left-0 z-10 pointer-events-none" />
          <span className="absolute top-1/2 -translate-y-1/2 h-full w-20 bg-linear-to-l from-(--surface-page) to-transparent right-0 z-10 pointer-events-none" />
          {Array.from({ length: 5 }).map((_, i) => (
            <Image
              key={i}
              src="/assets/invox-main-logo.webp"
              alt="Invox"
              width={100}
              height={40}
              className="object-contain opacity-35 grayscale"
            />
          ))}
        </div>
      </div>
    </section>
  )
}
