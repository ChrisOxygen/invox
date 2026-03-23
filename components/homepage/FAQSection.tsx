'use client'

import { FAQ_DATA } from '@/constants'
import { useState } from 'react'
import { Plus, Minus } from 'lucide-react'
import { RevealOnScroll } from '../RevealOnScroll'

export default function FAQSection() {
  const [openFaqIndex, setOpenFaqIndex] = useState<null | number>(null)

  return (
    <section className="bg-(--surface-page)">
      <div className="content-wrapper flex flex-col items-center gap-14">
        <RevealOnScroll className="flex flex-col items-center gap-4 text-center">
          <span className="text-xs font-semibold text-(--blue-600) uppercase tracking-widest font-display">
            Got Questions?
          </span>
          <h2 className="font-display font-bold text-3xl lg:text-4xl text-(--ink-900) leading-tight tracking-[-0.025em] max-w-120">
            Everything you need to know about{' '}
            <span className="text-(--blue-600)">Invox</span>
          </h2>
          <p className="text-base text-(--ink-400) max-w-125 leading-relaxed font-body">
            Find answers to the most common questions about our invoice management
            platform
          </p>
        </RevealOnScroll>

        <RevealOnScroll
          delay={100}
          className="flex flex-col w-full max-w-2xl divide-y divide-(--border-default)"
        >
          {FAQ_DATA.map((faq, index) => (
            <div key={index} className="py-5">
              <button
                className="w-full flex justify-between items-center text-left gap-4 cursor-pointer"
                onClick={() =>
                  setOpenFaqIndex((prev) => (prev === index ? null : index))
                }
              >
                <span className="font-display font-semibold text-sm text-(--ink-900) leading-snug">
                  {faq.question}
                </span>
                <span className="shrink-0 w-7 h-7 rounded-(--r-sm) border border-(--border-default) flex items-center justify-center text-(--blue-600) bg-(--surface-base)">
                  {openFaqIndex === index ? (
                    <Minus className="w-3.5 h-3.5" />
                  ) : (
                    <Plus className="w-3.5 h-3.5" />
                  )}
                </span>
              </button>
              <div
                className={`overflow-hidden transition-all duration-300 ease-in-out ${
                  openFaqIndex === index
                    ? 'max-h-80 opacity-100 mt-3'
                    : 'max-h-0 opacity-0'
                }`}
              >
                <p className="text-sm text-(--ink-400) leading-relaxed font-body">
                  {faq.answer}
                </p>
              </div>
            </div>
          ))}
        </RevealOnScroll>
      </div>
    </section>
  )
}
