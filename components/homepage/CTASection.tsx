import { Button } from '@/shared/components/ui/button'
import Link from 'next/link'
import { RevealOnScroll } from '../RevealOnScroll'

function CTASection() {
  const trustItems = ['Free to start', 'No credit card required', '30-day money back guarantee']

  return (
    <section className="bg-(--surface-base)">
      <div className="content-wrapper">
        <RevealOnScroll>
          <div className="rounded-(--r-2xl) bg-(--ink-950) relative overflow-hidden px-8 sm:px-12 lg:px-16 py-16 sm:py-20">
            {/* Radial glow */}
            <div className="absolute top-0 left-1/2 -translate-x-1/2 -translate-y-1/2 w-150 h-150 rounded-full bg-(--blue-600)/8 blur-3xl pointer-events-none" />

            <div className="relative z-10 flex flex-col gap-7 items-center text-center max-w-2xl mx-auto">
              <h2 className="font-display font-extrabold text-3xl sm:text-4xl lg:text-5xl text-white leading-tight tracking-[-0.03em]">
                Take your invoicing to the next level
              </h2>
              <p className="text-base text-(--ink-300) leading-relaxed font-body">
                Join thousands of satisfied users and streamline your invoicing
                process today with our powerful, intuitive platform.
              </p>

              <div className="flex flex-col sm:flex-row gap-3 items-center w-full sm:w-auto">
                <Button
                  render={<Link href="/signup" />}
                  className="w-full sm:w-auto bg-(--blue-600) hover:bg-(--blue-700) text-white font-semibold px-8 py-6 rounded-(--r-md) text-base shadow-none transition-colors duration-200 font-display"
                >
                  Create Your First Invoice
                </Button>
                <Button
                  render={<Link href="/about" />}
                  variant="ghost"
                  className="w-full sm:w-auto text-(--ink-300) hover:text-white hover:bg-white/8 font-medium px-8 py-6 rounded-(--r-md) text-base"
                >
                  Learn More
                </Button>
              </div>

              <div className="flex flex-wrap gap-6 items-center justify-center">
                {trustItems.map((item) => (
                  <div key={item} className="flex items-center gap-2 text-(--ink-400) text-xs font-body">
                    <span className="w-1.5 h-1.5 rounded-full bg-(--success)" />
                    {item}
                  </div>
                ))}
              </div>
            </div>
          </div>
        </RevealOnScroll>
      </div>
    </section>
  )
}

export default CTASection
