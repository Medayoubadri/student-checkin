import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
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
  return (
    <div className="gap-4 grid grid-cols-2 lg:grid-cols-4 w-full">
      <Card className="bg-background">
        <CardHeader className="p-4">
          <CardTitle className="text-sm sm:text-base">
            {t("totalStudents")}
          </CardTitle>
        </CardHeader>
        <CardContent className="p-4 pt-0">
          <p className="font-bold text-2xl sm:text-3xl">
            {metrics.totalStudents}
          </p>
        </CardContent>
      </Card>
      <Card className="bg-background">
        <CardHeader className="p-4">
          <CardTitle className="text-sm sm:text-base">
            {t("todayAttendance")}
          </CardTitle>
        </CardHeader>
        <CardContent className="p-4 pt-0">
          <p className="font-bold text-2xl sm:text-3xl">
            {metrics.todayAttendance}
          </p>
        </CardContent>
      </Card>
      <Card className="bg-background">
        <CardHeader className="p-4">
          <CardTitle className="text-sm sm:text-base">
            {t("averageAttendance")}
          </CardTitle>
        </CardHeader>
        <CardContent className="p-4 pt-0">
          <p className="font-bold text-2xl sm:text-3xl">
            {metrics.averageAttendance}%
          </p>
        </CardContent>
      </Card>
      <Card className="bg-background">
        <CardHeader className="p-4">
          <CardTitle className="text-sm sm:text-base">
            {t("totalAttendance")}
          </CardTitle>
        </CardHeader>
        <CardContent className="p-4 pt-0">
          <p className="font-bold text-2xl sm:text-3xl">
            {metrics.totalAttendance}
          </p>
        </CardContent>
      </Card>
    </div>
  );
}
