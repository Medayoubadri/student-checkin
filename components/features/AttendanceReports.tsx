"use client";

import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import { CardStack } from "../ui/card-stack";

// Sample data for reports
const CARDS = [
  {
    id: 0,
    name: "Alex Johnson",
    designation: "Attendance Wizard",
    content: (
      <p>
        This real-time reporting is so sharp, it makes tracking tardies feel
        like magic. Now I can spot a latecomer before they even set foot in
        class!
      </p>
    ),
  },
  {
    id: 1,
    name: "Sam Taylor",
    designation: "Data Diva",
    content: (
      <p>
        Who knew attendance could be this entertaining? The animated charts and
        quirky cards give a whole new meaning to &apos;being on time&apos;!
      </p>
    ),
  },
  {
    id: 2,
    name: "Jamie Lee",
    designation: "Attendance Overlord",
    content: (
      <p>
        I used to dread roll calls, but now these digital nudges make me smile
        every time someone sneaks in late. It&apos;s like getting a playful
        reminder: &apos;Better luck next time, champ!&apos;
      </p>
    ),
  },
];

// Chart data - attendance over time
const chartData = [
  { day: "Mon", value: 82 },
  { day: "Tue", value: 75 },
  { day: "Wed", value: 85 },
  { day: "Thu", value: 90 },
  { day: "Fri", value: 88 },
  { day: "Mon", value: 80 },
  { day: "Tue", value: 85 },
  { day: "Wed", value: 92 },
  { day: "Thu", value: 88 },
  { day: "Fri", value: 85 },
];

// This component is responsible for rendering the attendance reports demo
// It includes a chart that animates attendance data and a stack of report cards
export function AttendanceReportsDemo() {
  const [chartProgress, setChartProgress] = useState(0);
  const [highlightPoint, setHighlightPoint] = useState<number | null>(null);

  // Auto-play functionality for chart
  useEffect(() => {
    // Animate chart drawing
    if (chartProgress < 1) {
      const timer = setTimeout(() => {
        setChartProgress((prev) => Math.min(prev + 0.05, 1));
      }, 100);
      return () => clearTimeout(timer);
    }

    // After chart is drawn, highlight points
    if (chartProgress >= 1) {
      const pointInterval = setInterval(() => {
        setHighlightPoint((prev) => {
          if (prev === null) return 4;
          return (prev + 2) % chartData.length;
        });
      }, 2000);

      return () => clearInterval(pointInterval);
    }
  }, [chartProgress]);

  // Generate chart path
  const chartWidth = 300;
  const chartHeight = 120;
  const pointSpacing = chartWidth / (chartData.length - 1);

  const getY = (value: number) => {
    const min = Math.min(...chartData.map((d) => d.value));
    const max = Math.max(...chartData.map((d) => d.value));
    const range = max - min;
    const normalized = (value - min) / (range || 1);
    return chartHeight - normalized * chartHeight * 0.8 - chartHeight * 0.1;
  };

  const points = chartData.map((point, i) => ({
    x: i * pointSpacing,
    y: getY(point.value),
    value: point.value,
    day: point.day,
  }));

  // Create SVG path
  let pathD = "";
  const visiblePoints = Math.ceil(chartProgress * points.length);

  for (let i = 0; i < visiblePoints; i++) {
    if (i === 0) {
      pathD += `M ${points[i].x},${points[i].y} `;
    } else {
      // Use curve for smoother line
      const prevPoint = points[i - 1];
      const currPoint = points[i];
      const controlX = (prevPoint.x + currPoint.x) / 2;
      pathD += `C ${controlX},${prevPoint.y} ${controlX},${currPoint.y} ${currPoint.x},${currPoint.y} `;
    }
  }

  return (
    <div className="flex justify-center w-full h-full overflow-hidden">
      {/* Right side - Stacked report cards */}
      <div className="flex flex-col justify-between p-6 w-1/2 h-2/3">
        <div className="text-center">
          <div className="inline-block bg-primary/10 px-3 py-1 rounded-full font-medium text-primary text-xs">
            Average attendance: 85%
          </div>
        </div>
        <div className="flex justify-center items-center">
          <div className="relative w-[300px] h-[150px]">
            {/* Chart */}
            <svg
              width={chartWidth}
              height={chartHeight}
              className="overflow-visible"
            >
              {/* Horizontal grid lines */}
              {[0, 1, 2, 3].map((i) => (
                <line
                  key={i}
                  x1="0"
                  y1={i * (chartHeight / 3)}
                  x2={chartWidth}
                  y2={i * (chartHeight / 3)}
                  stroke="currentColor"
                  strokeOpacity="0.1"
                  strokeWidth="1"
                />
              ))}

              {/* Chart line */}
              <motion.path
                d={pathD}
                fill="none"
                stroke="hsl(var(--primary))"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
                initial={{ pathLength: 0 }}
                animate={{ pathLength: chartProgress }}
                transition={{ duration: 1.5, ease: "easeInOut" }}
              />

              {/* Data points */}
              {points.slice(0, visiblePoints).map((point, i) => (
                <motion.circle
                  key={i}
                  cx={point.x}
                  cy={point.y}
                  r={highlightPoint === i ? 4 : 3}
                  fill={"hsl(var(--primary))"}
                  initial={{ opacity: 0 }}
                  animate={{
                    opacity: 1,
                    r: highlightPoint === i ? [3, 5, 4] : 3,
                  }}
                  transition={{
                    opacity: { delay: i * 0.05 },
                    r: { duration: 0.5, repeat: highlightPoint === i ? 1 : 0 },
                  }}
                />
              ))}

              {/* Highlighted point label */}
              {highlightPoint !== null && highlightPoint < visiblePoints && (
                <motion.g
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ duration: 0.2 }}
                >
                  <rect
                    x={points[highlightPoint].x - 20}
                    y={points[highlightPoint].y - 35}
                    width="40"
                    height="25"
                    rx="4"
                    fill="hsl(var(--primary))"
                  />
                  <text
                    x={points[highlightPoint].x}
                    y={points[highlightPoint].y - 18}
                    textAnchor="middle"
                    fontSize="12"
                    fill="white"
                    fontWeight="bold"
                  >
                    {points[highlightPoint].value}%
                  </text>
                  <text
                    x={points[highlightPoint].x}
                    y={points[highlightPoint].y + 20}
                    textAnchor="middle"
                    fontSize="10"
                    fill="currentColor"
                    className="text-muted-foreground"
                  >
                    {points[highlightPoint].day}
                  </text>
                </motion.g>
              )}
            </svg>

            {/* Y-axis labels */}
            <div className="top-0 left-0 absolute flex flex-col justify-between h-full text-muted-foreground text-xs">
              <div>100%</div>
              <div>75%</div>
              <div>50%</div>
              <div>0%</div>
            </div>
          </div>
        </div>
      </div>

      {/* left side - Animated chart */}
      <div className="flex flex-col justify-center p-2 w-1/2">
        <CardStack items={CARDS} offset={10} scaleFactor={0.1} />
      </div>
    </div>
  );
}
