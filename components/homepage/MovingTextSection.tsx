"use client";

function MovingTextSection() {
  return (
    <section className="py-10 overflow-hidden">
      <div className="relative">
        <div
          className="flex items-center whitespace-nowrap text-5xl sm:text-6xl md:text-8xl lg:text-9xl xl:text-[12rem] font-semibold text-gray-100 uppercase tracking-wider"
          style={{
            animation: "scroll-text 30s linear infinite",
            minWidth: "300%",
          }}
        >
          <span className="mr-20">CASH FLOW.</span>
          <span className="mr-20">ANALYTICS.</span>
          <span className="mr-20">REMINDERS.</span>
          <span className="mr-20">SPEED.</span>
          <span className="mr-20">CASH FLOW.</span>
          <span className="mr-20">ANALYTICS.</span>
          <span className="mr-20">REMINDERS.</span>
          <span className="mr-20">SPEED.</span>
          <span className="mr-20">CASH FLOW.</span>
          <span className="mr-20">ANALYTICS.</span>
          <span className="mr-20">REMINDERS.</span>
          <span className="mr-20">SPEED.</span>
        </div>
      </div>
      <style jsx>{`
        @keyframes scroll-text {
          0% {
            transform: translateX(0);
          }
          100% {
            transform: translateX(-33.33%);
          }
        }
      `}</style>
    </section>
  );
}

export default MovingTextSection;
