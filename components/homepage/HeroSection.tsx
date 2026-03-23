import { Button } from '@/shared/components/ui/button'
import Image from 'next/image'
import Link from 'next/link'
import ExternalNavMenu from '../ExternalNavMenu'
import { RevealOnScroll } from '../RevealOnScroll'

export default function HeroSection() {
  const stats = [
    { val: '₦2.4B+', label: 'processed' },
    { val: '12K+', label: 'invoices created' },
    { val: '4.9★', label: 'avg rating' },
  ]

  return (
    <section className="min-h-screen bg-(--ink-950) relative overflow-hidden flex flex-col">
      {/* Subtle grid pattern */}
      <div className="absolute inset-0 opacity-[0.035] bg-[url('/assets/shape-grid-top.svg')] bg-size-[600px] bg-repeat" />

      <ExternalNavMenu />

      <div className="relative z-10 flex flex-col items-center flex-1 pt-36 pb-0 px-5">
        {/* Eyebrow */}
        <RevealOnScroll className="flex justify-center mb-8">
          <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-(--blue-900)/60 border border-(--blue-800) text-(--blue-200) text-xs font-semibold tracking-wider uppercase font-display">
            <span className="w-1.5 h-1.5 rounded-full bg-(--blue-400) animate-pulse" />
            For Nigerian Freelancers &amp; SMBs
          </div>
        </RevealOnScroll>

        {/* Heading */}
        <RevealOnScroll className="text-center max-w-3xl mx-auto mb-6" delay={100}>
          <h1 className="font-display font-extrabold text-4xl sm:text-5xl lg:text-[56px] leading-[1.07] tracking-[-0.04em] text-white">
            From Draft to Payment:{' '}
            <span className="text-(--blue-400)">Professional Invoices</span>{' '}
            in Minutes
          </h1>
        </RevealOnScroll>

        {/* Body */}
        <RevealOnScroll className="text-center max-w-xl mx-auto mb-10" delay={200}>
          <p className="text-base text-(--ink-300) leading-relaxed font-body">
            Create, send, and track invoices effortlessly. Get paid faster with
            automated reminders and seamless payment processing.
          </p>
        </RevealOnScroll>

        {/* CTAs */}
        <RevealOnScroll
          className="flex flex-col sm:flex-row gap-3 items-center justify-center mb-12"
          delay={300}
        >
          <Button
            render={<Link href="/signup" />}
            className="bg-(--blue-600) hover:bg-(--blue-700) text-white font-semibold px-8 py-6 rounded-(--r-md) text-base shadow-none transition-colors duration-200 font-display"
          >
            Create Your First Invoice
          </Button>
          <Button
            render={<Link href="/about" />}
            variant="ghost"
            className="text-(--ink-300) hover:text-white hover:bg-white/8 font-medium px-8 py-6 rounded-(--r-md) text-base"
          >
            See how it works →
          </Button>
        </RevealOnScroll>

        {/* Stats row */}
        <RevealOnScroll
          className="flex flex-wrap gap-8 items-center justify-center mb-16"
          delay={400}
        >
          {stats.map((stat, i) => (
            <div key={i} className="flex items-center gap-2.5">
              <span
                className="text-sm font-semibold text-(--blue-400)"
                style={{ fontFamily: 'var(--font-mono)' }}
              >
                {stat.val}
              </span>
              <span className="text-xs text-(--ink-400) font-body">{stat.label}</span>
              {i < stats.length - 1 && (
                <span className="ml-2 hidden sm:block w-px h-3.5 bg-(--ink-700)" />
              )}
            </div>
          ))}
        </RevealOnScroll>

        {/* Dashboard preview */}
        <RevealOnScroll
          className="w-full max-w-5xl -mb-16 sm:-mb-44 lg:-mb-96"
          delay={500}
        >
          <div className="rounded-t-2xl overflow-hidden border border-white/10 shadow-[0_32px_80px_rgba(0,0,0,0.55)]">
            <Image
              src="/assets/custom-img-08.webp"
              alt="Invox Dashboard Preview"
              width={2000}
              height={2000}
              className="w-full object-cover"
              priority
            />
          </div>
        </RevealOnScroll>
      </div>
    </section>
  )
}
