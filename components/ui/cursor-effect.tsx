"use client";
import { useState, useEffect } from "react";
import { motion } from "motion/react";

// Custom cursor component that follows mouse and expands on hover
export const Cursor = () => {
  const [mousePosition, setMousePosition] = useState({ x: 0, y: 0 });
  const [isHoveringMask, setIsHoveringMask] = useState(false);
  const size = 20;

  useEffect(() => {
    const updateMousePosition = (e: MouseEvent) => {
      setMousePosition({ x: e.clientX, y: e.clientY });

      // Check if we're over a mask container
      const targetElement = e.target as Element;
      const isOverMask =
        targetElement.closest('[data-mask-container="true"]') !== null;
      setIsHoveringMask(isOverMask);
    };

    document.addEventListener("mousemove", updateMousePosition);
    return () => document.removeEventListener("mousemove", updateMousePosition);
  }, []);

  return (
    <motion.div className="top-0 left-0 z-50 fixed w-full h-full pointer-events-none">
      <motion.div
        className="fixed bg-white rounded-full pointer-events-none"
        animate={{
          width: size,
          height: size,
          x: mousePosition.x - size / 2,
          y: mousePosition.y - size / 2,
          opacity: isHoveringMask ? 0 : 1, // Hide cursor when over mask container
        }}
        transition={{ type: "tween", duration: 0.2, ease: "backOut" }}
      />
    </motion.div>
  );
};
