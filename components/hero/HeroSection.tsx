"use client";

import Image from "next/image";
import { Particles } from "../magicui/particles";
import { useEffect, useRef, useState } from "react";
import { AnimatedComponent } from "@/lib/framer-animations";
import { AnimatedTag } from "./AnimatedTag";
import { BorderBeam } from "../magicui/border-beam";
import { useTheme } from "next-themes";
import { NeonSparkels } from "../NeonSparkels";
import { Button } from "../ui/button";
import Link from "next/link";
import { ArrowRight, Github } from "lucide-react";

// This component is responsible for rendering the hero section of the page
export function HeroSection() {
  const [color] = useState("#ffffff");
  const { theme } = useTheme();
  const themes = theme === "dark" ? "dark" : "light";
  const imageRef = useRef<HTMLImageElement>(null);

  // This effect handles the scroll animation for the hero image
  // It applies a perspective and rotation effect based on the scroll position
  useEffect(() => {
    const imageElement = imageRef.current;
    if (!imageElement) return;

    const handleScroll = () => {
      const scrollPosition = window.scrollY;
      const maxAnimationScroll = 300; // Animation stops after 300px of scrolling

      // Limit the scroll position for animation calculations
      const animationProgress = Math.min(scrollPosition, maxAnimationScroll);

      // Reverse the calculations - start with perspective and go to flat
      // At scroll 0: perspective is low (more dramatic) and rotation is high
      // At maxAnimationScroll: perspective is high (less dramatic) and rotation is 0
      const perspective = 800 + (animationProgress / maxAnimationScroll) * 200; // Start at 800, go to 1000
      const rotateX = Math.max(
        15 - (animationProgress / maxAnimationScroll) * 15,
        0
      ); // Start at 15deg, go to 0deg

      // Apply the transformation
      imageElement.style.transform = `perspective(${perspective}px) rotateX(${rotateX}deg)`;
    };

    // Call once to set initial position
    handleScroll();

    window.addEventListener("scroll", handleScroll);
    return () => {
      window.removeEventListener("scroll", handleScroll);
    };
  }, []);

  return (
    <section className="flex items-center mt-32">
      <div className="z-10 relative w-full">
        <div className="relative mx-auto max-w-6xl text-center">
          <AnimatedComponent animation="slideDown" delay={0.2}>
            <AnimatedTag />
          </AnimatedComponent>

          <AnimatedComponent animation="slideUp" delay={0.4}>
            <div className="top-0 md:top-0 left-1/2 -z-10 absolute bg-primary opacity-10 blur-[60px] md:blur-[90px] rounded-[100%] w-full h-[200px] md:h-[400px] -translate-x-1/2 -translate-y-1/2 pointer-events-none" />
            <h1 className="bg-clip-text bg-gradient-to-br from-primary via-primary to-sky-500 mt-10 font-bold text-transparent text-4xl sm:text-5xl md:text-6xl tracking-tight">
              Check your attendance Game
            </h1>
          </AnimatedComponent>

          <AnimatedComponent
            className="mx-auto w-full max-w-[600px]"
            animation="slideUp"
            delay={0.6}
          >
            <p className="mt-6 text-gray-500 dark:text-gray-400 text-xl">
              Streamline classroom attendance with a modern, real-time check-in
              solution designed for educators.
            </p>
          </AnimatedComponent>

          <AnimatedComponent
            className="flex justify-center mx-auto mt-6 w-full"
            animation="slideUp"
            delay={0.6}
          >
            <div className="flex min-[400px]:flex-row flex-col gap-2">
              <Button size="lg" asChild>
                <Link href="/Home">
                  Try It Now
                  <ArrowRight className="ml-2 w-4 h-4" />
                </Link>
              </Button>
              <Button variant="outline" size="lg" asChild>
                <Link
                  href="https://github.com/medayoubadri/student-checkin"
                  target="_blank"
                >
                  <Github className="mr-2 w-4 h-4" />
                  View on GitHub
                </Link>
              </Button>
            </div>
          </AnimatedComponent>

          <AnimatedComponent
            animation="fadeIn"
            duration={3}
            delay={0.9}
            className="relative flex justify-center items-center bg-transparent mt-32 hero-image-wrapper"
          >
            <div
              ref={imageRef}
              className="after:z-2 after:absolute relative after:inset-0 after:self-end after:bg-[linear-gradient(to_top,_#0a0a0a_20%,_transparent)] backdrop-blur-3xl lg:-m-4 rounded-xl lg:rounded-xl after:rounded-none ring-2 ring-foreground/10 ring-inset after:h-[calc(100%-300px)] hero-image"
            >
              <NeonSparkels
                className="-top-40 left-1/2 z-10 absolute -translate-x-1/2"
                neonColor="emerald"
              />
              <div className="relative p-2 rounded-xl overflow-hidden">
                <BorderBeam
                  size={300}
                  duration={12}
                  delay={9}
                  colorFrom="#20B256"
                  colorTo="#00000000"
                />
                <Image
                  src={
                    themes === "light"
                      ? "/assets/dashboard-dark.svg"
                      : "/assets/dashboard-light.svg"
                  }
                  alt="Dashboard"
                  width={1000}
                  height={600}
                  quality={100}
                  className="rounded-md md:rounded-xl h-[500px] object-cover object-top"
                />
              </div>
            </div>
          </AnimatedComponent>
        </div>
      </div>
      <Particles
        className="z-0 absolute inset-0 size-full"
        quantity={50}
        ease={80}
        color={color}
        refresh
      />
    </section>
  );
}
