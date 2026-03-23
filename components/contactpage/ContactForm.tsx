'use client'

import { useState } from 'react'
import { Button } from '@/shared/components/ui/button'
import { Send, CheckCircle } from 'lucide-react'

export function ContactForm() {
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [submitted, setSubmitted] = useState(false)

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    setIsSubmitting(true)
    await new Promise((resolve) => setTimeout(resolve, 1400))
    setIsSubmitting(false)
    setSubmitted(true)
  }

  if (submitted) {
    return (
      <div className="flex-1 flex flex-col items-center justify-center gap-5 p-10 rounded-(--r-2xl) bg-(--surface-base) border border-(--border-default) text-center min-h-96">
        <div className="w-14 h-14 rounded-full bg-(--success)/10 flex items-center justify-center">
          <CheckCircle className="w-7 h-7 text-(--success)" />
        </div>
        <div className="flex flex-col gap-2">
          <h3 className="font-display font-bold text-xl text-(--ink-900) tracking-[-0.02em]">
            Message sent!
          </h3>
          <p className="text-sm text-(--ink-400) font-body">
            We&apos;ll get back to you within 24 hours.
          </p>
        </div>
      </div>
    )
  }

  const inputClass =
    'w-full px-4 py-3 rounded-(--r-md) border border-(--border-default) bg-(--surface-page) text-sm text-(--ink-900) font-body placeholder:text-(--ink-300) focus:outline-none focus:border-(--blue-600) focus:ring-1 focus:ring-(--blue-600) transition-colors duration-200'

  const labelClass =
    'text-[11px] font-semibold text-(--ink-500) uppercase tracking-widest font-display'

  return (
    <div className="flex-1 flex flex-col gap-6 p-7 rounded-(--r-2xl) bg-(--surface-base) border border-(--border-default)">
      <div className="flex flex-col gap-1">
        <h3 className="font-display font-bold text-lg text-(--ink-900) tracking-[-0.02em]">
          Send us a message
        </h3>
        <p className="text-sm text-(--ink-400) font-body">
          Fill out the form below and we&apos;ll get back to you soon.
        </p>
      </div>

      <form onSubmit={handleSubmit} className="flex flex-col gap-5">
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div className="flex flex-col gap-2">
            <label className={labelClass}>Full Name *</label>
            <input
              type="text"
              required
              placeholder="Enter your full name"
              className={inputClass}
            />
          </div>
          <div className="flex flex-col gap-2">
            <label className={labelClass}>Email Address *</label>
            <input
              type="email"
              required
              placeholder="your@email.com"
              className={inputClass}
            />
          </div>
        </div>

        <div className="flex flex-col gap-2">
          <label className={labelClass}>Subject *</label>
          <input
            type="text"
            required
            placeholder="What's this about?"
            className={inputClass}
          />
        </div>

        <div className="flex flex-col gap-2">
          <label className={labelClass}>Message *</label>
          <textarea
            required
            rows={4}
            placeholder="Tell us more about your inquiry..."
            className={`${inputClass} resize-none`}
          />
        </div>

        <Button
          type="submit"
          disabled={isSubmitting}
          className="w-full bg-(--blue-600) hover:bg-(--blue-700) text-white font-semibold py-6 rounded-(--r-md) text-sm shadow-none transition-colors duration-200 font-display"
        >
          {isSubmitting ? (
            <span className="flex items-center gap-2">
              <span className="w-4 h-4 rounded-full border-2 border-white/30 border-t-white animate-spin" />
              Sending...
            </span>
          ) : (
            <span className="flex items-center gap-2">
              <Send className="w-4 h-4" />
              Send Message
            </span>
          )}
        </Button>

        <p className="text-center text-xs text-(--ink-400) font-body">
          By submitting this form, you agree to our{' '}
          <a href="/privacy-policy" className="text-(--blue-600) hover:underline">
            Privacy Policy
          </a>{' '}
          and{' '}
          <a href="/terms-of-service" className="text-(--blue-600) hover:underline">
            Terms of Service
          </a>
          .
        </p>
      </form>
    </div>
  )
}
