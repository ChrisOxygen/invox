'use client'

import { useState } from 'react'
import {
  ArrowRight,
  CheckCircle,
  ChevronDown,
  Mail,
  MessageSquare,
  Building,
  User,
} from 'lucide-react'

const inquiryOptions = [
  'General Inquiry',
  'Billing & Payments',
  'Technical Support',
  'Feature Request',
  'Partnership',
  'Other',
]

const descriptionOptions = [
  'I am a freelancer',
  'I run a small business',
  'I am an agency',
  'I am evaluating tools',
  'I am a developer',
]

function SelectField({
  label,
  required,
  options,
  placeholder,
  icon: Icon,
}: {
  label: string
  required?: boolean
  options: string[]
  placeholder: string
  icon: React.ElementType
}) {
  const [open, setOpen] = useState(false)
  const [value, setValue] = useState('')

  return (
    <div className="flex flex-col gap-2">
      <label className="text-xs font-semibold text-(--ink-900) font-display">
        {label}
        {required && <span className="text-(--error) ml-0.5">*</span>}
      </label>
      <div className="relative">
        <button
          type="button"
          onClick={() => setOpen(!open)}
          className="w-full flex items-center gap-3 px-4 py-3 rounded border border-(--border-default) bg-(--surface-base) text-sm text-left focus:outline-none focus:border-(--ink-900) transition-colors duration-150"
        >
          <Icon className="w-4 h-4 text-(--ink-300) shrink-0" />
          <span className={value ? 'text-(--ink-900) font-body flex-1' : 'text-(--ink-300) font-body flex-1'}>
            {value || placeholder}
          </span>
          <ChevronDown
            className={`w-4 h-4 text-(--ink-400) shrink-0 transition-transform duration-150 ${open ? 'rotate-180' : ''}`}
          />
        </button>

        {open && (
          <div className="absolute z-20 top-full left-0 right-0 mt-1 rounded border border-(--border-default) bg-(--surface-base) shadow-sm overflow-hidden">
            {options.map((opt) => (
              <button
                key={opt}
                type="button"
                onClick={() => { setValue(opt); setOpen(false) }}
                className="w-full text-left px-4 py-2.5 text-sm font-body text-(--ink-700) hover:bg-(--surface-overlay) transition-colors duration-100"
              >
                {opt}
              </button>
            ))}
          </div>
        )}
      </div>
    </div>
  )
}

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

  const inputClass =
    'w-full flex items-center gap-3 px-4 py-3 rounded border border-(--border-default) bg-(--surface-base) text-sm text-(--ink-900) font-body placeholder:text-(--ink-300) focus:outline-none focus:border-(--ink-900) transition-colors duration-150'

  if (submitted) {
    return (
      <div className="flex flex-col items-center justify-center gap-5 py-20 text-center">
        <div className="w-14 h-14 rounded bg-(--success)/10 flex items-center justify-center">
          <CheckCircle className="w-7 h-7 text-(--success)" />
        </div>
        <div className="flex flex-col gap-2">
          <h3 className="font-display font-bold text-xl text-(--ink-900) tracking-[-0.02em]">
            Message sent!
          </h3>
          <p className="text-sm text-(--ink-400) font-body max-w-xs">
            We&apos;ll get back to you within 24 hours.
          </p>
        </div>
      </div>
    )
  }

  return (
    <form onSubmit={handleSubmit} className="flex flex-col gap-5">
      {/* Row 1: inquiry type + who you are */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <SelectField
          label="Inquiry Type"
          required
          options={inquiryOptions}
          placeholder="Choose one..."
          icon={MessageSquare}
        />
        <SelectField
          label="Best describes you"
          options={descriptionOptions}
          placeholder="Choose one..."
          icon={User}
        />
      </div>

      {/* Row 2: name + email */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <div className="flex flex-col gap-2">
          <label className="text-xs font-semibold text-(--ink-900) font-display">
            Full Name <span className="text-(--error)">*</span>
          </label>
          <div className="relative flex items-center">
            <User className="absolute left-4 w-4 h-4 text-(--ink-300) pointer-events-none" strokeWidth={1.5} />
            <input
              type="text"
              required
              placeholder="Your full name"
              className={`${inputClass} pl-11`}
            />
          </div>
        </div>
        <div className="flex flex-col gap-2">
          <label className="text-xs font-semibold text-(--ink-900) font-display">
            Email Address <span className="text-(--error)">*</span>
          </label>
          <div className="relative flex items-center">
            <Mail className="absolute left-4 w-4 h-4 text-(--ink-300) pointer-events-none" strokeWidth={1.5} />
            <input
              type="email"
              required
              placeholder="you@example.com"
              className={`${inputClass} pl-11`}
            />
          </div>
        </div>
      </div>

      {/* Row 3: organization (optional) */}
      <div className="flex flex-col gap-2">
        <label className="text-xs font-semibold text-(--ink-900) font-display">
          Organization{' '}
          <span className="text-(--ink-300) font-normal font-body normal-case tracking-normal text-[11px]">
            — optional
          </span>
        </label>
        <div className="relative flex items-center">
          <Building className="absolute left-4 w-4 h-4 text-(--ink-300) pointer-events-none" strokeWidth={1.5} />
          <input
            type="text"
            placeholder="Your business or agency name"
            className={`${inputClass} pl-11`}
          />
        </div>
      </div>

      {/* Row 4: message */}
      <div className="flex flex-col gap-2">
        <label className="text-xs font-semibold text-(--ink-900) font-display">
          Message <span className="text-(--error)">*</span>
        </label>
        <div className="relative">
          <MessageSquare
            className="absolute left-4 top-3.5 w-4 h-4 text-(--ink-300) pointer-events-none"
            strokeWidth={1.5}
          />
          <textarea
            required
            rows={5}
            placeholder="Tell us what's on your mind..."
            className={`${inputClass} pl-11 resize-none`}
          />
        </div>
      </div>

      {/* Submit */}
      <button
        type="submit"
        disabled={isSubmitting}
        className="self-start flex items-center gap-2.5 px-8 py-3.5 rounded bg-(--blue-600) hover:bg-(--blue-700) text-white text-sm font-semibold font-display transition-colors duration-150 disabled:opacity-60 disabled:cursor-not-allowed"
      >
        {isSubmitting ? (
          <>
            <span className="w-4 h-4 rounded border-2 border-white/30 border-t-white animate-spin" />
            Sending...
          </>
        ) : (
          <>
            Send Message
            <ArrowRight className="w-4 h-4" />
          </>
        )}
      </button>
    </form>
  )
}
