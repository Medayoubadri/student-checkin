import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { useCountAnimation } from "@/hooks/useCountAnimation";
import {
  CalendarDays,
  ClipboardCheckIcon,
  PercentIcon,
  Users2Icon,
} from "lucide-react";
import { useTranslations } from "next-intl";

interface Metrics {
  totalStudents: number;
  todayAttendance: number;
  averageAttendance: number;
  totalAttendance: number;
}

interface MetricsCardsProps {
  metrics: Metrics;
}

export function MetricsCards({ metrics }: MetricsCardsProps) {
  const t = useTranslations("MetricsCards");

  const animatedTotalStudents = useCountAnimation(metrics.totalStudents);
  const animatedTodayAttendance = useCountAnimation(metrics.todayAttendance);
  const animatedAverageAttendance = useCountAnimation(
    metrics.averageAttendance
  );
  const animatedTotalAttendance = useCountAnimation(metrics.totalAttendance);

  return (
    <div className="gap-4 grid grid-cols-2 lg:grid-cols-4 w-full">
      <Card className="bg-background">
        <CardHeader className="p-4">
          <CardTitle className="flex justify-between items-center text-sm sm:text-base">
            {t("totalStudents")}
            <Users2Icon className="ml-2 w-6 h-6" />
          </CardTitle>
        </CardHeader>
        <CardContent className="p-4 pt-0">
          <p className="font-bold tabular-nums text-2xl sm:text-3xl">
            {animatedTotalStudents}
          </p>
        </CardContent>
      </Card>
      <Card className="bg-background">
        <CardHeader className="p-4">
          <CardTitle className="flex justify-between items-center text-sm sm:text-base">
            {t("todayAttendance")}
            <CalendarDays className="ml-2 w-6 h-6" />
          </CardTitle>
        </CardHeader>
        <CardContent className="p-4 pt-0">
          <p className="font-bold tabular-nums text-2xl sm:text-3xl">
            {animatedTodayAttendance}
          </p>
        </CardContent>
      </Card>
      <Card className="hidden md:block bg-background">
        <CardHeader className="p-4">
          <CardTitle className="flex justify-between items-center text-sm sm:text-base">
            {t("averageAttendance")}
            <PercentIcon className="ml-2 w-6 h-6" />
          </CardTitle>
        </CardHeader>
        <CardContent className="p-4 pt-0">
          <p className="font-bold tabular-nums text-2xl sm:text-3xl">
            {animatedAverageAttendance}%
          </p>
        </CardContent>
      </Card>
      <Card className="hidden md:block bg-background">
        <CardHeader className="p-4">
          <CardTitle className="flex justify-between items-center text-sm sm:text-base">
            {t("totalAttendance")}
            <ClipboardCheckIcon className="ml-2 w-6 h-6" />
          </CardTitle>
        </CardHeader>
        <CardContent className="p-4 pt-0">
          <p className="font-bold tabular-nums text-2xl sm:text-3xl">
            {animatedTotalAttendance}
          </p>
        </CardContent>
      </Card>
    </div>
  );
}
