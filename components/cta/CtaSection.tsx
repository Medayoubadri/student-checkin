import Link from "next/link";

import { Button } from "@/components/ui/button";
import { Particles } from "../magicui/particles";
import { TextAnimate } from "../magicui/text-animate";
import { AnimatedComponent } from "@/lib/framer-animations";

// This component is responsible for rendering the Call to Action (CTA) section of the page
export function CTASection() {
  return (
    <section id="contact" className="py-12 md:py-24 lg:py-32 w-full">
      <div className="mx-auto px-4 md:px-6 container">
        <div className="relative flex flex-col justify-center items-center bg-background/20 px-0 py-12 lg:py-20 border border-foreground/20 rounded-2xl lg:rounded-3xl w-full overflow-hidden text-center">
          <Particles
            refresh
            ease={80}
            quantity={80}
            color="#d4d4d4"
            className="hidden lg:block z-0 absolute inset-0"
          />
          <Particles
            refresh
            ease={80}
            quantity={35}
            color="#d4d4d4"
            className="lg:hidden block z-0 absolute inset-0"
          />

          <div className="-top-44 right-1/2 z-50 absolute bg-emerald-400 blur-3xl p-8 rounded-sm w-[45rem] h-52 translate-x-1/2 animate-pulse-logo" />
          <TextAnimate
            animation="blurIn"
            by="word"
            once
            delay={0.3}
            duration={1}
            as="h2"
            segmentClassName="inline-block"
            className="mt-2 max-w-2xl font-bold text-zinc-900 dark:text-slate-100 text-3xl sm:text-5xl text-clip leading-snug tracking-tight"
          >
            Ready to Streamline Your Attendance
          </TextAnimate>
          <AnimatedComponent animation="slideDown" delay={0.3}>
            <p className="mt-6 text-muted-foreground text-lg">
              Join educators who are saving time and gaining insights with our
              system.
            </p>
          </AnimatedComponent>
          <Link href="/auth/signin" className="mt-8">
            <Button size="lg">Let&apos;s get started</Button>
          </Link>
        </div>
      </div>
    </section>
  );
}
