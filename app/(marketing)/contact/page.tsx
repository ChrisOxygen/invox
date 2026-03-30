import Image from "next/image";
import Link from "next/link";
import {
  ChevronRight,
  Mail,
  MapPin,
  Zap,
  MessageCircle,
  ArrowUpRight,
  Clock,
} from "lucide-react";
import ExternalNavMenu from "@/components/ExternalNavMenu";
import { FAQSection } from "@/components/homepage";
import CTASection from "@/components/homepage/CTASection";
import { ContactForm } from "@/components/contactpage";
import { RevealOnScroll } from "@/components/RevealOnScroll";

const CONTACT_CHANNELS = [
  {
    num: "01",
    icon: Mail,
    label: "General Support",
    description: "Questions, account issues, or just getting started.",
    value: "support@invox.ng",
    href: "mailto:support@invox.ng",
  },
  {
    num: "02",
    icon: MessageCircle,
    label: "Say Hello",
    description: "Feedback, partnerships, or anything on your mind.",
    value: "hello@invox.ng",
    href: "mailto:hello@invox.ng",
  },
  {
    num: "03",
    icon: Zap,
    label: "Feature Requests",
    description: "Got an idea that would make Invox better for you?",
    value: "hello@invox.ng",
    href: "mailto:hello@invox.ng?subject=Feature%20Request",
  },
];

const NEXT_STEPS = [
  "You send us a message using the form.",
  "We read it carefully and get context.",
  "You hear back within 24 hours, guaranteed.",
];

