import { AnimatedComponent } from "@/lib/framer-animations";
import SectionBadge from "../ui/section-badge";
import { TextAnimate } from "../magicui/text-animate";
import { FeaturesBentoGrid } from "./BentoGrid";

// This component is responsible for rendering the "Features" section of the page
export function FeaturesSection() {
  return (
    <section id="features" className="py-12 md:py-24 w-full">
      <div className="mx-auto px-4 md:px-6 container">
        <div className="mx-auto mb-20 px-6 lg:px-8">
          <div className="flex flex-col items-center mx-auto max-w-2xl lg:text-center">
            <AnimatedComponent className="mb-6" animation="fadeIn" delay={0}>
              <SectionBadge className="bg-primary/20 mb-5 px-4">
                <span className="text-xs">Features</span>
              </SectionBadge>
            </AnimatedComponent>

            <TextAnimate
              animation="blurIn"
              by="word"
              delay={0.3}
              duration={1}
              as="h2"
              segmentClassName="inline-block"
              className="mt-2 font-bold text-zinc-900 dark:text-slate-100 text-3xl sm:text-5xl text-clip tracking-tight"
            >
              Features that Matter
            </TextAnimate>
            <AnimatedComponent animation="slideDown" delay={0.3}>
              <p className="mt-6 text-muted-foreground text-lg">
                Effective features that simplify attendance tracking, tools that
                work flawlessly and won’t bore you to tears.
              </p>
            </AnimatedComponent>
          </div>
        </div>
        <div className="items-center gap-6 mx-auto">
          <AnimatedComponent animation="blurIn" delay={0.5}>
            <FeaturesBentoGrid />
          </AnimatedComponent>
        </div>
      </div>
    </section>
  );
}
