"use client";
import { AboutColors } from "@/lib/colors";
import { NeonSparkels } from "../NeonSparkels";
import { motion } from "framer-motion";
import SketchBoard from "./about-sections/SketchBoard";
import AuthIntegration from "./about-sections/AuthIntefration";
import { TooltipProvider } from "../ui/tooltip";
import ApiDashboard from "./about-sections/ApiDashboard";

export type About = {
  id: string;
  color?: AboutColors;
  title: string;
  description: string;
  isActive: boolean;
  content?: React.ReactNode;
};

// This type is used to define the structure of the sections in the About component
const defaultAbout: About[] = [
  {
    id: "inception",
    color: "yellow",
    title: "It Started with an Idea… and Too Much Confidence",
    description:
      "The plan was simple: build an efficient, automated attendance system. The reality? A rollercoaster of late-night debugging, moments of brilliance, and the occasional existential crisis. But in the end, the vision stayed intact ...mostly.",
    isActive: true,
  },
  {
    id: "authentication",
    color: "blue",
    title: "Logging In: Easier for Users, A Nightmare for Me",
    description:
      "Integrating NextAuth with Google and GitHub seemed like a straightforward task. And it was—until it wasn't. After wrestling with token errors, unexpected logouts, and sessions that had minds of their own, authentication finally works… and no, I don't want to talk about how long it took.",
    isActive: true,
  },

  {
    id: "API",
    color: "emerald",
    title: "APIs: The Backbone of This System (and My Sanity)",
    description:
      'Building a robust API for managing students and attendance was a smooth process—except for the occasional "why is this not working" moment. Now, the system handles data like a pro, and I only occasionally have nightmares about breaking it.',
    isActive: true,
  },
];

// This function returns the content for each feature based on its ID
const getFeatureContent = (featureId: string) => {
  switch (featureId) {
    case "inception":
      return (
        <div className="relative bg-background/20 backdrop-blur-md mt-10 p-2 border rounded-lg">
          <NeonSparkels
            neonClassName="!w-[40rem]"
            className="-top-40 absolute"
            neonColor={defaultAbout[0].color}
          />
          {/* Dashboard Feature display widget */}
          <motion.div className="group bg-background dark:bg-neutral-950 dark:opacity-80 rounded-lg w-[550px] 1xl:w-[700px] h-[500px] 1xl:h-[600px] transition-transform translate-x-4 hover:translate-x-0 duration-500 cursor-default">
            <SketchBoard />
            <div
              className={`top-0 md:top-0 left-1/2 -z-10 absolute bg-${defaultAbout[0].color}-500 opacity-10 group-hover:opacity-[0.15] blur-[60px] md:blur-[90px] rounded-[100%] w-full h-[200px] md:h-[400px] transition-all -translate-x-1/2 -translate-y-1/2 duration-700 pointer-events-none`}
            />
          </motion.div>
        </div>
      );
    case "authentication":
      return (
        <TooltipProvider>
          <div className="relative bg-background/20 backdrop-blur-md mt-10 p-2 border rounded-lg">
            <NeonSparkels
              neonClassName="!w-[40rem]"
              className="-top-40 absolute"
              neonColor={defaultAbout[1].color}
            />
            {/* Dashboard Feature display widget */}
            <motion.div className="group bg-background dark:bg-neutral-950 dark:opacity-80 rounded-lg w-[550px] 1xl:w-[700px] h-[500px] 1xl:h-[600px] transition-transform translate-x-4 hover:translate-x-0 duration-500 cursor-default">
              <AuthIntegration />
              <div
                className={`top-0 md:top-0 left-1/2 -z-10 absolute bg-${defaultAbout[1].color}-500 opacity-10 group-hover:opacity-[0.15] blur-[60px] md:blur-[90px] rounded-[100%] w-full h-[200px] md:h-[400px] transition-all -translate-x-1/2 -translate-y-1/2 duration-700 pointer-events-none`}
              />
            </motion.div>
          </div>
        </TooltipProvider>
      );
    case "API":
      return (
        <TooltipProvider>
          <div className="relative bg-background/20 backdrop-blur-md mt-10 p-2 border rounded-lg">
            <NeonSparkels
              neonClassName="!w-[40rem]"
              className="-top-40 absolute"
              neonColor={defaultAbout[2].color}
            />
            {/* Dashboard Feature display widget */}
            <motion.div className="group bg-background dark:bg-neutral-950 dark:opacity-80 w-[550px] 1xl:w-[700px] h-[500px] 1xl:h-[600px] transition-transform translate-x-4 hover:translate-x-0 duration-500 cursor-default">
              <ApiDashboard />
              <div
                className={`top-0 md:top-0 left-1/2 -z-10 absolute bg-${defaultAbout[2].color}-500 opacity-10 group-hover:opacity-[0.15] blur-[60px] md:blur-[90px] rounded-[100%] w-full h-[200px] md:h-[400px] transition-all -translate-x-1/2 -translate-y-1/2 duration-700 pointer-events-none`}
              />
            </motion.div>
          </div>
        </TooltipProvider>
      );
    default:
      return null;
  }
};

export const sections = defaultAbout.map((section) => ({
  ...section,
  content: getFeatureContent(section.id),
  isActive: section.isActive,
}));
