import {
  FileIcon,
  LineChartIcon,
  ShieldCheckIcon,
  Users2Icon,
} from "lucide-react";

import { BentoCard, BentoGrid } from "../magicui/bento-grid";
import { AuthenticationDemo } from "./AuthDemo";
import { StudentCheckInDemo } from "./StudentCheckIn";
import { AttendanceReportsDemo } from "./AttendanceReports";
import { Marquee } from "../magicui/marquee";
import { cn } from "@/lib/utils";

// The files array contains objects that define the files used in the application
const files = [
  {
    name: "students.csv",
    body: "A neatly organized CSV file containing all your student records—importing made easy, so you can ditch manual data entry forever.",
  },
  {
    name: "attendance.xlsx",
    body: "Your daily attendance records, compiled in an Excel sheet with all the charts to prove you’re on top of your classroom game.",
  },
  {
    name: "metrics.pdf",
    body: "A comprehensive PDF report showcasing attendance trends and metrics. Impress anyone with your data prowess and timely insights.",
  },
  {
    name: "backup.json",
    body: "A JSON backup of all attendance data—because nothing says 'I've got it covered' like having a digital safety net.",
  },
  {
    name: "export.txt",
    body: "A plain text log of export operations, proving that even the simplest files can tell the epic tale of your data management mastery.",
  },
];

// The features array contains objects that define the features of the application
const features = [
  {
    Icon: ShieldCheckIcon,
    name: "Seamless Authentication",
    description:
      "Instant access without the hassle of creating another account.",
    href: "#",
    cta: "Learn more",
    className: "col-span-3 lg:col-span-1",
    background: (
      <div className="flex h-full">
        <AuthenticationDemo />
      </div>
    ),
    backgroundClassName: "h-2/3",
  },
  {
    Icon: Users2Icon,
    name: "Instant Student Check-In",
    description:
      "Quickly find and register students, simplifying attendance tracking.",
    href: "#",
    cta: "Learn more",
    className: "col-span-3 lg:col-span-2",
    background: <StudentCheckInDemo />,
    backgroundClassName: "h-2/3 relative",
  },
  {
    Icon: LineChartIcon,
    name: "Real-Time Attendance Reports",
    description: "Get real-time attendance data and insights.",
    href: "#",
    cta: "Learn more",
    className: "col-span-3 lg:col-span-2",
    background: <AttendanceReportsDemo />,
  },
  {
    Icon: FileIcon,
    name: "Data Management & Export",
    description: "Import and export student data effortlessly.",
    className: "col-span-3 lg:col-span-1",
    href: "#",
    cta: "Learn more",
    background: (
      <Marquee className="top-10 absolute [--duration:20s] [mask-image:linear-gradient(to_top,transparent_40%,#000_100%)]">
        {files.map((f, idx) => (
          <figure
            key={idx}
            className={cn(
              "relative w-44 h-[24rem] overflow-hidden rounded-xl border p-4",
              "border-gray-950/[.1] bg-gray-950/[.01] hover:bg-gray-950/[.05]",
              "dark:border-gray-50/[.1] dark:bg-gray-50/[.10] dark:hover:bg-gray-50/[.15]",
              "transform-gpu transition-all duration-300 ease-out hover:blur-none"
            )}
          >
            <div className="flex flex-row items-center gap-2">
              <div className="flex flex-col">
                <figcaption className="font-medium text-md dark:text-white">
                  {f.name}
                </figcaption>
              </div>
            </div>
            <blockquote className="mt-2 text-sm">{f.body}</blockquote>
          </figure>
        ))}
      </Marquee>
    ),
  },
];

// Component that displays a grid of feature cards with icons, names, and descriptions
// Each card can have a background animation and a call-to-action button
export function FeaturesBentoGrid() {
  return (
    <BentoGrid>
      {features.map((feature, idx) => (
        <BentoCard key={idx} {...feature} />
      ))}
    </BentoGrid>
  );
}
