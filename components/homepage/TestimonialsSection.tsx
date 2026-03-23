import { Star } from 'lucide-react'
import { RevealOnScroll } from '../RevealOnScroll'

export default function TestimonialsSection() {
  return (
    <section id="testimonials" className="bg-(--ink-950)">
      <div className="content-wrapper flex flex-col items-center gap-14">
        <RevealOnScroll className="flex flex-col items-center gap-4 text-center">
          <span className="text-xs font-semibold text-(--blue-400) uppercase tracking-widest font-display">
            Hear from our customers
          </span>
          <h2 className="font-display font-bold text-3xl lg:text-4xl text-white leading-tight tracking-[-0.025em] max-w-120">
            What our users are saying about{' '}
            <span className="text-(--blue-400)">Invox</span>
          </h2>
          <p className="text-base text-(--ink-300) max-w-125 leading-relaxed font-body">
            Don&apos;t just take our word for it — see what our customers have to say
          </p>
        </RevealOnScroll>

        <RevealOnScroll delay={150} className="w-full max-w-3xl">
          <figure className="flex flex-col gap-7 p-8 sm:p-10 rounded-(--r-2xl) bg-(--ink-900) border border-(--ink-700)">
            <div className="flex gap-1 text-(--warning)">
              {Array.from({ length: 5 }).map((_, i) => (
                <Star key={i} className="w-5 h-5 fill-current" />
              ))}
            </div>
            <blockquote className="text-lg sm:text-xl text-white leading-relaxed font-body">
              &ldquo;Invox has completely streamlined my invoicing process. The
              interface is clean and intuitive — I can create professional invoices
              in minutes instead of hours. The automated payment reminders have
              improved my cash flow significantly, and clients love how easy it is
              to pay online. Highly recommend Invox to any business owner looking
              to simplify their billing!&rdquo;
            </blockquote>
            <figcaption className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-full bg-(--blue-600) flex items-center justify-center text-white font-display font-bold text-sm shrink-0">
                SM
              </div>
              <div>
                <p className="text-sm font-semibold text-white font-display">Sarah M.</p>
                <p className="text-xs text-(--ink-400) font-body mt-0.5">
                  Freelance Designer
                </p>
              </div>
            </figcaption>
          </figure>
        </RevealOnScroll>

        <div className="flex items-center gap-2">
          {Array.from({ length: 5 }).map((_, i) => (
            <button
              key={i}
              aria-label={`Testimonial ${i + 1}`}
              className={`rounded-full transition-all duration-200 ${
                i === 2
                  ? 'w-6 h-2 bg-(--blue-600)'
                  : 'w-2 h-2 bg-(--ink-700) hover:bg-(--ink-500)'
              }`}
            />
          ))}
        </div>
      </div>
    </section>
  )
}
