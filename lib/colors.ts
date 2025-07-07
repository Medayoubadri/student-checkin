// This file defines color constants and utility functions.
export const featureColorToHex = {
  emerald: "#2ECC71",
  orange: "#FF5733",
  purple: "#9B59B6",
  yellow: "#F1C40F",
  blue: "#3498DB",
  red: "#E74C3C",
  cyan: "#00BCD4",
  magenta: "#FF00FF",
  pink: "#FF69B4",
  gray: "#95A5A6",
} as const;

export type AboutColors =
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

export type FeatureColorHex =
  (typeof featureColorToHex)[keyof typeof featureColorToHex];

// Helper function to get CSS variable or hex color
export const getFeatureColor = (color: keyof typeof featureColorToHex) => {
  return `var(--${color}-500, ${featureColorToHex[color]})`;
};
