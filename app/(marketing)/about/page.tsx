import ExternalNavMenu from '@/components/ExternalNavMenu'
import { FAQSection, TestimonialsSection } from '@/components/homepage'
import CTASection from '@/components/homepage/CTASection'
import MovingTextSection from '@/components/homepage/MovingTextSection'
import { RevealOnScroll } from '@/components/RevealOnScroll'
import Image from 'next/image'

const STORY_ITEMS = [
  {
    title: 'From Challenge to Solution',
    body: 'In 2022, I started my programming journey in my thirties while living in Nigeria. As a small business owner myself, I experienced firsthand the frustration of slow, complicated invoicing and chasing clients for payments. I knew there had to be a better way.',
  },
  {
    title: 'The Birth of Invox',
    body: "Invox began as my second Next.js project — what I initially considered practice. But as I poured my heart into every feature, it became something much more meaningful. This isn't just an app; it's my commitment to fellow entrepreneurs who deserve tools that work as hard as they do.",
  },
  {
    title: 'Built with AI, Powered by Purpose',
    body: 'I believe in leveraging every available tool to create better solutions. Invox was built with AI assistance — from generating clean code to optimizing algorithms. This collaboration allowed me to focus on what matters most: creating an intuitive user experience that solves real problems.',
  },
  {
    title: 'Still Learning, Always Growing',
    body: "I'm still learning and discovering new ways to make Invox better. Every user becomes part of this journey. When you use Invox, you're supporting a dream that started with a simple belief: small businesses deserve software that understands their hustle and helps them get paid quickly.",
  },
]

export default function AboutPage() {
  return (
    <>
      {/* Hero */}
      <section className="bg-(--ink-950) grid grid-rows-[80px_1fr] w-full relative overflow-hidden">
        <div className="absolute inset-0 opacity-[0.035] bg-[url('/assets/shape-grid-top.svg')] bg-size-[600px] bg-repeat" />
        <ExternalNavMenu />
        <div className="relative z-10 content-wrapper pt-10 pb-16 flex flex-col justify-center w-full gap-10">
          <div className="flex flex-col sm:flex-row gap-8 justify-between w-full items-start">
            <RevealOnScroll className="flex flex-col gap-4">
              <span className="text-xs font-semibold text-(--blue-400) uppercase tracking-widest font-display">
                About Invox
              </span>
              <h1 className="font-display font-extrabold text-3xl sm:text-4xl lg:text-5xl text-white leading-tight tracking-[-0.03em] max-w-xl">
                Building Solutions from{' '}
                <span className="text-(--blue-400)">Personal Experience</span>
              </h1>
            </RevealOnScroll>
            <RevealOnScroll delay={150} className="max-w-md">
              <p className="text-base text-(--ink-300) leading-relaxed font-body">
                Invox is a modern invoicing platform designed specifically for small
                businesses and entrepreneurs who need to get paid faster. Our app
                transforms the tedious process of creating, sending, and tracking
                invoices into a seamless experience that takes minutes, not hours.
              </p>
            </RevealOnScroll>
          </div>

          <RevealOnScroll delay={300}>
            <Image
              src="/assets/team.webp"
              alt="About Invox — Team"
              width={2000}
              height={2000}
              className="w-full object-cover rounded-(--r-xl) border border-white/10"
              style={{
                maskImage: "url('/assets/shape.png')",
                WebkitMaskImage: "url('/assets/shape.png')",
                maskSize: '100% 100%',
                WebkitMaskSize: '100% 100%',
                maskRepeat: 'no-repeat',
                WebkitMaskRepeat: 'no-repeat',
                maskPosition: 'center',
                WebkitMaskPosition: 'center',
              }}
            />
          </RevealOnScroll>
        </div>
      </section>

      {/* Mission & Vision */}
      <section className="bg-(--surface-page)">
        <div className="content-wrapper flex flex-col gap-12">
          <RevealOnScroll>
            <div className="flex flex-col gap-5 border-l-2 border-(--blue-600) py-7 pl-8">
              <span className="text-xs font-semibold text-(--blue-600) uppercase tracking-widest font-display">
                Our Mission
              </span>
              <h3 className="font-display font-bold text-2xl sm:text-3xl lg:text-4xl text-(--ink-900) leading-tight tracking-[-0.025em] max-w-2xl">
                To eliminate the frustration of invoicing for{' '}
                <span className="text-(--blue-600)">small businesses worldwide.</span>
              </h3>
              <p className="text-base text-(--ink-400) leading-relaxed font-body max-w-xl">
                We believe every entrepreneur deserves tools that work as hard as
                they do — simple, reliable, and designed to get them paid faster so
                they can focus on growing their business.
              </p>
            </div>
          </RevealOnScroll>

          <RevealOnScroll delay={100}>
            <div className="flex flex-col items-end gap-5 border-r-2 border-(--blue-600) py-7 pr-8">
              <span className="text-xs font-semibold text-(--blue-600) uppercase tracking-widest font-display text-right">
                Our Vision
              </span>
              <h3 className="font-display font-bold text-2xl sm:text-3xl lg:text-4xl text-(--ink-900) leading-tight tracking-[-0.025em] max-w-2xl text-right">
                A world where small business owners{' '}
                <span className="text-(--blue-600)">
                  never have to chase payments again.
                </span>
              </h3>
              <p className="text-base text-(--ink-400) leading-relaxed font-body max-w-xl text-right">
                We envision Invox becoming the go-to invoicing solution that
                transforms how entrepreneurs manage their cash flow, turning
                invoicing from a tedious chore into a seamless part of business
                growth.
              </p>
            </div>
          </RevealOnScroll>
        </div>
      </section>

      {/* Founder Section */}
      <section className="bg-(--surface-base)">
        <div className="content-wrapper flex flex-col gap-12 sm:gap-16">
          <RevealOnScroll className="flex flex-col gap-3">
            <span className="text-xs font-semibold text-(--blue-600) uppercase tracking-widest font-display">
              Founder &amp; Developer of Invox
            </span>
            <h2 className="font-display font-extrabold text-5xl sm:text-6xl lg:text-7xl text-(--ink-900) leading-none tracking-[-0.04em]">
              Christopher{' '}
              <span className="text-(--blue-600)">Okafor</span>
            </h2>
          </RevealOnScroll>

          <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
            {[1, 2, 3, 4].map((n, i) => (
              <RevealOnScroll key={n} delay={i * 80}>
                <Image
                  src={`/assets/abt-img-${n}.webp`}
                  alt="Christopher Okafor"
                  width={300}
                  height={400}
                  className="w-full aspect-3/4 object-cover rounded-(--r-xl) border border-(--border-default)"
                />
              </RevealOnScroll>
            ))}
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
            {STORY_ITEMS.map((item, i) => (
              <RevealOnScroll key={i} delay={i * 80}>
                <div className="flex flex-col gap-3 p-6 rounded-(--r-xl) bg-(--surface-raised) border border-(--border-default) h-full">
                  <h4 className="font-display font-bold text-sm text-(--ink-900) tracking-[-0.015em]">
                    {item.title}
                  </h4>
                  <p className="text-sm text-(--ink-400) leading-relaxed font-body">
                    {item.body}
                  </p>
                </div>
              </RevealOnScroll>
            ))}
          </div>
        </div>
      </section>

      <MovingTextSection />
      <TestimonialsSection />
      <FAQSection />
      <CTASection />
    </>
  )
}
