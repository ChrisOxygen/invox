import {
  HeroSection,
  FeaturesSection,
  TestimonialsSection,
  AnalyticsInsightsSection,
  SeenOnSection,
  FAQSection,
} from "@/components/homepage";
import CTASection from "@/components/homepage/CTASection";
import MovingTextSection from "@/components/homepage/MovingTextSection";

export default function HomePage() {
  return (
    <>
      <HeroSection />
      <SeenOnSection />
      <FeaturesSection />

      <AnalyticsInsightsSection />

      <MovingTextSection />

      <TestimonialsSection />
      <FAQSection />
      <CTASection />
    </>
  );
}
