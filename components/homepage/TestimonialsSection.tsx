import { Star } from 'lucide-react'
import { RevealOnScroll } from '../RevealOnScroll'

const testimonials = [
  {
    quote:
      'Before Invox, I was attaching Word docs and calling it an invoice. Now I send a branded PDF in under two minutes — my clients\' response changed overnight. They actually pay faster.',
    name: 'Adaeze Nwosu',
    role: 'Freelance Graphic Designer',
    location: 'Lagos',
    initials: 'AN',
    avatarBg: 'var(--blue-600)',
    rating: 5,
  },
  {
    quote:
      'We manage 30+ client projects monthly. Invox\'s dashboard shows paid, pending, and overdue at a glance. Our outstanding invoices dropped by half in the first month.',
    name: 'Emeka Obi',
    role: 'Co-founder, Buildwise Consultants',
    location: 'Abuja',
    initials: 'EO',
    avatarBg: 'var(--ink-500)',
    rating: 5,
  },
  {
    quote:
      'The WhatsApp share button is the feature I didn\'t know I needed. One tap and my invoice is in the client\'s chat. It\'s exactly how business works here.',
    name: 'Temi Adeyemi',
    role: 'Copywriter & Brand Strategist',
    location: 'Lagos',
    initials: 'TA',
    avatarBg: 'var(--success)',
    rating: 5,
  },
]

function StarRating({ count }: { count: number }) {
  return (
    <div className="flex gap-0.5">
      {Array.from({ length: count }).map((_, i) => (
        <Star
          key={i}
          className="w-4 h-4 fill-current text-(--warning)"
        />
      ))}
    </div>
  )
}

export default function TestimonialsSection() {
  return (
    <section id="testimonials" className="bg-(--surface-page)">
      <div className="content-wrapper flex flex-col gap-14">

        {/* Header — split layout */}
        <RevealOnScroll className="flex flex-col lg:flex-row lg:items-end justify-between gap-8">
          <div className="flex flex-col gap-3 max-w-xl">
            <span className="text-xs font-semibold text-(--blue-600) uppercase tracking-widest font-display">
              Customer stories
            </span>
            <h2 className="font-display font-extrabold text-3xl lg:text-4xl text-(--ink-900) leading-tight tracking-[-0.025em]">
              Trusted by freelancers and
              <br className="hidden sm:block" />
              businesses across Nigeria
            </h2>
            <p className="text-sm text-(--ink-400) leading-relaxed font-body">
              Real invoices. Real clients. Real results — from people running
              businesses just like yours.
            </p>
          </div>

          {/* Aggregate rating callout */}
          <div className="flex items-center gap-4 shrink-0 lg:pb-1">
            <div className="flex flex-col items-center gap-1.5 px-6 py-4 rounded-2xl border border-(--border-default) bg-(--surface-base) min-w-28">
              <span
                className="text-3xl font-medium text-(--ink-900) leading-none"
                style={{ fontFamily: 'var(--font-mono)' }}
              >
                4.9
              </span>
              <StarRating count={5} />
              <span className="text-[10px] text-(--ink-300) uppercase tracking-widest font-display">
                500+ reviews
              </span>
            </div>
          </div>
        </RevealOnScroll>

        {/* Card grid */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-5">
          {testimonials.map((t, i) => (
            <RevealOnScroll key={t.name} delay={i * 100}>
              <article className="relative flex flex-col gap-5 rounded-2xl border border-(--border-default) bg-(--surface-base) p-6 h-full overflow-hidden">
                {/* Blue top accent */}
                <div className="absolute top-0 left-0 right-0 h-0.5 bg-(--blue-600)" aria-hidden="true" />

                {/* Stars */}
                <StarRating count={t.rating} />

                {/* Quote */}
                <blockquote className="flex-1">
                  <p className="text-sm text-(--ink-700) leading-relaxed font-body">
                    &ldquo;{t.quote}&rdquo;
                  </p>
                </blockquote>

                {/* Attribution */}
                <figcaption className="flex items-center gap-3 pt-1 border-t border-(--border-default)">
                  <div
                    className="w-9 h-9 rounded-full flex items-center justify-center text-white font-display font-bold text-xs shrink-0"
                    style={{ backgroundColor: t.avatarBg }}
                    aria-hidden="true"
                  >
                    {t.initials}
                  </div>
                  <div className="min-w-0">
                    <p className="text-sm font-semibold text-(--ink-900) font-display leading-tight">
                      {t.name}
                    </p>
                    <p className="text-xs text-(--ink-400) font-body mt-0.5 truncate">
                      {t.role} · {t.location}
                    </p>
                  </div>
                </figcaption>
              </article>
            </RevealOnScroll>
          ))}
        </div>

      </div>
    </section>
  )
}
