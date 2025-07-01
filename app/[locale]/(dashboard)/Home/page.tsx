// app/(dashboard)/Home/page.tsx
"use client";

import { useState, useEffect } from "react";
import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";
import { StudentCheckIn } from "@/app/[locale]/(dashboard)/Home/components/StudentCheckIn";
import { MetricsCards } from "@/app/[locale]/(dashboard)/Home/components/MetricsCards";
import { AttendanceChart } from "@/app/[locale]/(dashboard)/Home/components/AttendanceChart";
import { RecentActivityLog } from "@/app/[locale]/(dashboard)/Home/components/RecentActivityLog";
import { useTranslations } from "next-intl";

interface Metrics {
  totalStudents: number;
  todayAttendance: number;
  averageAttendance: number;
  totalAttendance: number;
}

interface AttendanceData {
  date: string;
  attendance: number;
}

export default function HomePage() {
  const { status } = useSession();
  const router = useRouter();
  const t = useTranslations("HomePage");
  const [metrics, setMetrics] = useState<Metrics>({
    totalStudents: 0,
    todayAttendance: 0,
    averageAttendance: 0,
    totalAttendance: 0,
  });
  const [attendanceData, setAttendanceData] = useState<AttendanceData[]>([]);
  const [refreshTrigger, setRefreshTrigger] = useState(0);

  useEffect(() => {
    fetchMetrics();
    fetchAttendanceData();
  }, []);

  const fetchMetrics = async () => {
    try {
      const response = await fetch("/api/metrics");
      const data = await response.json();
      setMetrics(data);
    } catch (error) {
      console.error("Error fetching metrics:", error);
    }
  };

  const fetchAttendanceData = async () => {
    try {
      const response = await fetch("/api/attendance/history");
      const data = await response.json();
      setAttendanceData(data);
    } catch (error) {
      console.error("Error fetching attendance data:", error);
    }
  };

  const refreshRecentActivity = () => {
    setRefreshTrigger((prev) => prev + 1);
  };

  if (status === "loading") {
    return (
      <div className="flex justify-center items-center w-full h-full">
        {t("loading")}
      </div>
    );
  }

  if (status === "unauthenticated") {
    router.push("/auth/signin");
    return null;
  }

  return (
    <div className="flex flex-col items-center gap-4 md:mt-0 p-4 md:p-6 w-full h-full overflow-y-auto">
      <h1 className="w-full lg:max-w-7xl font-bold text-2xl md:text-4xl">
        {t("title")}
      </h1>
      <div className="flex flex-col items-center gap-4 w-full lg:max-w-7xl">
        <div className="flex lg:flex-row flex-col gap-4 w-full">
          <StudentCheckIn
            onCheckIn={() => {
              fetchMetrics();
              fetchAttendanceData();
            }}
            refreshRecentActivity={refreshRecentActivity}
          />
          <RecentActivityLog refreshTrigger={refreshTrigger} />
        </div>
        <MetricsCards metrics={metrics} />
        <div className="lg:block flex-1 hidden w-full">
          <AttendanceChart data={attendanceData} />
        </div>
      </div>
    </div>
  );
}
