"use client";

import React, { forwardRef, useRef } from "react";

import { cn } from "@/lib/utils";
import { AnimatedBeam } from "@/components/magicui/animated-beam";
import { BrainIcon } from "lucide-react";
import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from "@/components/ui/tooltip";

// This is a list of tooltips for various API endpoints
const tooltips = {
  students:
    "GET /students: Returns all students or an empty array when I forget to seed the database.",
  createStudent:
    "POST /students: Creates a student. 60% of the time, it works every time.",
  studentDetail:
    "GET /students/:id: Returns a student or a 404 that made me question my existence.",
  updateStudent:
    "PUT /students/:id: Updates a student. Also occasionally updates my blood pressure.",
  deleteStudent:
    "DELETE /students/:id: Deletes a student. And sometimes, their entire browser history.",
  attendance:
    "GET /attendance: Lists attendance records. May include students who graduated years ago.",
  markAttendance:
    "POST /attendance: Marks attendance. The backbone of this entire system, yet it took 3 days to debug.",
  reports: "GET /reports: Generates reports that management pretends to read.",
  brain:
    "The central brain. Processes 1000s of requests daily and only crashes when I'm about to go to sleep.",
  traffic: "Live API traffic. Those red ones? That's me testing in production.",
};

// This component creates a circular div with a specific style
const Circle = forwardRef<
  HTMLDivElement,
  { className?: string; children?: React.ReactNode }
>(({ className, children }, ref) => {
  return (
    <div
      ref={ref}
      className={cn(
        "z-10 flex size-12 items-center justify-center rounded-full border-2 bg-background/20 backdrop-blur-3xl p-3 shadow-[0_0_20px_-12px_rgba(0,0,0,0.8)]",
        className
      )}
    >
      {children}
    </div>
  );
});

// This component creates a rectangular div with a specific style
const Rectangle = forwardRef<
  HTMLDivElement,
  { className?: string; children?: React.ReactNode }
>(({ className, children }, ref) => {
  return (
    <div
      ref={ref}
      className={cn(
        "z-10 flex flex-col items-center justify-center rounded-lg border-2 bg-background/20 backdrop-blur-3xl p-3 shadow-[0_0_20px_-12px_rgba(0,0,0,0.8)]",
        className
      )}
    >
      {children}
    </div>
  );
});

Rectangle.displayName = "Rectangle";
Circle.displayName = "Circle";

interface AniBeamProps {
  className?: string;
}

// This component renders a series of animated beams connecting various API endpoints
export function AniBeam({ className }: AniBeamProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  const div1Ref = useRef<HTMLDivElement>(null);
  const div2Ref = useRef<HTMLDivElement>(null);
  const div3Ref = useRef<HTMLDivElement>(null);
  const div4Ref = useRef<HTMLDivElement>(null);
  const div5Ref = useRef<HTMLDivElement>(null);
  const div6Ref = useRef<HTMLDivElement>(null);
  const div7Ref = useRef<HTMLDivElement>(null);

  return (
    <div
      className={cn(
        "relative flex justify-center items-center p-6 w-full h-fit",
        className
      )}
      ref={containerRef}
    >
      <div className="z-10 flex flex-col justify-between items-stretch gap-10 max-w-lg max-h-[200px] size-full">
        <div className="flex flex-row justify-between items-center">
          <Tooltip delayDuration={0}>
            <TooltipTrigger className="relative w-full max-w-24">
              <Rectangle ref={div1Ref}>
                GET
                <span className="text-[10px]">/students</span>
              </Rectangle>
            </TooltipTrigger>
            <TooltipContent className="max-w-md">
              {tooltips.students}
            </TooltipContent>
          </Tooltip>
          <Tooltip delayDuration={0}>
            <TooltipTrigger className="relative w-full max-w-24">
              <Rectangle ref={div5Ref}>
                POST
                <span className="text-[10px]">/students</span>
              </Rectangle>
            </TooltipTrigger>
            <TooltipContent className="max-w-md">
              {tooltips.createStudent}
            </TooltipContent>
          </Tooltip>
        </div>
        <div className="flex flex-row justify-between items-center">
          <Tooltip delayDuration={0}>
            <TooltipTrigger className="relative w-full max-w-24">
              <Rectangle ref={div2Ref}>
                GET
                <span className="text-[10px]">/students/:id</span>
              </Rectangle>
            </TooltipTrigger>
            <TooltipContent className="max-w-md">
              {tooltips.studentDetail}
            </TooltipContent>
          </Tooltip>
          <Tooltip delayDuration={0}>
            <TooltipTrigger className="relative w-full max-w-24">
              <div className="top-2 left-2 absolute border rounded-full size-16 animate-ping" />
              <Circle ref={div4Ref} className="size-20">
                <BrainIcon className="size-16 text-white" />
              </Circle>
            </TooltipTrigger>
            <TooltipContent className="max-w-md">
              {tooltips.brain}
            </TooltipContent>
          </Tooltip>
          <Tooltip delayDuration={0}>
            <TooltipTrigger className="relative w-full max-w-24">
              <Rectangle ref={div6Ref}>
                POST
                <span className="text-[10px]">/attendance</span>
              </Rectangle>
            </TooltipTrigger>
            <TooltipContent className="max-w-md">
              {tooltips.markAttendance}
            </TooltipContent>
          </Tooltip>
        </div>
        <div className="flex flex-row justify-between items-center">
          <Tooltip delayDuration={0}>
            <TooltipTrigger className="relative w-full max-w-24">
              <Rectangle ref={div3Ref}>
                DELETE
                <span className="text-[10px]">/students/:id</span>
              </Rectangle>
            </TooltipTrigger>
            <TooltipContent className="max-w-md">
              {tooltips.deleteStudent}
            </TooltipContent>
          </Tooltip>
          <Tooltip delayDuration={0}>
            <TooltipTrigger className="relative w-full max-w-24">
              <Rectangle ref={div7Ref}>
                PUT
                <span className="text-[10px]">/students/:id</span>
              </Rectangle>
            </TooltipTrigger>
            <TooltipContent className="max-w-md">
              {tooltips.updateStudent}
            </TooltipContent>
          </Tooltip>
        </div>
      </div>

      <AnimatedBeam
        containerRef={containerRef}
        fromRef={div1Ref}
        toRef={div4Ref}
        curvature={-75}
        endYOffset={-10}
        reverse={true}
      />
      <AnimatedBeam
        containerRef={containerRef}
        fromRef={div2Ref}
        toRef={div4Ref}
        reverse={true}
      />
      <AnimatedBeam
        containerRef={containerRef}
        fromRef={div3Ref}
        toRef={div4Ref}
        curvature={75}
        endYOffset={10}
        reverse={true}
      />
      <AnimatedBeam
        containerRef={containerRef}
        fromRef={div5Ref}
        toRef={div4Ref}
        curvature={-75}
        endYOffset={-10}
      />
      <AnimatedBeam
        containerRef={containerRef}
        fromRef={div6Ref}
        toRef={div4Ref}
      />
      <AnimatedBeam
        containerRef={containerRef}
        fromRef={div7Ref}
        toRef={div4Ref}
        curvature={75}
        endYOffset={10}
      />
    </div>
  );
}
