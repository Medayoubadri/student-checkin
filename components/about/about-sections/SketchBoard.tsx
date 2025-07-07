"use client";

import { useTheme } from "next-themes";
import { useEffect, useState } from "react";
import { cn } from "@/lib/utils";
import { GridPattern } from "@/components/magicui/grid-pattern";

// This component creates a sketch board
export default function SketchBoard() {
  const { theme } = useTheme();
  const [mounted, setMounted] = useState(false);
  const [isHovering, setIsHovering] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  if (!mounted) return null;

  return (
    <div
      className="group relative border rounded-xl w-full max-w-xl h-[500px] overflow-hidden cursor-pointer"
      onMouseEnter={() => setIsHovering(true)}
      onMouseLeave={() => setIsHovering(false)}
    >
      {/* Whiteboard background */}
      <GridPattern
        width={40}
        height={40}
        x={-1}
        y={-1}
        className={cn(
          "[mask-image:radial-gradient(280px_circle_at_center,white,transparent)]"
        )}
      />

      {/* "The Plan" section - simple flowchart */}
      <div
        className={`
        absolute top-5 left-6 px-3 py-1 
        bg-blue-100 dark:bg-blue-900/30 text-blue-800 dark:text-blue-300 
        rounded-md border-2 border-blue-300 dark:border-blue-700 
        font-bold text-xs rotate-[-8deg]
        transition-all duration-500 ease-in-out
        ${isHovering ? "opacity-0 translate-y-[-20px]" : "opacity-100"}
      `}
      >
        THE PLAN (v1)
      </div>

      <div
        className={`
        absolute top-16 left-10 flex flex-col items-center
        transition-all duration-500 ease-in-out
        ${isHovering ? "opacity-0 translate-y-[-20px]" : "opacity-100"}
      `}
      >
        {/* Simple flowchart */}
        <div className="flex flex-col items-center">
          <div className="bg-green-100 dark:bg-green-900/30 px-3 py-2 border-2 border-green-300 dark:border-green-700 rounded-md font-medium text-green-800 dark:text-green-300 text-xs">
            Student Arrives
          </div>
          <div className="bg-slate-400 dark:bg-slate-600 my-1 w-0.5 h-8"></div>
          <div className="bg-purple-100 dark:bg-purple-900/30 px-3 py-2 border-2 border-purple-300 dark:border-purple-700 rounded-md font-medium text-purple-800 dark:text-purple-300 text-xs">
            Scan ID
          </div>
          <div className="bg-slate-400 dark:bg-slate-600 my-1 w-0.5 h-8"></div>
          <div className="bg-amber-100 dark:bg-amber-900/30 px-3 py-2 border-2 border-amber-300 dark:border-amber-700 rounded-md font-medium text-amber-800 dark:text-amber-300 text-xs">
            Mark Attendance
          </div>
        </div>
      </div>

      {/* Big red X over the simple plan */}
      <div
        className={`
        absolute top-12 left-6 w-52 h-auto
        transition-all duration-500 ease-in-out
        ${isHovering ? "opacity-0" : "opacity-100"}
      `}
      >
        <div className="top-20 -left-20 absolute flex justify-center items-center w-full h-full">
          <div className="bg-red-500 dark:bg-red-600 w-full h-1 rotate-45 origin-center translate-x-28 transform"></div>
          <div className="bg-red-500 dark:bg-red-600 w-full h-1 -rotate-45 origin-center transform"></div>
        </div>
      </div>

      {/* "The Reality" section - complex flowchart */}
      <div
        className={`
        absolute top-5 right-4 px-3 py-1 
        bg-red-100 dark:bg-red-900/30 text-red-800 dark:text-red-300 
        rounded-md border-2 border-red-300 dark:border-red-700 
        font-bold text-xs rotate-[8deg]
        transition-all duration-500 ease-in-out
        ${isHovering ? "opacity-0 translate-y-[-20px]" : "opacity-100"}
      `}
      >
        THE REALITY (v69)
      </div>

      {/* "The Solution" title - appears on hover */}
      <div
        className={`
        absolute top-5 left-1/2 transform -translate-x-1/2 px-4 py-1.5
        bg-emerald-100 dark:bg-emerald-900/30 text-emerald-800 dark:text-emerald-300
        rounded-md border-2 border-emerald-300 dark:border-emerald-700
        font-bold text-lg
        transition-all duration-500 ease-in-out
        ${
          isHovering
            ? "opacity-100 translate-y-0"
            : "opacity-0 translate-y-[-20px]"
        }
      `}
      >
        THE SOLUTION
      </div>

      {/* Complex flowchart - chaotic version */}
      <div
        className={`transition-opacity duration-500 ease-in-out ${
          isHovering ? "opacity-0" : "opacity-100"
        }`}
      >
        <div className="top-16 right-[40%] absolute w-[80%] h-[80%] translate-x-1/2 transform">
          {/* Main nodes */}
          <div className="top-0 left-1/2 absolute bg-green-100 dark:bg-green-900/30 px-3 py-2 border-2 border-green-300 dark:border-green-700 rounded-md font-medium text-green-800 dark:text-green-300 text-xs -translate-x-1/2 transform">
            Student Arrives
          </div>

          <div className="top-16 right-1/4 absolute bg-red-100 dark:bg-red-900/30 px-3 py-2 border-2 border-red-300 dark:border-red-700 rounded-md font-medium text-red-800 dark:text-red-300 text-xs translate-x-1/2 transform">
            Scan ID
          </div>

          <div className="top-16 left-1/4 absolute bg-purple-100 dark:bg-purple-900/30 px-3 py-2 border-2 border-purple-300 dark:border-purple-700 rounded-md font-medium text-purple-800 dark:text-purple-300 text-xs -translate-x-1/2 transform">
            Manual Entry
          </div>

          <div className="top-36 left-1/2 absolute bg-blue-100 dark:bg-blue-900/30 px-3 py-2 border-2 border-blue-300 dark:border-blue-700 rounded-md font-medium text-blue-800 dark:text-blue-300 text-xs -translate-x-1/2 transform">
            Database Available?
          </div>

          <div className="top-48 right-[10%] absolute bg-red-100 dark:bg-red-900/30 px-3 py-2 border-2 border-red-300 dark:border-red-700 rounded-md font-medium text-red-800 dark:text-red-300 text-xs rotate-[1deg] translate-x-1/2 transform">
            PANIC MODE
          </div>

          <div className="top-64 left-1/2 absolute bg-amber-100 dark:bg-amber-900/30 px-3 py-2 border-2 border-amber-300 dark:border-amber-700 rounded-md font-medium text-amber-800 dark:text-amber-300 text-xs -translate-x-1/2 transform">
            Mark Attendance
          </div>

          <div className="top-80 left-1/4 absolute bg-emerald-100 dark:bg-emerald-900/30 px-3 py-2 border-2 border-emerald-300 dark:border-emerald-700 rounded-md font-medium text-emerald-800 dark:text-emerald-300 text-xs -translate-x-1/2 transform">
            Generate Report
          </div>

          <div className="top-80 right-1/4 absolute bg-indigo-100 dark:bg-indigo-900/30 px-3 py-2 border-2 border-indigo-300 dark:border-indigo-700 rounded-md font-medium text-indigo-800 dark:text-indigo-300 text-xs translate-x-1/2 transform">
            Notify Teachers
          </div>

          <div className="-bottom-4 left-1/2 absolute bg-pink-100 dark:bg-pink-900/30 px-3 py-2 border-2 border-pink-300 dark:border-pink-700 rounded-md font-medium text-pink-800 dark:text-pink-300 text-xs rotate-[-1deg] -translate-x-1/2 transform">
            Existential Crisis
          </div>

          {/* Connection lines */}
          <svg
            className="top-0 left-0 absolute w-full h-full"
            xmlns="http://www.w3.org/2000/svg"
          >
            <line
              x1="50%"
              y1="40"
              x2="25%"
              y2="62"
              stroke={theme === "dark" ? "#6b7280" : "#4b5563"}
              strokeWidth="2"
              strokeDasharray="5,5"
            />
            <line
              x1="50%"
              y1="40"
              x2="75%"
              y2="62"
              stroke={theme === "dark" ? "#6b7280" : "#4b5563"}
              strokeWidth="2"
              strokeDasharray="5,5"
            />
            <line
              x1="25%"
              y1="103"
              x2="40%"
              y2="143"
              stroke={theme === "dark" ? "#6b7280" : "#4b5563"}
              strokeWidth="2"
            />
            <line
              x1="75%"
              y1="103"
              x2="60%"
              y2="145"
              stroke={theme === "dark" ? "#6b7280" : "#4b5563"}
              strokeWidth="2"
            />
            <line
              x1="50%"
              y1="255"
              x2="50%"
              y2="183"
              stroke={theme === "dark" ? "#6b7280" : "#4b5563"}
              strokeWidth="2"
            />
            <line
              x1="50%"
              y1="295"
              x2="25%"
              y2="320"
              stroke={theme === "dark" ? "#6b7280" : "#4b5563"}
              strokeWidth="2"
            />
            <line
              x1="50%"
              y1="295"
              x2="75%"
              y2="320"
              stroke={theme === "dark" ? "#6b7280" : "#4b5563"}
              strokeWidth="2"
            />
            <line
              x1="25%"
              y1="360"
              x2="50%"
              y2="375"
              stroke={theme === "dark" ? "#6b7280" : "#4b5563"}
              strokeWidth="2"
              strokeDasharray="5,5"
            />
            <line
              x1="78%"
              y1="360"
              x2="50%"
              y2="375"
              stroke={theme === "dark" ? "#6b7280" : "#4b5563"}
              strokeWidth="2"
              strokeDasharray="5,5"
            />
            <line
              x1="75%"
              y1="102"
              x2="80%"
              y2="190"
              stroke={theme === "dark" ? "#6b7280" : "#4b5563"}
              strokeWidth="2"
              strokeDasharray="5,5"
            />
            <line
              x1="77%"
              y1="200"
              x2="70%"
              y2="160"
              stroke={theme === "dark" ? "#6b7280" : "#4b5563"}
              strokeWidth="2"
              strokeDasharray="5,5"
            />
          </svg>
        </div>
      </div>

      {/* Organized flowchart - appears on hover */}
      <div
        className={`
        absolute top-20 left-1/2 transform -translate-x-1/2 w-[80%] h-[70%]
        transition-opacity duration-500 ease-in-out
        ${isHovering ? "opacity-100" : "opacity-0"}
      `}
      >
        {/* Main nodes - organized version */}
        <div className="!z-10">
          <div className="top-0 left-1/2 absolute bg-green-100 dark:bg-green-900/30 shadow-sm px-4 py-2.5 border-2 border-green-300 dark:border-green-700 rounded-md font-medium text-green-800 dark:text-green-300 text-xs -translate-x-1/2 transform">
            Student Arrives
          </div>
          <div className="top-20 left-1/2 absolute bg-purple-100 dark:bg-purple-900/30 shadow-sm px-4 py-2.5 border-2 border-purple-300 dark:border-purple-700 rounded-md font-medium text-purple-800 dark:text-purple-300 text-xs -translate-x-1/2 transform">
            Scan ID / Manual Entry
          </div>
          <div className="top-40 left-1/2 absolute bg-blue-100 dark:bg-blue-900/30 shadow-sm px-4 py-2.5 border-2 border-blue-300 dark:border-blue-700 rounded-md font-medium text-blue-800 dark:text-blue-300 text-xs -translate-x-1/2 transform">
            Verify Student
          </div>
          <div className="top-60 left-1/2 absolute bg-amber-100 dark:bg-amber-900/30 shadow-sm px-4 py-2.5 border-2 border-amber-300 dark:border-amber-700 rounded-md font-medium text-amber-800 dark:text-amber-300 text-xs -translate-x-1/2 transform">
            Mark Attendance
          </div>
          <div className="top-80 left-[30%] absolute bg-emerald-100 dark:bg-emerald-900/30 shadow-sm px-4 py-2.5 border-2 border-emerald-300 dark:border-emerald-700 rounded-md font-medium text-emerald-800 dark:text-emerald-300 text-xs -translate-x-1/2 transform">
            Generate Report
          </div>
          <div className="top-80 right-[30%] absolute bg-indigo-100 dark:bg-indigo-900/30 shadow-sm px-4 py-2.5 border-2 border-indigo-300 dark:border-indigo-700 rounded-md font-medium text-indigo-800 dark:text-indigo-300 text-xs translate-x-1/2 transform">
            Notify Teachers
          </div>
        </div>

        {/* Connection lines - organized version */}
        <svg
          className="top-7 left-0 !z-0 absolute w-full h-full"
          xmlns="http://www.w3.org/2000/svg"
        >
          <line
            x1="50%"
            y1="15"
            x2="50%"
            y2="51"
            stroke={theme === "dark" ? "#22c55e" : "#16a34a"}
            strokeWidth="2.5"
          />
          <line
            x1="50%"
            y1="95"
            x2="50%"
            y2="130"
            stroke={theme === "dark" ? "#22c55e" : "#16a34a"}
            strokeWidth="2.5"
          />
          <line
            x1="50%"
            y1="175"
            x2="50%"
            y2="210"
            stroke={theme === "dark" ? "#22c55e" : "#16a34a"}
            strokeWidth="2.5"
          />
          <line
            x1="50%"
            y1="255"
            x2="33%"
            y2="290"
            stroke={theme === "dark" ? "#22c55e" : "#16a34a"}
            strokeWidth="2.5"
          />
          <line
            x1="50%"
            y1="255"
            x2="67%"
            y2="290"
            stroke={theme === "dark" ? "#22c55e" : "#16a34a"}
            strokeWidth="2.5"
          />
        </svg>
      </div>

      {/* Sticky notes */}
      <div
        className={`
        absolute bottom-24 left-8 w-28 h-28 bg-yellow-200 dark:bg-yellow-200/90 p-2 text-xs text-yellow-800 rotate-6 shadow-sm
        transition-all duration-500 ease-in-out
        ${isHovering ? "opacity-0 translate-x-10" : "opacity-100 translate-x-0"}
      `}
      >
        <div className="mb-1 font-medium">TO-DO:</div>
        <div className="flex items-center">
          <div className="mr-1 border border-yellow-800 w-3 h-3"></div>
          <div className="line-through">Fix bugs</div>
        </div>
        <div className="flex items-center">
          <div className="mr-1 border border-yellow-800 w-3 h-3"></div>
          <div className="line-through">Sleep</div>
        </div>
        <div className="flex items-center">
          <div className="mr-1 border border-yellow-800 w-3 h-3"></div>
          <div>More coffee</div>
        </div>
      </div>

      <div
        className={`
        absolute -bottom-3 right-0 w-28 h-20 bg-blue-200 dark:bg-blue-300 p-2 text-xs text-blue-800 -rotate-3 shadow-sm
        transition-all duration-500 ease-in-out
        ${
          isHovering
            ? "opacity-0 translate-x-[-10px]"
            : "opacity-100 translate-x-0"
        }
      `}
      >
        <div className="mb-1 font-medium">DEADLINE: 💀</div>
        <div className="font-bold text-red-600">YESTERDAY !</div>
        <div className="mt-2 italic">We&apos;re doomed.</div>
      </div>

      {/* Success note - appears on hover */}
      <div
        className={`
        absolute bottom-48 right-6 w-32 h-fit bg-green-200 dark:bg-green-200/90 p-2 text-xs text-green-800 rotate-6 shadow-sm
        transition-all duration-500 ease-in-out
        ${isHovering ? "opacity-100 translate-y-0" : "opacity-0 translate-y-10"}
      `}
      >
        <div className="mb-1 font-medium">SUCCESS!</div>
        <div className="mt-1">System deployed on time*</div>
        <div className="mt-3 text-[10px] italic">
          *after negotiating a 2-week extension
        </div>
      </div>

      {/* Annotations */}
      <div
        className={`
        absolute bottom-4 left-4 text-xs text-slate-500 dark:text-slate-400 italic transform
        transition-opacity duration-500 ease-in-out
        ${isHovering ? "opacity-0" : "opacity-100"}
      `}
      >
        * Diagram simplified for clarity
      </div>

      <div
        className={`
        absolute top-[38%] right-12 text-xs text-red-500 dark:text-red-400 font-medium transform rotate-[1deg]
        transition-opacity duration-500 ease-in-out
        ${isHovering ? "opacity-0" : "opacity-100"}
      `}
      >
        This part never works! 😩
      </div>

      {/* Organized annotation - appears on hover */}
      <div
        className={`
        absolute bottom-4 right-4 rounded-full transform  px-2 text-xs bg-emerald-100 border border-emerald-500 text-emerald-700 font-medium
        transition-opacity duration-500 ease-in-out
        ${isHovering ? "opacity-100" : "opacity-0"}
      `}
      >
        99.9% uptime since launch
      </div>
    </div>
  );
}
