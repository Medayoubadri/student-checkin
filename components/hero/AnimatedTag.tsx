"use client";

import { cn } from "@/lib/utils";
import { AnimatedShinyText } from "@/components/magicui/animated-shiny-text";

// This component is responsible for rendering an animated tag with a shiny text effect
export function AnimatedTag() {
  return (
    <div className="z-10 flex justify-center items-center">
      <div
        className={cn(
          "group rounded-full border border-black/5 bg-white text-sm text-white transition-all ease-in cursor-default hover:bg-neutral-200 dark:border-white/5 dark:bg-background dark:hover:bg-neutral-800 duration-500"
        )}
      >
        <AnimatedShinyText className="inline-flex justify-center items-center px-4 py-1 hover:dark:text-neutral-400 hover:text-neutral-600 transition hover:duration-300 ease-out">
          <span>✨ Track. Analyze. Manage.</span>
        </AnimatedShinyText>
      </div>
    </div>
  );
}
