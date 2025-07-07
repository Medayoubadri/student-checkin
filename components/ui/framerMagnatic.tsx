"use client";

import { motion } from "framer-motion";
import { useRef, useState } from "react";

export default function FramerMagnatic({
  children,
}: {
  children: React.ReactNode;
}) {
  const ref = useRef<HTMLDivElement>(null);
  const [position, setPortion] = useState({ x: 0, y: 0 });

  const mouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    const { clientX, clientY } = e;
    const { width, height, left, top } = ref.current!.getBoundingClientRect();
    const x = clientX - (left + width / 2);
    const y = clientY - (top + height / 2);
    setPortion({ x, y });
  };

  const mouseLeave = () => {
    setPortion({ x: 0, y: 0 });
  };

  const { x, y } = position;

  return (
    <motion.div
      onMouseMove={mouseMove}
      onMouseLeave={mouseLeave}
      ref={ref}
      animate={{ x, y }}
      transition={{
        type: "spring",
        stiffness: 500,
        damping: 10,
        ease: "easeOut",
      }}
    >
      {children}
    </motion.div>
  );
}
