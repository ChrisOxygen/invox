import InnerPageHeader from '@/components/InnerPageHeader'
import { FAQSection } from '@/components/homepage'
import CTASection from '@/components/homepage/CTASection'
import { ContactForm } from '@/components/contactpage'
import { RevealOnScroll } from '@/components/RevealOnScroll'

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
          <div className="max-w-2xl mx-auto">
            <RevealOnScroll className="flex flex-col gap-8">
              <h2 className="font-display font-bold text-3xl sm:text-4xl text-(--ink-900) tracking-[-0.03em]">
                Let&apos;s Get In Touch
              </h2>
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
