"use client";

import type React from "react";

import { motion, type MotionProps } from "framer-motion";

// Reusable animation component that provides common animation variants using Framer Motion
type AnimatedComponentProps = {
  children: React.ReactNode;
  animation?:
    | "fadeIn"
    | "slideUp"
    | "slideDown"
    | "slideLeft"
    | "slideRight"
    | "blurIn";
  duration?: number;
  delay?: number;
  className?: string;
  ref?: React.Ref<HTMLDivElement>;
} & MotionProps;

// Pre-defined animation variants for common use cases
const animations = {
  fadeIn: {
    initial: { opacity: 0 },
    animate: { opacity: 1 },
  },
  slideUp: {
    initial: { opacity: 0, y: 50 },
    animate: { opacity: 1, y: 0 },
  },
  slideDown: {
    initial: { opacity: 0, y: -50 },
    animate: { opacity: 1, y: 0 },
  },
  slideLeft: {
    initial: { opacity: 0, x: 50 },
    animate: { opacity: 1, x: 0 },
  },
  slideRight: {
    initial: { opacity: 0, x: -50 },
    animate: { opacity: 1, x: 0 },
  },
  blurIn: {
    initial: { opacity: 0, filter: "blur(8px)" },
    animate: { opacity: 1, filter: "blur(0px)" },
  },
};

// Component that wraps children with configurable animations using Framer Motion
export function AnimatedComponent({
  children,
  animation = "fadeIn",
  duration = 0.7,
  delay = 0,
  className,
  ...props
}: AnimatedComponentProps) {
  return (
    <motion.div
      className={className}
      initial={animations[animation].initial}
      animate={animations[animation].animate}
      transition={{ duration, delay }}
      {...props}
    >
      {children}
    </motion.div>
  );
}
