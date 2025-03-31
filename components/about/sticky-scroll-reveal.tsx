"use client";
import React, { useRef, useState } from "react";
import { useMotionValueEvent, useScroll } from "framer-motion";
import { motion, AnimatePresence } from "framer-motion";
import { cn } from "@/lib/utils";

// Type definition for the items in the sticky scroll
export type StickyScrollItem = {
  id?: string;
  title: string;
  description: string;
  content?: React.ReactNode;
  color?:
    | "red"
    | "emerald"
    | "orange"
    | "purple"
    | "yellow"
    | "blue"
    | "cyan"
    | "magenta"
    | "pink"
    | "gray";
  badges?: string[];
};

// Component that implements a sticky scroll effect with fading content
// It allows for a list of items to be scrolled through, with the active item being highlighted
export const StickyScroll = ({
  content,
  contentClassName,
  renderItem,
}: {
  content: StickyScrollItem[];
  contentClassName?: string;
  renderItem?: (item: StickyScrollItem, isActive: boolean) => React.ReactNode;
}) => {
  const [activeCard, setActiveCard] = useState(0);
  const ref = useRef<HTMLDivElement>(null);
  const { scrollYProgress } = useScroll({
    target: ref,
    offset: ["start start", "end end"],
  });

  useMotionValueEvent(scrollYProgress, "change", (latest) => {
    const cardCount = content.length;
    // Adjusted the progress calculation to require more scrolling
    const adjustedProgress = Math.max(0, Math.min(1, latest * 1.05 - 0.025));
    const breakpoint = 1 / cardCount;
    const newActive = Math.min(
      content.length - 1,
      Math.max(0, Math.floor(adjustedProgress / breakpoint))
    );
    setActiveCard(newActive);
  });

  return (
    // Increased height from 300vh to 400vh for more scrolling space
    <div ref={ref} className="relative h-[600vh] 1xl:h-[500vh]">
      {/* Sticky container */}
      <div className="top-0 sticky flex justify-center items-center h-screen">
        <div className="gap-8 grid grid-cols-1 md:grid-cols-2 mx-auto px-4 container">
          {/* Left side - Scrolling items */}
          <div className="relative h-[70vh]">
            <motion.div
              animate={{ y: -activeCard * 100 + "%" }}
              transition={{ duration: 0.5, ease: "easeInOut" }}
              className="h-full"
            >
              {content.map((item, index) => (
                <div key={index} className="flex items-center h-full">
                  {renderItem ? (
                    renderItem(item, activeCard === index)
                  ) : (
                    <div>
                      <h2 className="font-bold text-3xl">{item.title}</h2>
                      <p className="text-muted-foreground">
                        {item.description}
                      </p>
                    </div>
                  )}
                </div>
              ))}
            </motion.div>
          </div>

          {/* Right side - Fading content */}
          <div className={cn("h-[70vh] relative", contentClassName)}>
            <AnimatePresence mode="wait">
              <motion.div
                key={activeCard}
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                transition={{ duration: 0.5, ease: "easeInOut" }}
                className="flex justify-center items-center h-full"
              >
                {content[activeCard]?.content}
              </motion.div>
            </AnimatePresence>
          </div>
        </div>
      </div>
    </div>
  );
};
