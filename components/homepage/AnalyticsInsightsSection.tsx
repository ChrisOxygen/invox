import Image from 'next/image'
import { BarChart3, TrendingUp } from 'lucide-react'
import { RevealOnScroll } from '../RevealOnScroll'

const SUB_FEATURES = [
  {
    icon: BarChart3,
    title: 'Cash Flow Forecasting',
    desc: 'Predict your future revenue with intelligent forecasting based on your invoicing history and payment patterns.',
  },
  {
    icon: TrendingUp,
    title: 'Performance Analytics',
    desc: 'Identify your most valuable clients and track payment behaviors to strengthen business relationships.',
  },
]

export default function AnalyticsInsightsSection() {
  return (
    <section className="bg-(--surface-base)">
      <div className="content-wrapper flex flex-col-reverse lg:flex-row gap-16 items-center">
        {/* Text side */}
        <RevealOnScroll className="basis-1/2 flex flex-col gap-10">
          <div className="flex flex-col gap-5">
            <div className="flex flex-col gap-3">
              <span className="text-xs font-semibold text-(--blue-600) uppercase tracking-widest font-display">
                Smart Business Intelligence
              </span>
              <h2 className="font-display font-bold text-3xl lg:text-4xl text-(--ink-900) leading-tight tracking-[-0.025em] max-w-96">
                Get powerful{' '}
                <span className="text-(--blue-600)">financial insights</span>
              </h2>
            </div>
            <p className="text-base text-(--ink-400) leading-relaxed font-body max-w-120">
              Invox transforms your invoicing data into actionable business
              intelligence. Understand payment patterns, identify your best clients,
              and optimize your cash flow for sustainable growth.
            </p>
          </div>

          <div className="flex flex-col sm:flex-row gap-8">
            {SUB_FEATURES.map((item, i) => {
              const Icon = item.icon
              return (
                <div key={i} className="flex flex-col gap-3 flex-1">
                  <div className="w-10 h-10 rounded-(--r-md) bg-(--blue-50) border border-(--blue-100) flex items-center justify-center text-(--blue-600) shrink-0">
                    <Icon className="w-5 h-5" />
                  </div>
                  <h4 className="font-display font-bold text-sm text-(--ink-900) tracking-[-0.015em]">
                    {item.title}
                  </h4>
                  <p className="text-sm text-(--ink-400) leading-relaxed font-body">
                    {item.desc}
                  </p>
                </div>
              )
            })}
          </div>
        </RevealOnScroll>

        {/* Image side */}
        <RevealOnScroll delay={200} className="basis-1/2 relative lg:min-h-140 w-full">
          <Image
            src="/assets/custom-img-10.jpg"
            alt="Analytics Dashboard"
            width={2000}
            height={2000}
            className="w-full object-cover lg:absolute max-w-md lg:-top-10 lg:left-0 rounded-(--r-xl) shadow-lg border border-(--border-default)"
          />
          <Image
            src="/assets/custom-img-11.jpg"
            alt="Financial Insights"
            width={2000}
            height={2000}
            className="w-full object-cover hidden lg:block absolute max-w-md -bottom-20 right-0 rounded-(--r-xl) shadow-lg border border-(--border-default)"
          />
        </RevealOnScroll>
      </div>
    </section>
  )
}
