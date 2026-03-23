import { FileText, Bell, CreditCard, BarChart3 } from 'lucide-react'
import { RevealOnScroll } from '../RevealOnScroll'

const FEATURES = [
  {
    icon: FileText,
    title: 'Smart Invoice Creation',
    description:
      'Create professional invoices in seconds with customizable templates designed for your industry.',
  },
  {
    icon: Bell,
    title: 'Automated Reminders',
    description:
      'Never chase payments again with smart, automated follow-up reminders that get results.',
  },
  {
    icon: CreditCard,
    title: 'Instant Payments',
    description:
      'Accept bank transfers, Paystack, and digital payments with seamless integration.',
  },
  {
    icon: BarChart3,
    title: 'Real-time Analytics',
    description:
      'Track your revenue, outstanding payments, and cash flow with detailed reporting dashboards.',
  },
]

export default function FeaturesSection() {
  return (
    <section className="bg-(--surface-page)">
      <div className="content-wrapper flex flex-col gap-14">
        <div className="flex flex-col lg:flex-row justify-between items-start gap-10">
          <RevealOnScroll className="flex flex-col gap-3">
            <span className="text-xs font-semibold text-(--blue-600) uppercase tracking-widest font-display">
              Built for Small Business
            </span>
            <h2 className="font-display font-bold text-3xl lg:text-4xl text-(--ink-900) leading-tight tracking-[-0.025em] max-w-96">
              Streamlining invoicing for{' '}
              <span className="text-(--blue-600)">entrepreneurs</span>
            </h2>
          </RevealOnScroll>
          <RevealOnScroll delay={120} className="lg:max-w-lg">
            <p className="text-base text-(--ink-400) leading-relaxed font-body">
              At Invox, we understand the challenges small business owners face with
              invoicing. Our platform simplifies every step of the process, from
              creation to payment — so you can focus on growing your business.
            </p>
          </RevealOnScroll>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          {FEATURES.map((feature, i) => {
            const Icon = feature.icon
            return (
              <RevealOnScroll key={i} delay={i * 80} className="h-full">
                <div className="flex flex-col gap-5 p-6 h-full bg-(--surface-base) rounded-(--r-xl) border border-(--border-default) hover:border-(--blue-200) hover:shadow-sm transition-all duration-200 group">
                  <div className="w-10 h-10 rounded-(--r-md) bg-(--blue-50) border border-(--blue-100) flex items-center justify-center text-(--blue-600) group-hover:bg-(--blue-600) group-hover:text-white group-hover:border-(--blue-600) transition-colors duration-200 shrink-0">
                    <Icon className="w-5 h-5" />
                  </div>
                  <div className="flex flex-col gap-2">
                    <h4 className="font-display font-bold text-sm text-(--ink-900) tracking-[-0.015em]">
                      {feature.title}
                    </h4>
                    <p className="text-sm text-(--ink-400) leading-relaxed font-body">
                      {feature.description}
                    </p>
                  </div>
                </div>
              </RevealOnScroll>
            )
          })}
        </div>
      </div>
    </section>
  )
}
