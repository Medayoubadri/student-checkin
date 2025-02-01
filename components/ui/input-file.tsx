import * as React from "react";
import { cn } from "@/lib/utils";

export type InputProps = React.InputHTMLAttributes<HTMLInputElement>;

const InputFile = React.forwardRef<
  HTMLInputElement,
  React.ComponentProps<"input">
>(({ className, type, ...props }, ref) => {
  return (
    <input
      type={type}
      aria-label="input"
      className={cn(
        "flex h-10 w-full rounded-md border border-input bg-background text-sm ring-offset-background file:mr-4 file:border-0 dark:file:bg-zinc-800 file:bg-slate-400 file:text-sm file:h-full file:px-4 cursor-pointer dark:file:hover:bg-zinc-900 file:cursor-pointer file:pointer-events-auto file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50",
        className
      )}
      ref={ref}
      {...props}
    />
  );
});
InputFile.displayName = "InputFile";

export { InputFile };
