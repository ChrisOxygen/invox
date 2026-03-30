import { Button } from "@/shared/components/ui/button";
import Image from "next/image";
import Link from "next/link";
import { RevealOnScroll } from "../RevealOnScroll";

export default function HeroSection() {
  const stats = [
    { val: "₦2.4B+", label: "processed" },
    { val: "12K+", label: "invoices created" },
    { val: "4.9★", label: "avg rating" },
  ];

  return (
    <section className="min-h-screen relative overflow-hidden flex flex-col m-3 rounded-xl bg-[#F3F0FF]">
      {/* Cloud background image */}
      <Image
        src="/assets/cloud-bg-hero.png"
        alt=""
        fill
        className="object-cover object-center"
        priority
        aria-hidden
      />

      {/* Subtle overlay to keep text readable */}
      <div className="absolute inset-0 bg-white/20" />

      <div className="relative z-10 flex flex-col items-center flex-1 pt-36 pb-0 px-5">
        {/* Eyebrow */}
        <RevealOnScroll className="flex justify-center mb-8">
          <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-white/70 backdrop-blur-sm border border-white/80 text-(--ink-500) text-xs font-semibold tracking-wider uppercase font-display shadow-sm">
            <span className="w-1.5 h-1.5 rounded-full bg-(--blue-500) animate-pulse" />
            Early access · 100% free right now
          </div>
        </RevealOnScroll>

        {/* Heading */}
        <RevealOnScroll
          className="text-center max-w-3xl mx-auto mb-6"
          delay={100}
        >
          <h1 className="font-display font-bold text-4xl sm:text-5xl lg:text-[50px] leading-[1.07] tracking-[-0.04em] text-(--ink-900)">
            The smarter way to invoice,{" "}
            <span className="text-(--blue-600) italic">track,</span>
            <br className="hidden sm:block" />
            and get paid.
          </h1>
        </RevealOnScroll>

        {/* Body */}
        <RevealOnScroll
          className="text-center max-w-xl mx-auto mb-10"
          delay={200}
        >
          <p className="text-base text-(--ink-400) leading-relaxed font-body">
            Create polished invoices in seconds, automate follow-ups, and track
            every payment — all in one clean workspace. Free during early access. No card, no catch.
          </p>
        </RevealOnScroll>

        {/* CTAs */}
        <RevealOnScroll
          className="flex flex-col sm:flex-row gap-3 items-center justify-center mb-12"
          delay={300}
        >
          <Button
            render={<Link href="/signup" />}
            nativeButton={false}
            className="bg-(--blue-600) hover:bg-(--blue-700) text-white font-semibold px-8 py-6 rounded text-base shadow-none border-none transition-colors duration-100 ease-linear font-display"
          >
            Get free access →
          </Button>
        </RevealOnScroll>

        {/* Stats row */}
        <RevealOnScroll
          className="flex flex-wrap gap-8 items-center justify-center mb-16"
          delay={400}
        >
          {stats.map((stat, i) => (
            <div key={i} className="flex items-center gap-2.5">
              <span
                className="text-sm font-semibold text-(--ink-900)"
                style={{ fontFamily: "var(--font-mono)" }}
              >
                {stat.val}
              </span>
              <span className="text-xs text-(--ink-400) font-body">
                {stat.label}
              </span>
              {i < stats.length - 1 && (
                <span className="ml-2 hidden sm:block w-px h-3.5 bg-(--ink-200)" />
              )}
            </div>
          ))}
        </RevealOnScroll>

        {/* Dashboard preview */}
        <RevealOnScroll
          className="w-full max-w-5xl -mb-16 sm:-mb-44 lg:-mb-96"
          delay={500}
        >
          {/* Stacked card depth layers */}
          <div className="relative pt-8">
            {/* Layer 3 — furthest back, narrowest, most transparent */}
            <div className="absolute top-0 left-8 right-8 bottom-0 rounded-t-2xl bg-white/25" />
            {/* Layer 2 — middle */}
            <div className="absolute top-4 left-4 right-4 bottom-0 rounded-t-2xl bg-white/45" />
            {/* Main card */}
            <div className="relative rounded-t-2xl bg-white p-3 shadow-[0_32px_80px_rgba(74,94,235,0.20),0_8px_32px_rgba(0,0,0,0.10)]">
              <div className="rounded-xl overflow-hidden border border-(--border-default)">
                <Image
                  src="/assets/dashboard-view.png"
                  alt="Invox Dashboard Preview"
                  width={2000}
                  height={1200}
                  className="w-full object-cover object-top"
                  priority
                />
              </div>
            </div>
          </div>
        </RevealOnScroll>
      </div>
    </section>
  );
}
