import { AboutSection } from "@/components/about/AboutSection";
import { CTASection } from "@/components/cta/CtaSection";
import { FeaturesSection } from "@/components/features/FeaturesSection";
import { Footer } from "@/components/Footer";
import { Header } from "@/components/Header";
import { HeroSection } from "@/components/hero/HeroSection";
import { TestimonialsSection } from "@/components/testimonials/TestimonialSection";
import { ReactLenis } from "@/utils/lenis";

export default function LandingPage() {
  return (
    <ReactLenis root>
      <div className="flex flex-col min-h-screen">
        <main className="flex-1">
          <Header />
          <div className="bg-gradient-to-t from-neutral-950 to-background">
            <HeroSection />
          </div>
          <div className="bg-gradient-to-b from-neutral-950 to-background">
            <AboutSection />
          </div>
          <FeaturesSection />
          <TestimonialsSection />
          <CTASection />
        </main>
        <Footer />
      </div>
    </ReactLenis>
  );
}
