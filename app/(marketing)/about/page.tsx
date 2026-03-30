import { FAQSection, TestimonialsSection } from "@/components/homepage";
import CTASection from "@/components/homepage/CTASection";
import MovingTextSection from "@/components/homepage/MovingTextSection";
import { RevealOnScroll } from "@/components/RevealOnScroll";
import Image from "next/image";
import Link from "next/link";
import { ChevronRight } from "lucide-react";

const STORY_ITEMS = [
  {
    index: "01",
    title: "From Challenge to Solution",
    body: "In 2022, I started my programming journey in my thirties while living in Nigeria. As a small business owner myself, I experienced firsthand the frustration of slow, complicated invoicing and chasing clients for payments. I knew there had to be a better way.",
  },
  {
    index: "02",
    title: "The Birth of Invox",
    body: "Invox began as my second Next.js project — what I initially considered practice. But as I poured my heart into every feature, it became something much more meaningful. This isn't just an app; it's my commitment to fellow entrepreneurs who deserve tools that work as hard as they do.",
  },
  {
    index: "03",
    title: "Built with Purpose",
    body: "I believe in leveraging every available tool to create better solutions. Invox was built with care — from clean code to an intuitive experience. Every design decision focused on one thing: solving real problems for real people.",
  },
  {
    index: "04",
    title: "Still Learning, Always Growing",
    body: "I'm still learning and discovering new ways to make Invox better. Every user becomes part of this journey. When you use Invox, you're supporting a dream that started with a simple belief: small businesses deserve software that understands their hustle.",
  },
];

const STATS = [
  { value: "2022", label: "Founded", mono: true },
  { value: "100%", label: "Free right now", mono: false },
  { value: "NGN", label: "Default currency", mono: true },
  { value: "Lagos", label: "Based in Nigeria", mono: false },
];

