import {
  HeroSection,
  FeaturesSection,
  TestimonialsSection,
  AnalyticsInsightsSection,
  SeenOnSection,
  FAQSection,
} from "@/components/homepage";
import MovingTextSection from "@/components/homepage/MovingTextSection";

export default function HomePage() {
  return (
    <main className="">
      <HeroSection />
      <SeenOnSection />
      <FeaturesSection />

      <AnalyticsInsightsSection />

      <MovingTextSection />

      <TestimonialsSection />
      <FAQSection />
    </main>
  );
}
