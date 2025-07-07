"use client";

import type React from "react";

import { useTheme } from "next-themes";
import { useEffect, useState } from "react";
import {
  Tooltip,
  TooltipTrigger,
  TooltipContent,
} from "@/components/ui/tooltip";
import {
  Github,
  AlertCircle,
  Terminal,
  Activity,
  Coffee,
  Clock,
  BugOff,
  Shield,
  Zap,
} from "lucide-react";
import { Button } from "@/components/ui/button";

// This component simulates an authentication system showcasing various error messages and tooltips
export default function AuthIntegration() {
  const { theme } = useTheme();
  const [mounted, setMounted] = useState(false);
  const [currentError, setCurrentError] = useState(0);

  const errorMessages = [
    "Session expired. Please try not to cry.",
    "Authentication failed. Have you tried turning it off and on again?",
    "Invalid token. Just like my promises to finish this by Friday.",
    "Callback URL mismatch. It's not you, it's the URL.",
    "User not found. Neither was my will to live after day 3.",
  ];

  const tooltips = {
    githubButton:
      "Sure, let GitHub handle it. They've only changed their OAuth flow 3 times this year.",
    googleButton:
      "Google login: because remembering another password would be too much for your brain.",
    emailInput: "Please enter a valid email. No, that one won't work either.",
    passwordInput:
      "Password requirements: Must contain the soul of your firstborn and at least one uppercase letter.",
    signInButton:
      "Are you seriously trying to log in from here? This is just a demo, you know.",
    console:
      "This is what my terminal looked like for 3 days straight. The coffee stains aren't visible though.",
    coffeeMetric:
      "Each cup represents approximately 2 hours of debugging and 1 hour of questioning my career choices.",
    hoursMetric:
      "37 hours = 1 day of coding + 2 days of staring blankly at error messages.",
    bugsMetric:
      "For every bug fixed, two more appeared. It's like fighting a hydra with a keyboard.",
    statusBar:
      "99.8% uptime! The other 0.2% is when I was sobbing uncontrollably.",
  };

  // This effect runs once on mount to set the mounted state
  useEffect(() => {
    setMounted(true);

    const errorInterval = setInterval(() => {
      setCurrentError((prev) => (prev + 1) % errorMessages.length);
    }, 3000);

    return () => {
      clearInterval(errorInterval);
    };
  }, [errorMessages.length]);

  if (!mounted) return null;

  return (
    <div className="group relative border rounded-lg w-full max-w-xl h-full overflow-hidden">
      {/* Container with tilt effect */}
      <div className="absolute inset-0 shadow-xl overflow-hidden">
        {/* Futuristic grid background */}
        <div
          className="absolute inset-0 opacity-20"
          style={{
            backgroundImage: `
              radial-gradient(circle, ${
                theme === "dark" ? "#4f46e5" : "#6366f1"
              } 1px, transparent 1px)
            `,
            backgroundSize: "30px 30px",
          }}
        />

        {/* Header */}
        <div className="relative flex justify-between items-center px-6 py-4 border-b">
          <div className="flex items-center gap-2">
            <Shield className="w-5 h-5 text-indigo-400" />
            <h3 className="font-medium text-white text-lg">
              Authentication System
            </h3>
          </div>
          <div className="flex items-center gap-2 text-slate-400 text-xs">
            <div className="bg-green-500 rounded-full w-3 h-3 animate-[pulse_1s_cubic-bezier(0.4,_0,_0.6,_1)_infinite]" />
            <span>SYSTEM ONLINE</span>
          </div>
        </div>

        {/* Main content - split view */}
        <div className="grid grid-cols-2 h-full">
          {/* Left panel - User Interface */}
          <div className="flex flex-col gap-4 p-4 border-r h-fit">
            <div className="flex items-center gap-2 mb-3">
              <div className="relative">
                <div className="bg-indigo-500 rounded-full w-3 h-3" />
                <div className="top-0 left-0 absolute bg-indigo-500 rounded-full w-3 h-3 animate-ping" />
              </div>
              <h4 className="font-medium text-slate-300 text-xs uppercase tracking-wider">
                User Interface
              </h4>
            </div>

            {/* Metrics */}
            <div className="gap-4 grid grid-cols-3">
              <div className="relative -rotate-6 group-hover:rotate-0 transition-transform translate-x-5 group-hover:translate-x-0 duration-300 transform">
                <Tooltip delayDuration={0}>
                  <TooltipTrigger asChild>
                    <div className="flex flex-col items-center bg-slate-800/50 p-2 border border-slate-700 rounded-lg cursor-pointer">
                      <div className="flex justify-center items-center bg-amber-900/30 mb-1 rounded-full w-6 h-6">
                        <Coffee className="w-3.5 h-3.5 text-amber-500" />
                      </div>
                      <div className="font-bold text-amber-500 text-lg">17</div>
                      <div className="text-[10px] text-slate-400">Coffees</div>
                    </div>
                  </TooltipTrigger>
                  <TooltipContent
                    side="top"
                    className="z-50 bg-background shadow-lg w-full max-w-64 text-black dark:text-white text-sm"
                  >
                    {tooltips.coffeeMetric}
                  </TooltipContent>
                </Tooltip>
              </div>

              <div className="relative transition-transform -translate-y-2 group-hover:translate-y-0 duration-300 transform">
                <Tooltip delayDuration={0}>
                  <TooltipTrigger asChild>
                    <div className="flex flex-col items-center bg-slate-800/50 p-2 border border-slate-700 rounded-lg cursor-pointer">
                      <div className="flex justify-center items-center bg-purple-900/30 mb-1 rounded-full w-6 h-6">
                        <Clock className="w-3.5 h-3.5 text-purple-500" />
                      </div>
                      <div className="font-bold text-purple-500 text-lg">
                        37
                      </div>
                      <div className="text-[10px] text-slate-400">Hours</div>
                    </div>
                  </TooltipTrigger>
                  <TooltipContent
                    side="top"
                    className="z-50 bg-background shadow-lg w-full max-w-64 text-black dark:text-white text-sm"
                  >
                    {tooltips.hoursMetric}
                  </TooltipContent>
                </Tooltip>
              </div>

              <div className="relative rotate-6 group-hover:rotate-0 transition-transform -translate-x-5 group-hover:translate-x-0 duration-300 transform">
                <Tooltip delayDuration={0}>
                  <TooltipTrigger asChild>
                    <div className="flex flex-col items-center bg-slate-800/50 p-2 border border-slate-700 rounded-lg cursor-pointer">
                      <div className="flex justify-center items-center bg-red-900/30 mb-1 rounded-full w-6 h-6">
                        <BugOff className="w-3.5 h-3.5 text-red-500" />
                      </div>
                      <div className="font-bold text-red-500 text-lg">23</div>
                      <div className="text-[10px] text-slate-400">Bugs</div>
                    </div>
                  </TooltipTrigger>
                  <TooltipContent
                    side="top"
                    className="z-50 bg-background shadow-lg w-full max-w-64 text-black dark:text-white text-sm"
                  >
                    {tooltips.bugsMetric}
                  </TooltipContent>
                </Tooltip>
              </div>
            </div>

            {/* Login form */}
            <div className="bg-slate-800 bg-opacity-50 backdrop-blur-sm p-4 border border-slate-700 rounded-lg h-full overflow-hidden transition-transform -translate-x-8 translate-y-8 group-hover:translate-x-0 group-hover:translate-y-0 duration-300 transform">
              <div className="mb-4 text-center">
                <h5 className="font-medium text-white">
                  Sign in to your account
                </h5>
                <p className="text-slate-400 text-xs">
                  Choose your preferred method
                </p>
              </div>

              <div className="space-y-3">
                <Tooltip delayDuration={0}>
                  <TooltipTrigger asChild>
                    <Button
                      className="flex justify-center items-center gap-2 bg-slate-700 hover:bg-slate-600 px-3 py-2 rounded-md w-full text-white text-sm transition-colors"
                      onClick={() => setCurrentError((prev) => prev + 1)}
                    >
                      <Github className="w-4 h-4" />
                      <span>Continue with GitHub</span>
                    </Button>
                  </TooltipTrigger>
                  <TooltipContent className="bg-background shadow-lg w-full max-w-64 text-black dark:text-white text-sm">
                    {tooltips.githubButton}
                  </TooltipContent>
                </Tooltip>

                <Tooltip delayDuration={0}>
                  <TooltipTrigger asChild>
                    <Button
                      className="flex justify-center items-center gap-2 bg-slate-700 hover:bg-slate-600 px-3 py-2 rounded-md w-full text-white text-sm transition-colors"
                      onClick={() => setCurrentError((prev) => prev + 1)}
                    >
                      <svg className="w-4 h-4" viewBox="0 0 24 24">
                        <path
                          fill="currentColor"
                          d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
                        />
                        <path
                          fill="currentColor"
                          d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
                        />
                        <path
                          fill="currentColor"
                          d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"
                        />
                        <path
                          fill="currentColor"
                          d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"
                        />
                      </svg>
                      <span>Continue with Google</span>
                    </Button>
                  </TooltipTrigger>
                  <TooltipContent className="bg-background shadow-lg w-full max-w-64 text-black dark:text-white text-sm">
                    {tooltips.googleButton}
                  </TooltipContent>
                </Tooltip>
                <div className="space-y-2">
                  <Tooltip delayDuration={0}>
                    <TooltipTrigger asChild className="w-full">
                      <Button className="bg-indigo-600 hover:bg-indigo-700 px-3 py-2 rounded-md w-full font-medium text-white text-sm transition-colors">
                        Sign in
                      </Button>
                    </TooltipTrigger>
                    <TooltipContent className="bg-background shadow-lg w-full max-w-64 text-black dark:text-white text-sm">
                      {tooltips.signInButton}
                    </TooltipContent>
                  </Tooltip>
                </div>
              </div>
            </div>
          </div>

          {/* Right panel - Developer Reality */}
          <div className="flex flex-col p-4">
            <div className="flex items-center gap-2 mb-3 -rotate-1 group-hover:rotate-0 transition-transform duration-300 transform">
              <div className="relative">
                <div className="bg-red-500 rounded-full w-3 h-3" />
                <div className="top-0 left-0 absolute bg-red-500 rounded-full w-3 h-3 animate-ping" />
              </div>
              <h4 className="font-medium text-slate-300 text-xs uppercase tracking-wider">
                Developer Console
              </h4>
            </div>

            {/* Console output */}
            <div className="bg-slate-950 mb-3 p-3 border rounded-lg h-[275px] overflow-hidden font-mono text-xs rotate-2 group-hover:rotate-0 transition-transform duration-300 transform">
              <div className="flex items-center gap-2 mb-2 pb-2 border-b text-slate-400">
                <Terminal className="w-3.5 h-3.5" />
                <span>auth-debug.log</span>
              </div>
              <Tooltip delayDuration={0}>
                <TooltipTrigger asChild>
                  <div className="h-full overflow-hidden text-green-500">
                    <div className="text-left animate-typing-slow">
                      <p className="mb-1">
                        [INFO] Initializing NextAuth.js v4.22.1
                      </p>
                      <p className="mb-1">
                        [INFO] Loading providers: GitHub, Google
                      </p>
                      <p className="mb-1 text-yellow-500">
                        [WARN] Callback URL mismatch detected
                      </p>
                      <p className="mb-1">
                        [INFO] Attempting to authenticate with GitHub...
                      </p>
                      <p className="mb-1 text-red-500">
                        [ERROR] OAuth token validation failed
                      </p>
                      <p className="mb-1">
                        [INFO] Retrying authentication (attempt 1/3)
                      </p>
                      <p className="mb-1 text-red-500">
                        [ERROR] Session not persisted to database
                      </p>
                      <p className="mb-1">
                        [INFO] Checking environment variables...
                      </p>
                      <p className="mb-1 text-red-500">
                        [ERROR] NEXTAUTH_SECRET is undefined
                      </p>
                      <p className="mb-1">
                        [INFO] Adding NEXTAUTH_SECRET to .env
                      </p>
                      <p className="mb-1">[INFO] Restarting server...</p>
                      <p className="mb-1">
                        [INFO] Attempting to authenticate with GitHub...
                      </p>
                      <p className="mb-1 text-yellow-500">
                        [WARN] Session expiration time is too short
                      </p>
                      <p className="mb-1">
                        [INFO] Adjusting session configuration
                      </p>
                      <p className="mb-1">
                        [INFO] Testing authentication flow...
                      </p>
                      <p className="mb-1 text-red-500">
                        [ERROR] CSRF token mismatch
                      </p>
                      <p className="mb-1">
                        [INFO] Debugging CSRF implementation...
                      </p>
                      <p className="mb-1">
                        [INFO] Checking cookies configuration...
                      </p>
                      <p className="mb-1">
                        [INFO] Modifying secure cookie settings for development
                      </p>
                      <p className="mb-1">
                        [INFO] Retrying authentication flow...
                      </p>
                      <p className="mb-1 text-green-500">
                        [SUCCESS] Authentication successful
                      </p>
                      <p className="mb-1">[INFO] Session stored in database</p>
                      <p className="mb-1 text-green-500">
                        [SUCCESS] User authenticated: github|123456
                      </p>
                    </div>
                  </div>
                </TooltipTrigger>
                <TooltipContent className="bg-background shadow-lg w-full max-w-64 text-black dark:text-white text-sm">
                  {tooltips.console}
                </TooltipContent>
              </Tooltip>
            </div>

            {/* Error message */}
            <div className="flex items-center gap-2 bg-red-900/30 mb-3 p-3 border border-red-800 rounded-lg">
              <AlertCircle className="w-4 h-4 text-red-500 shrink-0" />
              <p className="text-red-200 text-xs">
                {errorMessages[currentError]}
              </p>
            </div>
          </div>
        </div>

        {/* Status bar */}
        <Tooltip delayDuration={0}>
          <TooltipTrigger asChild>
            <div className="bottom-0 left-0 absolute flex items-center bg-slate-950 px-3 border-t w-full h-7">
              <div className="flex items-center gap-2 text-[10px] text-slate-500">
                <Activity className="w-3 h-3" />
                <span>STATUS:</span>
                <span className="text-green-500">OPERATIONAL</span>
                <span className="mx-2">|</span>
                <Zap className="w-3 h-3" />
                <span>UPTIME:</span>
                <span className="text-indigo-400">99.8%</span>
              </div>
            </div>
          </TooltipTrigger>
          <TooltipContent
            align="start"
            className="bg-background shadow-lg w-full max-w-64 text-black dark:text-white text-sm"
          >
            {tooltips.statusBar}
          </TooltipContent>
        </Tooltip>
      </div>
    </div>
  );
}