export default function AboutPage() {
  return (
    <>
      {/* ─── Hero — no image, pure editorial typography ─── */}
      <section
        className="relative flex flex-col m-3 rounded overflow-hidden bg-(--surface-page)"
        style={{
          backgroundImage:
            "radial-gradient(circle, var(--border-default) 1px, transparent 1px)",
          backgroundSize: "28px 28px",
        }}
      >
        {/* Fade the dot-grid out at the bottom */}
        <div className="absolute inset-x-0 bottom-0 h-32 bg-gradient-to-t from-(--surface-page) to-transparent pointer-events-none" />

        <div className="relative z-10 content-wrapper pt-24 pb-20 flex flex-col w-full gap-10">
          {/* Breadcrumb + meta row */}
          <RevealOnScroll className="flex items-center justify-between">
            <div className="flex items-center gap-1.5 text-xs text-(--ink-400) font-body">
              <Link
                href="/"
                className="hover:text-(--ink-700) transition-colors duration-200"
              >
                Home
              </Link>
              <ChevronRight className="w-3 h-3" />
              <span className="text-(--ink-700)">About</span>
            </div>
            <span
              className="text-xs text-(--ink-300) hidden sm:block"
              style={{ fontFamily: "var(--font-mono)" }}
            >
              EST. 2022
            </span>
          </RevealOnScroll>

          {/* Section label */}
          <RevealOnScroll delay={60}>
            <div className="inline-flex items-center gap-2">
              <span className="w-1.5 h-1.5 rounded bg-(--blue-600) animate-pulse" />
              <span className="text-xs font-semibold text-(--blue-600) uppercase tracking-widest font-display">
                Our Story
              </span>
            </div>
          </RevealOnScroll>

          {/* Big editorial headline */}
          <RevealOnScroll delay={120}>
            <h1 className="font-display font-bold leading-none tracking-display text-(--ink-900)">
              <span className="text-4xl sm:text-6xl ">Built from</span>
              <span className=" text-4xl sm:text-6xl  text-(--blue-600) italic">
                lived
              </span>
              <span className="block text-4xl sm:text-6xl ">experience.</span>
            </h1>
          </RevealOnScroll>

          {/* Sub-copy + scroll cue */}
          <RevealOnScroll
            delay={220}
            className="flex flex-col sm:flex-row sm:items-end justify-between gap-6 max-w-5xl"
          >
            <p className="text-base text-(--ink-400) leading-relaxed font-body max-w-md">
              Invox was built to solve a problem I lived every day — slow,
              complicated invoicing that got in the way of doing real work. It
              transforms creating, sending, and tracking invoices into something
              that takes minutes, not hours.
            </p>
            <div className="flex items-center gap-3 shrink-0">
              <span className="text-xs text-(--ink-300) font-body">
                Scroll to explore
              </span>
              <div className="w-14 h-px bg-(--border-strong)" />
            </div>
          </RevealOnScroll>
        </div>
      </section>

      {/* ─── Stats strip ─── */}
      <section className="bg-(--surface-base) border-y border-(--border-default)">
        <div className="content-wrapper py-0">
          <div className="grid grid-cols-2 sm:grid-cols-4 divide-x divide-(--border-default)">
            {STATS.map(({ value, label, mono }, i) => (
              <RevealOnScroll
                key={label}
                delay={i * 60}
                className="flex flex-col gap-1 py-7 px-6 first:pl-0 last:pr-0"
              >
                <span
                  className="font-extrabold text-2xl sm:text-3xl text-(--ink-900) leading-none tracking-snug"
                  style={{
                    fontFamily: mono
                      ? "var(--font-mono)"
                      : "var(--font-display)",
                  }}
                >
                  {value}
                </span>
                <span className="text-xs text-(--ink-400) font-body">
                  {label}
                </span>
              </RevealOnScroll>
            ))}
          </div>
        </div>
      </section>

      {/* ─── Mission & Vision — indexed editorial ─── */}
      <section className="bg-(--surface-page)">
        <div className="content-wrapper flex flex-col">
          {/* Mission */}
          <RevealOnScroll>
            <div className="border-b border-(--border-default) py-12 sm:py-16 flex flex-col sm:flex-row gap-8 sm:gap-16 items-start">
              {/* Index column */}
              <div className="flex flex-col gap-1.5 shrink-0 sm:w-28">
                <span
                  className="text-4xl sm:text-5xl font-bold text-(--ink-900) leading-none"
                  style={{ fontFamily: "var(--font-mono)", opacity: 0.08 }}
                >
                  01
                </span>
                <span className="text-xs font-semibold text-(--blue-600) uppercase tracking-widest font-display">
                  Mission
                </span>
              </div>

              {/* Content */}
              <div className="flex flex-col gap-4 flex-1">
                <h3 className="font-display font-bold text-2xl sm:text-3xl lg:text-[2.25rem] text-(--ink-900) leading-tight tracking-h2 max-w-2xl">
                  Eliminate the frustration of invoicing for{" "}
                  <span className="text-(--blue-600)">
                    small businesses everywhere.
                  </span>
                </h3>
                <p className="text-base text-(--ink-400) leading-relaxed font-body max-w-xl">
                  Every entrepreneur deserves tools that work as hard as they do
                  — simple, reliable, and designed to get them paid faster so
                  they can focus on growing their business.
                </p>
              </div>
            </div>
          </RevealOnScroll>

          {/* Vision */}
          <RevealOnScroll delay={100}>
            <div className="py-12 sm:py-16 flex flex-col sm:flex-row gap-8 sm:gap-16 items-start">
              {/* Index column */}
              <div className="flex flex-col gap-1.5 shrink-0 sm:w-28">
                <span
                  className="text-4xl sm:text-5xl font-bold text-(--ink-900) leading-none"
                  style={{ fontFamily: "var(--font-mono)", opacity: 0.08 }}
                >
                  02
                </span>
                <span className="text-xs font-semibold text-(--blue-600) uppercase tracking-widest font-display">
                  Vision
                </span>
              </div>

              {/* Content */}
              <div className="flex flex-col gap-4 flex-1">
                <h3 className="font-display font-bold text-2xl sm:text-3xl lg:text-[2.25rem] text-(--ink-900) leading-tight tracking-h2 max-w-2xl">
                  A world where small business owners{" "}
                  <span className="text-(--blue-600)">
                    never chase payments again.
                  </span>
                </h3>
                <p className="text-base text-(--ink-400) leading-relaxed font-body max-w-xl">
                  I envision Invox becoming the go-to invoicing tool that
                  transforms how entrepreneurs manage their cash flow — turning
                  invoicing from a tedious chore into a seamless part of
                  business growth.
                </p>
              </div>
            </div>
          </RevealOnScroll>
        </div>
      </section>

      {/* ─── Founder Section ─── */}
      <section className="bg-(--surface-base) border-t border-(--border-default)">
        <div className="content-wrapper flex flex-col gap-12 sm:gap-14">
          {/* Founder name — editorial headline */}
          <RevealOnScroll className="flex flex-col gap-3">
            <span className="text-xs font-semibold text-(--blue-600) uppercase tracking-widest font-display">
              Founder &amp; Developer of Invox
            </span>
            <h2 className="font-display font-extrabold text-5xl sm:text-7xl lg:text-[88px] xl:text-[104px] text-(--ink-900) leading-none tracking-display">
              Christopher <span className="text-(--blue-600)">Okafor.</span>
            </h2>
            <div className="flex flex-wrap items-center gap-x-4 gap-y-1 mt-1">
              {[
                "Lagos, Nigeria",
                "Started coding in 2022",
                "Building in public",
              ].map((tag, i) => (
                <span
                  key={i}
                  className="flex items-center gap-2 text-sm text-(--ink-400) font-body"
                >
                  {i > 0 && (
                    <span className="w-1 h-1 rounded bg-(--ink-200) hidden sm:block" />
                  )}
                  {tag}
                </span>
              ))}
            </div>
          </RevealOnScroll>

          {/* Founder photo grid */}
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-3">
            {[1, 2, 3, 4].map((n, i) => (
              <RevealOnScroll key={n} delay={i * 80}>
                <Image
                  src={`/assets/abt-img-${n}.webp`}
                  alt="Christopher Okafor"
                  width={300}
                  height={400}
                  className="w-full aspect-3/4 object-cover rounded border border-(--border-default)"
                />
              </RevealOnScroll>
            ))}
          </div>

          {/* Origin story — numbered editorial rows */}
          <div className="flex flex-col pb-8">
            {STORY_ITEMS.map((item, i) => (
              <RevealOnScroll key={i} delay={i * 60}>
                <div className="border-t border-(--border-default) py-8 flex flex-col sm:flex-row gap-6 sm:gap-12 items-start">
                  {/* Index */}
                  <span
                    className="text-sm font-medium shrink-0 sm:w-10 text-(--ink-300) pt-0.5 leading-none"
                    style={{ fontFamily: "var(--font-mono)" }}
                  >
                    {item.index}
                  </span>

                  {/* Content */}
                  <div className="flex flex-col gap-2 flex-1">
                    <h4 className="font-display font-bold text-base text-(--ink-900) tracking-[-0.015em]">
                      {item.title}
                    </h4>
                    <p className="text-sm text-(--ink-400) leading-relaxed font-body max-w-2xl">
                      {item.body}
                    </p>
                  </div>
                </div>
              </RevealOnScroll>
            ))}
            <div className="border-t border-(--border-default)" />
          </div>
        </div>
      </section>

      <MovingTextSection />
      <TestimonialsSection />
      <FAQSection />
      <CTASection />
    </>
  );
}
