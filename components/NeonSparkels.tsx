"use client";
import { featureColorToHex } from "@/lib/colors";
import React from "react";
import { SparklesCore } from "./ui/sparkles";

type NeonColorType = keyof typeof featureColorToHex;

interface NeonSparkelsProps {
  className?: string;
  particleColor?: string;
  neonColor?: NeonColorType;
  neonClassName?: string;
}

// This component provides a neon sparkles effect with customizable colors and sizes
// It uses the SparklesCore component to create the sparkles effect
export function NeonSparkels({
  className,
  particleColor,
  neonColor = "emerald",
  neonClassName,
}: NeonSparkelsProps) {
  const colorClass = `via-${neonColor}-500`; // Convert simple color to Tailwind class
  const defaultParticleColor = featureColorToHex[neonColor];

  return (
    <div
      className={`flex flex-col justify-center items-center rounded-md w-full overflow-hidden ${className}`}
    >
      <div
        className={`relative flex justify-center items-center w-[80rem] h-40 ${neonClassName}`}
      >
        {/* Gradients */}
        <div
          className={`bottom-0 absolute bg-gradient-to-r from-transparent ${colorClass} to-transparent blur-sm w-3/4 h-[2px]`}
        />
        <div
          className={`bottom-0 absolute bg-gradient-to-r from-transparent ${colorClass} to-transparent w-3/4 h-px`}
        />
        <div
          className={`bottom-0 absolute bg-gradient-to-r from-transparent ${colorClass} to-transparent blur-xl w-[70%] h-[20px]`}
        />
        <div
          className={`bottom-0 absolute bg-gradient-to-r from-transparent ${colorClass} to-transparent w-1/3 h-px`}
        />

        <div
          className={`bottom-0 absolute bg-gradient-to-r from-transparent ${colorClass} to-transparent blur-md w-1/2 h-[5px]`}
        />

        {/* Core component */}
        <SparklesCore
          background="transparent"
          minSize={0.7}
          maxSize={2.5}
          particleDensity={40}
          className="mx-auto w-20 h-full"
          particleColor={particleColor || defaultParticleColor}
        />
      </div>
    </div>
  );
}
