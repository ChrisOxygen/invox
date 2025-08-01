import { FaStar } from "react-icons/fa";

export default function TestimonialsSection() {
  return (
    <section className=" bg-white">
      <div className="content-wrapper flex flex-col items-center gap-16">
        <div className="flex flex-col items-center gap-6 text-center">
          <span className="uppercase font-semibold text-blue-600 text-sm tracking-wider">
            Hear from our customers
          </span>
          <h2 className="font-bold text-4xl text-center max-w-[500px] text-gray-900 leading-tight">
            What our users are saying about
            <span className="bg-gradient-to-r from-blue-600 to-cyan-500 bg-clip-text text-transparent">
              {" "}
              Invox
            </span>
          </h2>
          <p className="text-xl text-gray-600 max-w-[600px] leading-relaxed">
            Don&apos;t just take our word for it - see what our customers have
            to say about their experience
          </p>
        </div>
        <div className="flex flex-col items-center gap-10 w-full">
          <div className="flex flex-col gap-8 items-center text-center max-w-[900px] p-10 rounded-2xl relative overflow-hidden">
            {/* Background decoration */}
            <div className="absolute top-0 right-0 w-32 h-32 bg-gradient-to-br from-blue-200/20 to-cyan-200/20 rounded-full blur-3xl"></div>
            <div className="absolute bottom-0 left-0 w-24 h-24 bg-gradient-to-br from-cyan-200/20 to-blue-200/20 rounded-full blur-3xl"></div>

            <div className="flex gap-1 items-center text-3xl text-yellow-400 relative z-10">
              <FaStar />
              <FaStar />
              <FaStar />
              <FaStar />
              <FaStar />
            </div>
            <blockquote className="font-medium text-2xl text-gray-800 leading-relaxed italic relative z-10">
              &ldquo;Invox has completely streamlined my invoicing process. The
              interface is clean and intuitive - I can create professional
              invoices in minutes instead of hours. The automated payment
              reminders have improved my cash flow significantly, and clients
              love how easy it is to pay online. Customer support is responsive
              and helpful too. Highly recommend Invox to any business owner
              looking to simplify their billing!&rdquo;
            </blockquote>
            <div className="flex flex-col items-center gap-2 relative z-10">
              <span className="font-bold text-gray-900 text-xl">Sarah M.</span>
              <span className="text-blue-600 font-medium text-base">
                Freelance Designer
              </span>
            </div>
          </div>
          <div className="flex items-center gap-4">
            <button className="w-4 h-4 rounded-full bg-gray-300 hover:bg-blue-500 transition-all duration-300 transform hover:scale-110 shadow-sm"></button>
            <button className="w-4 h-4 rounded-full bg-gray-300 hover:bg-blue-500 transition-all duration-300 transform hover:scale-110 shadow-sm"></button>
            <button className="w-6 h-6 rounded-full bg-gradient-to-r from-blue-600 to-cyan-500 shadow-lg transform scale-110"></button>
            <button className="w-4 h-4 rounded-full bg-gray-300 hover:bg-blue-500 transition-all duration-300 transform hover:scale-110 shadow-sm"></button>
            <button className="w-4 h-4 rounded-full bg-gray-300 hover:bg-blue-500 transition-all duration-300 transform hover:scale-110 shadow-sm"></button>
          </div>
        </div>
      </div>
    </section>
  );
}
