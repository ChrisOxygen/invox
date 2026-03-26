import Image from 'next/image'
import Link from 'next/link'
import { ChevronRight, Mail, MapPin, Zap, MessageCircle } from 'lucide-react'
import ExternalNavMenu from '@/components/ExternalNavMenu'
import { FAQSection } from '@/components/homepage'
import CTASection from '@/components/homepage/CTASection'
import { ContactForm } from '@/components/contactpage'
import { RevealOnScroll } from '@/components/RevealOnScroll'

const CONTACT_CARDS = [
  {
    icon: Mail,
    label: 'General Support',
    description: 'Questions, account issues, or just need help getting started.',
    value: 'support@invox.ng',
    href: 'mailto:support@invox.ng',
  },
  {
    icon: MessageCircle,
    label: 'Say Hello',
    description: 'Feedback, partnerships, or anything else on your mind.',
    value: 'hello@invox.ng',
    href: 'mailto:hello@invox.ng',
  },
  {
    icon: Zap,
    label: 'Feature Requests',
    description: 'Got an idea that would make Invox better for you?',
    value: 'hello@invox.ng',
    href: 'mailto:hello@invox.ng?subject=Feature%20Request',
  },
]

export default function ContactPage() {
  return (
    <>
      {/* Hero — matches landing page light style */}
      <section className="relative overflow-hidden flex flex-col m-3 rounded bg-[#F3F0FF]">
        <Image
          src="/assets/cloud-bg-hero.png"
          alt=""
          fill
          className="object-cover object-center"
          priority
          aria-hidden
        />
        <div className="absolute inset-0 bg-white/20" />

        <ExternalNavMenu />

        <div className="relative z-10 content-wrapper pt-6 pb-14 flex flex-col items-center w-full gap-6">
          {/* Breadcrumb */}
          <RevealOnScroll className="flex items-center gap-1.5 text-xs text-(--ink-400) font-body self-start w-full">
            <Link href="/" className="hover:text-(--ink-700) transition-colors duration-200">
              Home
            </Link>
            <ChevronRight className="w-3 h-3" />
            <span className="text-(--ink-700)">Contact</span>
          </RevealOnScroll>

          {/* Eyebrow */}
          <RevealOnScroll delay={50}>
            <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded bg-white/70 backdrop-blur-sm border border-white/80 text-(--ink-500) text-xs font-semibold tracking-wider uppercase font-display shadow-sm">
              <span className="w-1.5 h-1.5 rounded bg-(--blue-500) animate-pulse" />
              Contact Us
            </div>
          </RevealOnScroll>

          {/* Heading */}
          <RevealOnScroll className="text-center max-w-2xl" delay={100}>
            <h1 className="font-display font-bold text-4xl sm:text-5xl leading-[1.07] tracking-[-0.04em] text-(--ink-900)">
              We&apos;d love to{' '}
              <span className="text-(--blue-600) italic">hear from you</span>
            </h1>
          </RevealOnScroll>

          {/* Subtitle */}
          <RevealOnScroll className="text-center max-w-lg" delay={180}>
            <p className="text-base text-(--ink-400) leading-relaxed font-body">
              Whether you have a question, feedback, or just want to say hello — we&apos;re
              right here. We typically reply within 24 hours.
            </p>
          </RevealOnScroll>

          {/* Location pill */}
          <RevealOnScroll delay={240}>
            <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded bg-white/60 backdrop-blur-sm border border-white/70 text-(--ink-500) text-xs font-body">
              <MapPin className="w-3 h-3 text-(--blue-500)" />
              Lagos, Nigeria
            </div>
          </RevealOnScroll>
        </div>
      </section>

      {/* Contact cards + form */}
      <section className="bg-(--surface-page)">
        <div className="content-wrapper flex flex-col gap-12">

          {/* Contact method cards */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            {CONTACT_CARDS.map(({ icon: Icon, label, description, value, href }, i) => (
              <RevealOnScroll key={label} delay={i * 80}>
                <a
                  href={href}
                  className="group flex flex-col gap-4 p-5 rounded bg-(--surface-base) border border-(--border-default) hover:border-(--blue-400) transition-colors duration-200 h-full"
                >
                  <div className="w-9 h-9 rounded bg-(--blue-50) flex items-center justify-center">
                    <Icon className="w-4 h-4 text-(--blue-600)" strokeWidth={1.5} />
                  </div>
                  <div className="flex flex-col gap-1 flex-1">
                    <span className="text-xs font-semibold text-(--ink-900) font-display tracking-[-0.01em]">
                      {label}
                    </span>
                    <p className="text-xs text-(--ink-400) font-body leading-relaxed">
                      {description}
                    </p>
                  </div>
                  <span
                    className="text-xs font-medium text-(--blue-600) group-hover:underline underline-offset-2"
                    style={{ fontFamily: 'var(--font-mono)' }}
                  >
                    {value}
                  </span>
                </a>
              </RevealOnScroll>
            ))}
          </div>

          {/* Labeled divider */}
          <RevealOnScroll className="flex items-center gap-4">
            <div className="flex-1 h-px bg-(--border-default)" />
            <span className="text-xs font-semibold text-(--ink-300) font-display uppercase tracking-widest shrink-0">
              Or send us a message
            </span>
            <div className="flex-1 h-px bg-(--border-default)" />
          </RevealOnScroll>

          {/* Form */}
          <RevealOnScroll className="max-w-2xl mx-auto w-full pb-4" delay={100}>
            <ContactForm />
          </RevealOnScroll>

        </div>
      </section>

      <FAQSection />
      <CTASection />
    </>
  )
}
