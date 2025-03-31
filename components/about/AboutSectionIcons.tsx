import {
  BarChart2Icon,
  BrainIcon,
  CalendarIcon,
  DatabaseIcon,
  FingerprintIcon,
  KeyIcon,
  LayoutDashboardIcon,
  LightbulbIcon,
  LineChartIcon,
  LockIcon,
  NetworkIcon,
  PieChartIcon,
  RocketIcon,
  ServerIcon,
  ShieldCheckIcon,
  TerminalIcon,
} from "lucide-react";

import { LucideIcon } from "lucide-react";

export type AboutIcon = {
  Icon: LucideIcon;
  position: string;
};

// This file contains the icons and their positions for the About section of the application.
export const aboutSectionIcons: Record<string, AboutIcon[]> = {
  inception: [
    {
      Icon: LightbulbIcon,
      position: "top-[-60%] left-[0] 1xl:!left-[-40%] ",
    },
    {
      Icon: RocketIcon,
      position: "-top-20 left-[100%]",
    },
    {
      Icon: BrainIcon,
      position: "top-[150%] right-[-100%] 1xl:top-[220%]",
    },
    {
      Icon: CalendarIcon,
      position: "-bottom-20 left-[10%] 1xl:-bottom-32",
    },
  ],
  authentication: [
    {
      Icon: LockIcon,
      position: "top-[150%] left-[10%] 1xl:left-[-40%]",
    },
    {
      Icon: ShieldCheckIcon,
      position: "top-[-50%] right-[15%] 1xl:top-[-100%]",
    },
    {
      Icon: KeyIcon,
      position: "bottom-[-85%] right-[-110%] 1xl:bottom-[-160%]",
    },
    {
      Icon: FingerprintIcon,
      position: "bottom-[110%] right-[-120%] 2xl:right-[-130%]",
    },
  ],
  API: [
    {
      Icon: NetworkIcon,
      position: "top-[-50%] left-[80%] 1xl:top-[-100%]",
    },
    {
      Icon: ServerIcon,
      position: "top-1/2 right-[-120%] 1xl:right-[-200%]",
    },
    {
      Icon: DatabaseIcon,
      position: "bottom-[150%] left-[-15%]",
    },
    {
      Icon: TerminalIcon,
      position: "bottom-[-50%] right-[25%]",
    },
  ],
  dashboard: [
    {
      Icon: BarChart2Icon,
      position: "top-[-150px] left-[-10%]",
    },
    {
      Icon: LineChartIcon,
      position: "top-[-30%] right-[-10%]",
    },
    {
      Icon: PieChartIcon,
      position: "bottom-[-95%] left-[200%] 1xl:bottom-[-130%] 1xl:left-[280%]",
    },
    {
      Icon: LayoutDashboardIcon,
      position: "bottom-[-50%] right-[50%]",
    },
  ],
};
