import InnerPageHeader from '@/components/InnerPageHeader'
import { FAQSection } from '@/components/homepage'
import CTASection from '@/components/homepage/CTASection'
import { ContactForm } from '@/components/contactpage'
import { RevealOnScroll } from '@/components/RevealOnScroll'
import { Mail, Clock, Zap } from 'lucide-react'

export default function ContactPage() {
  return (
    <>
      <InnerPageHeader
        title="Contact us"
        description="We would love to hear from you! Whether you have a question, feedback, or just want to say hello, feel free to reach out."
        breadcrumb="Contact"
      />

      <section className="bg-(--surface-page)">
        <div className="content-wrapper">
          <div className="flex flex-col lg:flex-row gap-12 lg:gap-16 items-start">
            {/* Left — contact info */}
            <RevealOnScroll className="flex-1 flex flex-col gap-8 max-w-md">
              <div className="flex flex-col gap-3">
                <span className="text-xs font-semibold text-(--blue-600) uppercase tracking-widest font-display">
                  Get in Touch
                </span>
                <h2 className="font-display font-bold text-2xl sm:text-3xl lg:text-4xl text-(--ink-900) leading-tight tracking-[-0.025em]">
                  Let&apos;s Talk.
                  <br />
                  <span className="text-(--blue-600)">We&apos;re All Ears.</span>
                </h2>
              </div>

              <p className="text-base text-(--ink-400) leading-relaxed font-body">
                Whether you&apos;ve got a burning question, a big idea, or just want
                to say hi — we&apos;re ready to help and connect with you.
              </p>

              <div className="flex flex-col gap-3">
                {[
                  {
                    icon: Mail,
                    title: 'Email us',
                    primary: 'support@invox.com',
                    secondary: 'We reply within 24 hours.',
                    href: 'mailto:support@invox.com',
                    accent: false,
                  },
                  {
                    icon: Clock,
                    title: 'Working Hours',
                    primary: 'Monday to Friday',
                    secondary: '9:00 AM – 5:00 PM (PST)',
                    href: null,
                    accent: false,
                  },
                  {
                    icon: Zap,
                    title: 'Quick Response',
                    primary: null,
                    secondary:
                      'Include "URGENT" in your subject line and we\'ll prioritize your message.',
                    href: null,
                    accent: true,
                  },
                ].map((item) => {
                  const Icon = item.icon
                  return (
                    <div
                      key={item.title}
                      className={`flex items-start gap-4 p-5 rounded-(--r-xl) border ${
                        item.accent
                          ? 'bg-(--blue-50) border-(--blue-100)'
                          : 'bg-(--surface-base) border-(--border-default)'
                      }`}
                    >
                      <div
                        className={`w-10 h-10 rounded-(--r-md) flex items-center justify-center shrink-0 ${
                          item.accent
                            ? 'bg-(--blue-600)'
                            : 'bg-(--blue-50) border border-(--blue-100)'
                        }`}
                      >
                        <Icon
                          className={`w-5 h-5 ${item.accent ? 'text-white' : 'text-(--blue-600)'}`}
                        />
                      </div>
                      <div className="flex flex-col gap-1">
                        <span
                          className={`font-display font-semibold text-sm ${
                            item.accent ? 'text-(--blue-900)' : 'text-(--ink-900)'
                          }`}
                        >
                          {item.title}
                        </span>
                        {item.primary &&
                          (item.href ? (
                            <a
                              href={item.href}
                              className="text-sm text-(--blue-600) hover:text-(--blue-700) transition-colors duration-200 font-medium font-body"
                            >
                              {item.primary}
                            </a>
                          ) : (
                            <span className="text-sm text-(--ink-700) font-medium font-body">
                              {item.primary}
                            </span>
                          ))}
                        <span
                          className={`text-xs font-body ${
                            item.accent ? 'text-(--blue-700)' : 'text-(--ink-400)'
                          }`}
                        >
                          {item.secondary}
                        </span>
                      </div>
                    </div>
                  )
                })}
              </div>
            </RevealOnScroll>

            {/* Right — form */}
            <RevealOnScroll delay={150} className="flex-1 w-full">
              <ContactForm />
            </RevealOnScroll>
          </div>
        </div>
      </section>

      <FAQSection />
      <CTASection />
    </>
  )
}
