'use client'

import { useState } from 'react'
import { ArrowRight, CheckCircle, Mail, User, Building2 } from 'lucide-react'

const TOPICS = [
  'General Inquiry',
  'Billing & Payments',
  'Technical Support',
  'Feature Request',
  'Partnership',
  'Other',
]

const WHO_OPTIONS = ['Freelancer', 'Small Business', 'Agency', 'Just Evaluating', 'Developer']

const MAX_CHARS = 500

export function ContactForm() {
  const [topic, setTopic] = useState('')
  const [who, setWho] = useState('')
  const [charCount, setCharCount] = useState(0)
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
      <div className="flex flex-col items-center justify-center gap-6 py-24 text-center">
        <div className="relative">
          <div className="w-16 h-16 rounded-full bg-(--success)/10 flex items-center justify-center">
            <CheckCircle className="w-7 h-7 text-(--success)" />
          </div>
          <span className="absolute -top-1 -right-1 w-5 h-5 rounded-full bg-(--success) flex items-center justify-center text-white text-[10px] font-mono font-bold">
            ✓
          </span>
        </div>
        <div className="flex flex-col gap-2.5">
          <h3 className="font-display font-extrabold text-2xl text-(--ink-900) tracking-[-0.025em]">
            Message delivered.
          </h3>
          <p className="text-sm text-(--ink-400) font-body max-w-65 leading-relaxed">
            We&apos;ll review it and get back to you within 24 hours — usually much sooner.
          </p>
        </div>
        <div className="flex flex-col gap-2 w-full max-w-xs pt-4 border-t border-(--border-default)">
          {['Message received', 'Being reviewed', 'Reply coming soon'].map((s, i) => (
            <div key={i} className="flex items-center gap-3">
              <div className="w-5 h-5 rounded bg-(--blue-50) flex items-center justify-center shrink-0">
                <span className="text-[10px] font-mono font-semibold text-(--blue-600)">{i + 1}</span>
              </div>
              <span className="text-xs text-(--ink-500) font-body">{s}</span>
            </div>
          ))}
        </div>
      </div>
    )
  }

  const underlineInput =
    'w-full py-3.5 border-b border-(--border-default) bg-transparent text-sm text-(--ink-900) font-body placeholder:text-(--ink-300) focus:outline-none focus:border-(--blue-600) transition-colors duration-150'

  return (
    <form onSubmit={handleSubmit} className="flex flex-col gap-9">
      {/* Form header */}
      <div className="flex flex-col gap-2">
        <div className="flex items-center gap-3 mb-1">
          <span className="text-[10px] font-mono text-(--ink-300) tracking-widest uppercase">
            MSG_001
          </span>
          <div className="flex-1 h-px bg-(--border-default)" />
        </div>
        <h2 className="font-display font-extrabold text-2xl sm:text-3xl text-(--ink-900) tracking-[-0.03em] leading-tight">
          Send us a message
        </h2>
        <p className="text-sm text-(--ink-400) font-body">
          We read every message. No bots, no automated replies.
        </p>
      </div>

      {/* Topic chips */}
      <div className="flex flex-col gap-3">
        <label className="text-[10px] font-semibold text-(--ink-400) font-display uppercase tracking-[0.08em]">
          What&apos;s this about? <span className="text-(--error)">*</span>
        </label>
        <div className="flex flex-wrap gap-2">
          {TOPICS.map((t) => (
            <button
              key={t}
              type="button"
              onClick={() => setTopic(topic === t ? '' : t)}
              className={`px-3.5 py-1.5 rounded-full text-xs font-semibold font-display transition-all duration-150 border ${
                topic === t
                  ? 'bg-(--blue-600) text-white border-(--blue-600)'
                  : 'bg-(--surface-base) text-(--ink-500) border-(--border-default) hover:border-(--blue-400) hover:text-(--blue-600)'
              }`}
            >
              {t}
            </button>
          ))}
        </div>
      </div>

      {/* Who are you chips */}
      <div className="flex flex-col gap-3">
        <label className="text-[10px] font-semibold text-(--ink-400) font-display uppercase tracking-[0.08em]">
          Best describes you
        </label>
        <div className="flex flex-wrap gap-2">
          {WHO_OPTIONS.map((w) => (
            <button
              key={w}
              type="button"
              onClick={() => setWho(who === w ? '' : w)}
              className={`px-3.5 py-1.5 rounded-full text-xs font-semibold font-display transition-all duration-150 border ${
                who === w
                  ? 'bg-(--ink-900) text-white border-(--ink-900)'
                  : 'bg-(--surface-base) text-(--ink-500) border-(--border-default) hover:border-(--ink-500) hover:text-(--ink-700)'
              }`}
            >
              {w}
            </button>
          ))}
        </div>
      </div>

      {/* Name + Email — underline inputs */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
        <div className="flex flex-col gap-1.5">
          <label className="text-[10px] font-semibold text-(--ink-400) font-display uppercase tracking-[0.08em]">
            Full Name <span className="text-(--error)">*</span>
          </label>
          <div className="relative flex items-center">
            <input
              type="text"
              required
              placeholder="Your full name"
              className={`${underlineInput} pr-7`}
            />
            <User className="absolute right-0 w-4 h-4 text-(--ink-300) pointer-events-none" strokeWidth={1.5} />
          </div>
        </div>

        <div className="flex flex-col gap-1.5">
          <label className="text-[10px] font-semibold text-(--ink-400) font-display uppercase tracking-[0.08em]">
            Email Address <span className="text-(--error)">*</span>
          </label>
          <div className="relative flex items-center">
            <input
              type="email"
              required
              placeholder="you@example.com"
              className={`${underlineInput} pr-7`}
            />
            <Mail className="absolute right-0 w-4 h-4 text-(--ink-300) pointer-events-none" strokeWidth={1.5} />
          </div>
        </div>
      </div>

      {/* Organization */}
      <div className="flex flex-col gap-1.5">
        <label className="text-[10px] font-semibold text-(--ink-400) font-display uppercase tracking-[0.08em]">
          Organization{' '}
          <span className="normal-case tracking-normal font-normal text-(--ink-300) text-[10px]">
            — optional
          </span>
        </label>
        <div className="relative flex items-center">
          <input
            type="text"
            placeholder="Your business or agency name"
            className={`${underlineInput} pr-7`}
          />
          <Building2 className="absolute right-0 w-4 h-4 text-(--ink-300) pointer-events-none" strokeWidth={1.5} />
        </div>
      </div>

      {/* Message with char counter */}
      <div className="flex flex-col gap-1.5">
        <div className="flex items-center justify-between">
          <label className="text-[10px] font-semibold text-(--ink-400) font-display uppercase tracking-[0.08em]">
            Message <span className="text-(--error)">*</span>
          </label>
          <span
            className={`text-[10px] font-mono tabular-nums ${
              charCount > MAX_CHARS * 0.9 ? 'text-(--warning)' : 'text-(--ink-300)'
            }`}
          >
            {charCount}/{MAX_CHARS}
          </span>
        </div>
        <textarea
          required
          rows={5}
          maxLength={MAX_CHARS}
          placeholder="Tell us what's on your mind..."
          onChange={(e) => setCharCount(e.target.value.length)}
          className="w-full py-3.5 border-b border-(--border-default) bg-transparent text-sm text-(--ink-900) font-body placeholder:text-(--ink-300) focus:outline-none focus:border-(--blue-600) transition-colors duration-150 resize-none"
        />
      </div>

      {/* Submit row */}
      <div className="flex items-center justify-between gap-4 pt-2 border-t border-(--border-default)">
        <p className="text-[11px] text-(--ink-300) font-body leading-relaxed">
          By submitting, you agree to our{' '}
          <a
            href="/privacy-policy"
            className="underline underline-offset-2 hover:text-(--ink-500) transition-colors duration-150"
          >
            Privacy Policy
          </a>
          .
        </p>
        <button
          type="submit"
          disabled={isSubmitting || !topic}
          className="flex items-center gap-2.5 px-6 py-3 rounded bg-(--blue-600) hover:bg-(--blue-700) text-white text-sm font-semibold font-display transition-colors duration-150 disabled:opacity-50 disabled:cursor-not-allowed shrink-0"
        >
          {isSubmitting ? (
            <>
              <span className="w-4 h-4 rounded-full border-2 border-white/30 border-t-white animate-spin" />
              Sending...
            </>
          ) : (
            <>
              Send message
              <ArrowRight className="w-4 h-4" />
            </>
          )}
        </button>
      </div>
    </form>
  )
}
