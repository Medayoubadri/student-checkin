import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";

// Merges Tailwind CSS classes using clsx and tailwind-merge for optimal class handling
export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}
