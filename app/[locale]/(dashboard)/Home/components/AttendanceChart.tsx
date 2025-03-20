import { XAxis, AreaChart, Area, ResponsiveContainer, YAxis } from "recharts";
import { ChartTooltip } from "@/components/ui/chart";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { useTranslations } from "next-intl";
import { CustomTooltip } from "./CustomTooltip";

interface AttendanceData {
  date: string;
  attendance: number;
}

interface AttendanceChartProps {
  data: AttendanceData[];
  onDataUpdate: () => void;
}

export function AttendanceChart({ data }: AttendanceChartProps) {
  const t = useTranslations("AttendanceChart");
  return (
    <Card className="bg-background w-full">
      <CardHeader>
        <CardTitle>{t("title")}</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="h-[300px]">
          <ResponsiveContainer width="100%" height="100%">
            <AreaChart
              data={data}
              margin={{ top: 10, right: 30, left: 0, bottom: 0 }}
            >
              <defs>
                <linearGradient id="colorUv" x1="0" y1="0" x2="0" y2="0.9">
                  <stop offset="1%" stopColor="#18af52" stopOpacity={0.8} />
                  <stop offset="100%" stopColor="#18af52" stopOpacity={0.04} />
                </linearGradient>
              </defs>
              <XAxis dataKey="date" />
              <YAxis />
              <ChartTooltip cursor={false} content={<CustomTooltip />} />
              <Area
                type="monotone"
                dataKey="attendance"
                stroke="#18af52"
                strokeWidth={2}
                fill="url(#colorUv)"
                name="Attendance"
                isAnimationActive={true}
                animationDuration={500}
              />
            </AreaChart>
          </ResponsiveContainer>
        </div>
      </CardContent>
    </Card>
  );
}
