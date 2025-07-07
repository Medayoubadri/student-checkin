"use client";

import SectionBadge from "@/components/ui/section-badge";
import { StickyScroll } from "./sticky-scroll-reveal";
import { AnimatedComponent } from "@/lib/framer-animations";
import { motion } from "framer-motion";
import { sections } from "./AboutContent";
import { aboutSectionIcons } from "./AboutSectionIcons";
import { TextAnimate } from "@/components/magicui/text-animate";
import FramerMagnatic from "@/components/ui/framerMagnatic";
import { Button } from "@/components/ui/button";
import { PlayCircle, X } from "lucide-react";
import { useState } from "react";
import { Dialog, DialogContent, DialogClose } from "@/components/ui/dialog";

// This component is responsible for rendering the "About" section of the page
export function AboutSection() {
  const [isVideoOpen, setIsVideoOpen] = useState(false);

  return (
    <section id="about">
      <div className="py-16">
        <div className="mx-auto px-6 lg:px-8 max-w-7xl">
          <div className="flex flex-col items-center mx-auto max-w-2xl lg:text-center">
            <AnimatedComponent animation="fadeIn" delay={0}>
              <SectionBadge className="bg-primary/20 mb-5 px-4">
                <span className="text-xs">About</span>
              </SectionBadge>
            </AnimatedComponent>

            <TextAnimate
              animation="blurIn"
              by="word"
              once
              delay={0.3}
              duration={1}
              as="h2"
              segmentClassName="inline-block"
              className="mt-2 font-bold text-zinc-900 dark:text-slate-100 text-3xl sm:text-5xl text-clip tracking-tight"
            >
              About this Project
            </TextAnimate>
            <AnimatedComponent animation="slideDown" delay={0.3}>
              <p className="mt-6 text-muted-foreground text-lg">
                A modern, no-nonsense approach to attendance tracking, built
                with code, fueled by caffeine, and slightly over-engineered
                (because why not?).
              </p>
            </AnimatedComponent>
            <AnimatedComponent
              animation="slideDown"
              delay={0.4}
              className="mt-4"
            >
              <Button
                variant="default"
                size="lg"
                onClick={() => setIsVideoOpen(true)}
              >
                <PlayCircle className="mr-2 w-4 h-4" />
                Watch Video
              </Button>
            </AnimatedComponent>
          </div>
        </div>
      </div>

      {/* Video Popup Dialog */}
      <Dialog open={isVideoOpen} onOpenChange={setIsVideoOpen}>
        <DialogContent className="flex flex-col p-0 outline sm:max-w-[80vw] h-auto overflow-hidden">
          <div className="relative flex flex-col w-full h-full">
            <DialogClose className="top-2 right-2 z-10 absolute bg-background/80 hover:bg-background p-1 rounded-full">
              <X className="w-5 h-5" />
            </DialogClose>
            <div className="w-full h-[80vh] overflow-hidden">
              <iframe
                src="https://www.loom.com/embed/6f28bf21c28049289cc626f8f0ac9276?sid=a4d0d2cc-e0a2-400e-a0ea-367e2647ad86"
                style={{
                  width: "100%",
                  height: "100%",
                  border: "none",
                  borderRadius: "0.5rem",
                }}
                frameBorder="0"
                allowFullScreen
                className="rounded-lg"
              ></iframe>
            </div>
          </div>
        </DialogContent>
      </Dialog>

      <div className="relative">
        <AnimatedComponent animation="blurIn" delay={0.5}>
          <StickyScroll
            content={sections}
            contentClassName="space-x-4"
            renderItem={(item, isActive) => (
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: isActive ? 1 : 0.3, y: isActive ? 0 : 20 }}
                transition={{ duration: 0.5 }}
                className="relative"
              >
                {isActive && (
                  <>
                    {aboutSectionIcons[
                      item.id as keyof typeof aboutSectionIcons
                    ]?.map((icon, index) => (
                      <motion.div
                        key={index}
                        className={`absolute ${icon.position}`}
                        animate={{
                          y: [0, 5, 0],
                        }}
                        transition={{
                          duration: 4,
                          repeat: Number.POSITIVE_INFINITY,
                          delay: index * 0.5,
                          ease: "easeInOut",
                        }}
                      >
                        <FramerMagnatic>
                          <icon.Icon
                            className={`opacity-20 w-12 md:w-16 h-12 md:h-16 text-${item.color}-500`}
                          />
                        </FramerMagnatic>
                      </motion.div>
                    )) || null}
                  </>
                )}
                <div className="z-10">
                  <div
                    className={`font-bold text-${item.color}-500 text-3xl mb-2`}
                  >
                    {item.title}
                  </div>
                  <p className="mt-4 max-w-lg text-muted-foreground text-xl">
                    {item.description}
                  </p>
                </div>
              </motion.div>
            )}
          />
        </AnimatedComponent>
      </div>
    </section>
  );
}
