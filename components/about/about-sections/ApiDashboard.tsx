"use client";

import { useEffect, useState, useRef } from "react";
import { Brain, CheckCircle, XCircle, Activity } from "lucide-react";

import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import { Badge } from "@/components/ui/badge";
import { AniBeam } from "./AnimatedBeam";
import { cn } from "@/lib/utils";
import { GridPattern } from "@/components/magicui/grid-pattern";

// This component creates a futuristic API dashboard that simulates API calls
export default function ApiDashboard() {
  const [mounted, setMounted] = useState(false);
  const [apiCalls, setApiCalls] = useState<
    Array<{
      id: number;
      type: string;
      status: string;
      endpoint: string;
      active: boolean;
    }>
  >([]);
  //   const [brainActivity, setBrainActivity] = useState(0);
  const containerRef = useRef<HTMLDivElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);

  const endpoints = useRef([
    {
      id: "students",
      method: "GET",
      path: "/students",
      desc: "List all students",
      x: 30,
      y: 25,
    },
    {
      id: "createStudent",
      method: "POST",
      path: "/students",
      desc: "Create student",
      x: 20,
      y: 45,
    },
    {
      id: "studentDetail",
      method: "GET",
      path: "/students/:id",
      desc: "Get student details",
      x: 15,
      y: 65,
    },
    {
      id: "updateStudent",
      method: "PUT",
      path: "/students/:id",
      desc: "Update student",
      x: 25,
      y: 85,
    },
    {
      id: "deleteStudent",
      method: "DELETE",
      path: "/students/:id",
      desc: "Delete student",
      x: 75,
      y: 85,
    },
    {
      id: "attendance",
      method: "GET",
      path: "/attendance",
      desc: "List attendance records",
      x: 85,
      y: 65,
    },
    {
      id: "markAttendance",
      method: "POST",
      path: "/attendance",
      desc: "Mark attendance",
      x: 80,
      y: 45,
    },
    {
      id: "reports",
      method: "GET",
      path: "/reports",
      desc: "Generate reports",
      x: 70,
      y: 25,
    },
  ]).current;

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
      "DELETE /students/:id: Deletes a student. And sometimes, their entire academic history.",
    attendance:
      "GET /attendance: Lists attendance records. May include students who graduated years ago.",
    markAttendance:
      "POST /attendance: Marks attendance. The backbone of this entire system, yet it took 3 days to debug.",
    reports:
      "GET /reports: Generates reports that management pretends to read.",
    brain:
      "The central brain. Processes 1000s of requests daily and only crashes when I'm about to go to sleep.",
    traffic:
      "Live API traffic. Those red ones? That's me testing in production.",
  };

  // Generate random API calls and pulse effects
  useEffect(() => {
    if (!mounted) return;

    const statuses = ["success", "success", "success", "success", "error"];
    const endpointIds = endpoints.map((e) => e.id);

    const interval = setInterval(() => {
      // Select random endpoint
      const endpointId =
        endpointIds[Math.floor(Math.random() * endpointIds.length)];
      const endpoint = endpoints.find((e) => e.id === endpointId);
      if (!endpoint) return;

      // Create API call
      const method = endpoint.method;
      const status = statuses[Math.floor(Math.random() * statuses.length)];

      // Add to API calls
      setApiCalls((prev) => {
        const newCalls = [
          ...prev,
          {
            id: Date.now(),
            type: method,
            status,
            endpoint: endpoint.path,
            active: true,
          },
        ];

        // Keep only the last 5 calls
        if (newCalls.length > 5) {
          return newCalls.slice(newCalls.length - 5);
        }
        return newCalls;
      });

      // Deactivate pulse after animation completes
      setTimeout(() => {
        // Mark API call as inactive
        setApiCalls((prev) =>
          prev.map((call) =>
            call.id === Date.now() ? { ...call, active: false } : call
          )
        );
      }, 1000);
    }, 1500);

    return () => clearInterval(interval);
  }, [mounted, endpoints]);

  useEffect(() => {
    setMounted(true);

    // Handle window resize for canvas
    const handleResize = () => {
      if (canvasRef.current) {
        canvasRef.current.width = canvasRef.current.offsetWidth;
        canvasRef.current.height = canvasRef.current.offsetHeight;
      }
    };

    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  if (!mounted) return null;

  const getMethodBadgeVariant = (
    method: string
  ): "default" | "destructive" | "secondary" | "outline" | "tag" => {
    switch (method) {
      case "GET":
        return "default";
      case "POST":
        return "outline";
      case "PUT":
        return "tag";
      case "DELETE":
        return "destructive";
      default:
        return "secondary";
    }
  };

  return (
    <div
      className="group relative flex flex-col justify-between border rounded-xl w-full max-w-xl h-full !overflow-hidden"
      ref={containerRef}
    >
      {/* Futuristic grid background */}
      <GridPattern
        width={40}
        height={40}
        x={-1}
        y={-1}
        className={cn(
          "[mask-image:radial-gradient(250px_circle_at_center,white,transparent)]"
        )}
      />

      {/* Header */}
      <div className="z-10 relative flex justify-between items-center px-6 py-4 border-b">
        <div className="flex items-center gap-2">
          <Brain className="w-5 h-5 text-indigo-400" />
          <h3 className="font-medium text-white text-lg">API Neural Network</h3>
        </div>
        <div className="flex items-center gap-3 text-slate-400 text-xs">
          <div className="flex items-center gap-1">
            <div className="bg-green-500 rounded-full w-3 h-3 animate-[pulse_1s_cubic-bezier(0.4,_0,_0.6,_1)_infinite]" />
            <span>BRAIN ACTIVE</span>
          </div>
        </div>
      </div>

      {/* Neural network visualization */}
      <div className="w-full h-full">
        <AniBeam />
      </div>

      {/* Status panel at bottom - slides up on hover */}
      <div className="z-10 flex w-full h-fit transition-all translate-y-[calc(100%-115px)] hover:translate-y-0 duration-500 ease-in-out transform">
        <div className="bg-background/10 backdrop-blur-xl border-t w-full h-full">
          <div className="p-3 cursor-pointer">
            <div className="flex justify-between items-center">
              <div className="flex items-center gap-2">
                <Activity className="w-4 h-4 text-slate-400" />
                <div className="font-medium text-slate-300 text-xs">
                  Live API Traffic
                </div>
              </div>
              <Tooltip>
                <TooltipTrigger asChild>
                  <div className="text-slate-400 text-xs">
                    Brain Load:{" "}
                    <span className="font-medium text-indigo-400">
                      {(Math.random() * 100).toPrecision(3)}%
                    </span>
                  </div>
                </TooltipTrigger>
                <TooltipContent>
                  <p>{tooltips.traffic}</p>
                </TooltipContent>
              </Tooltip>
            </div>
          </div>
          <div className="p-3 pt-0">
            <div className="space-y-1.5 font-mono text-xs">
              {apiCalls.map((call) => (
                <div key={call.id} className="flex items-center gap-2">
                  <Badge
                    variant={getMethodBadgeVariant(call.type)}
                    className="h-5 text-[10px]"
                  >
                    {call.type}
                  </Badge>
                  <span className="text-slate-300">{call.endpoint}</span>
                  <div className="flex-1"></div>
                  {call.status === "success" ? (
                    <span className="flex items-center gap-1 text-green-500">
                      <CheckCircle className="w-3 h-3" /> 200
                    </span>
                  ) : (
                    <span className="flex items-center gap-1 text-red-500">
                      <XCircle className="w-3 h-3" /> 500
                    </span>
                  )}
                  {call.active && (
                    <span className="bg-indigo-500 ml-2 rounded-full w-2 h-2 animate-pulse"></span>
                  )}
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