export default function ContactPage() {
  return (
    <>
      {/* ─── Hero ─── */}
      <section className="relative overflow-hidden flex flex-col m-3 rounded bg-[#F3F0FF]">
        <Image
          src="/assets/cloud-bg-hero.png"
          alt=""
          fill
          className="object-cover object-center"
          priority
          aria-hidden
        />
        <div className="absolute inset-0 bg-white/20" />

        <ExternalNavMenu />

        <div className="relative z-10 content-wrapper pt-6 pb-14 flex flex-col w-full gap-8">
          {/* Breadcrumb */}
          <RevealOnScroll className="flex items-center gap-1.5 text-xs text-(--ink-400) font-body">
            <Link
              href="/"
              className="hover:text-(--ink-700) transition-colors duration-200"
            >
              Home
            </Link>
            <ChevronRight className="w-3 h-3" />
            <span className="text-(--ink-700)">Contact</span>
          </RevealOnScroll>

          {/* Hero content — asymmetric split */}
          <div className="flex flex-col lg:flex-row items-start justify-between gap-10">
            {/* Left: copy */}
            <div className="flex flex-col gap-6 max-w-xl">
              <RevealOnScroll delay={50}>
                <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded bg-white/70 backdrop-blur-sm border border-white/80 text-(--ink-500) text-xs font-semibold tracking-wider uppercase font-display shadow-sm">
                  <span className="w-1.5 h-1.5 rounded bg-(--success) animate-pulse" />
                  Replies within 24 hours
                </div>
              </RevealOnScroll>

              <RevealOnScroll delay={100}>
                <h1 className="font-display font-extrabold text-4xl sm:text-5xl lg:text-[3.5rem] leading-[1.05] tracking-[-0.04em] text-(--ink-900)">
                  Let&apos;s have a{" "}
                  <span className="text-(--blue-600) italic">
                    real conversation.
                  </span>
                </h1>
              </RevealOnScroll>

              <RevealOnScroll delay={180}>
                <p className="text-base text-(--ink-400) leading-relaxed font-body max-w-md">
                  Whether it&apos;s a question, a bug, a wild idea, or just a
                  hello — we read every message and reply personally.
                </p>
              </RevealOnScroll>

              <RevealOnScroll delay={220}>
                <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded bg-white/60 backdrop-blur-sm border border-white/70 text-(--ink-500) text-xs font-body">
                  <MapPin className="w-3 h-3 text-(--blue-500)" />
                  Lagos, Nigeria — Mon to Fri, 9am–6pm WAT
                </div>
              </RevealOnScroll>
            </div>

            {/* Right: response time stat */}
            <RevealOnScroll
              delay={200}
              className="flex flex-col items-start lg:items-end gap-1 shrink-0"
            >
              <span className="text-[5rem] sm:text-[6.5rem] font-display font-extrabold text-(--blue-600) leading-none tracking-[-0.05em]">
                24h
              </span>
              <span className="text-sm text-(--ink-400) font-body lg:text-right leading-snug">
                avg. response
                <br className="hidden lg:block" /> time
              </span>
              <div className="flex items-center gap-1.5 mt-2">
                <Clock className="w-3 h-3 text-(--success)" />
                <span className="text-xs text-(--success) font-semibold font-body">
                  Usually faster
                </span>
              </div>
            </RevealOnScroll>
          </div>
        </div>
      </section>

      {/* ─── Main: Channels sidebar + Form ─── */}
      <section className="bg-(--surface-page)">
        <div className="content-wrapper">
          <div className="grid grid-cols-1 lg:grid-cols-[5fr_7fr] gap-12 xl:gap-20 items-start">
            {/* Left sidebar — sticky */}
            <div className="flex flex-col gap-10 lg:sticky lg:top-28">
              {/* Contact channels — numbered directory */}
              <RevealOnScroll>
                <div className="flex flex-col">
                  <span className="text-[10px] font-semibold text-(--ink-300) uppercase tracking-[0.08em] font-display mb-5">
                    Reach us directly
                  </span>
                  {CONTACT_CHANNELS.map(
                    ({ num, icon: Icon, label, description, value, href }) => (
                      <a
                        key={label}
                        href={href}
                        className="group flex items-start gap-4 py-5 border-t border-(--border-default) last:border-b hover:bg-(--surface-raised) transition-colors duration-150 -mx-3 px-3"
                      >
                        <span className="shrink-0 text-[10px] text-(--ink-300) font-mono mt-0.5 w-5 tracking-widest pt-0.5">
                          {num}
                        </span>
                        <div className="flex flex-col gap-1 flex-1 min-w-0">
                          <div className="flex items-center gap-1.5">
                            <Icon
                              className="w-3.5 h-3.5 text-(--blue-500) shrink-0"
                              strokeWidth={1.5}
                            />
                            <span className="text-sm font-semibold text-(--ink-900) font-display tracking-[-0.01em]">
                              {label}
                            </span>
                          </div>
                          <p className="text-xs text-(--ink-400) font-body leading-relaxed">
                            {description}
                          </p>
                          <span
                            className="text-xs text-(--blue-600) group-hover:underline underline-offset-2 mt-1 truncate"
                            style={{ fontFamily: "var(--font-mono)" }}
                          >
                            {value}
                          </span>
                        </div>
                        <ArrowUpRight className="w-3.5 h-3.5 text-(--ink-300) group-hover:text-(--blue-500) shrink-0 transition-colors duration-150 mt-0.5" />
                      </a>
                    ),
                  )}
                </div>
              </RevealOnScroll>

              {/* What to expect — numbered steps */}
              <RevealOnScroll delay={100}>
                <div className="flex flex-col -mx-3 gap-4 p-5 bg-(--surface-base) border border-(--border-default)">
                  <span className="text-[10px] font-semibold text-(--ink-300) uppercase tracking-[0.08em] font-display">
                    What happens next
                  </span>
                  <div className="flex flex-col gap-3.5">
                    {NEXT_STEPS.map((step, i) => (
                      <div key={i} className="flex items-start gap-3">
                        <div className="w-5 h-5 rounded bg-(--blue-50) flex items-center justify-center shrink-0 mt-0.5">
                          <span className="text-[10px] font-semibold text-(--blue-600) font-mono">
                            {i + 1}
                          </span>
                        </div>
                        <p className="text-xs text-(--ink-500) font-body leading-relaxed">
                          {step}
                        </p>
                      </div>
                    ))}
                  </div>
                </div>
              </RevealOnScroll>
            </div>

            {/* Right — Form */}
            <RevealOnScroll delay={80} className="pb-4">
              <ContactForm />
            </RevealOnScroll>
          </div>
        </div>
      </section>

      <FAQSection />
      <CTASection />
    </>
  );
}
