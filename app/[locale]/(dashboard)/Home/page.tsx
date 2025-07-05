// app/[locale]/(dashboard)/Home/page.tsx
"use client";

import { useState, useEffect, useCallback } from "react";
import { useSession } from "next-auth/react";
import { StudentCheckIn } from "@/app/[locale]/(dashboard)/Home/components/StudentCheckIn";
import { MetricsCards } from "@/app/[locale]/(dashboard)/Home/components/MetricsCards";
import { AttendanceChart } from "@/app/[locale]/(dashboard)/Home/components/AttendanceChart";
import AttendanceLog from "@/app/[locale]/(dashboard)/Home/components/AttendanceLog";
import { LoadingSkeleton } from "@/app/[locale]/(dashboard)/Home/components/LoadingSkeleton";
import { metricsService } from "@/utils/metricsService";
import { attendanceHistoryService } from "@/utils/attendanceHistoryService";
import { toast } from "@/hooks/use-toast";
import { useTranslations } from "next-intl";
import { attendanceLogService } from "@/utils/attendanceLogService";

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
  const t = useTranslations("HomePage");
  const [metrics, setMetrics] = useState<Metrics>({
    totalStudents: 0,
    todayAttendance: 0,
    averageAttendance: 0,
    totalAttendance: 0,
  });
  const [attendanceData, setAttendanceData] = useState<AttendanceData[]>([]);
  const [refreshTrigger, setRefreshTrigger] = useState(0);

  // Function to fetch metrics data
  const fetchMetrics = useCallback(async () => {
    try {
      const data = await metricsService.getMetrics();
      setMetrics(data);
    } catch (error) {
      console.error("Error fetching metrics:", error);
      toast({
        variant: "destructive",
        title: t("metrics-toastitle-error"),
        description: t("metrics-toasdescription-error"),
      });
    } finally {
      setRefreshTrigger((prev) => prev + 1);
    }
  }, [t]);

  // Function to handle optimistic metrics update
  const handleOptimisticMetrics = (newStudent = true) => {
    setMetrics((prev) => {
      const newTotalAttendance = prev.totalAttendance + 1;
      const newTodayAttendance = newStudent
        ? prev.todayAttendance + 1
        : prev.todayAttendance;

      return {
        ...prev,
        todayAttendance: newTodayAttendance,
        totalAttendance: newTotalAttendance,
        averageAttendance:
          prev.totalStudents > 0
            ? Math.round((newTotalAttendance / prev.totalStudents) * 100)
            : 0,
      };
    });

    // Defer metrics refresh to allow optimistic UI to stay visible
    setTimeout(fetchMetrics, 3000); // Refresh after 3 second (may need to increase in production)
  };

  // Function to fetch attendance data
  const fetchAttendanceData = useCallback(async () => {
    try {
      const data = await attendanceHistoryService.getHistory();
      setAttendanceData(data);
    } catch (error) {
      console.error("Error fetching attendance data:", error);
      toast({
        variant: "destructive",
        title: t("attendance-toastitle-error"),
        description: t("attendance-toasdescription-error"),
      });
    }
  }, [t]);

  const refreshRecentActivity = () => {
    attendanceHistoryService.invalidateCache();
    attendanceLogService.invalidateCache(undefined, new Date());
    fetchAttendanceData();
    setRefreshTrigger((prev) => prev + 1);
    fetchMetrics();
  };

  useEffect(() => {
    if (status === "authenticated") {
      fetchMetrics();
      fetchAttendanceData();
    }
  }, [status, fetchAttendanceData, fetchMetrics]);

  if (status === "loading") {
    return (
      <div className="flex items-center w-full">
        <LoadingSkeleton />
      </div>
    );
  }

  return (
    <div className="flex flex-col items-center gap-4 md:mt-0 p-4 md:p-6 w-full h-full overflow-y-auto">
      <div className="flex flex-col items-center gap-4 w-full lg:max-w-7xl">
        <div className="flex lg:flex-row flex-col gap-4 w-full">
          <StudentCheckIn
            onCheckIn={() => handleOptimisticMetrics(true)}
            refreshRecentActivity={refreshRecentActivity}
          />
          <AttendanceLog
            refreshTrigger={refreshTrigger}
            onAttendanceRemoved={fetchMetrics}
          />
        </div>
        <MetricsCards metrics={metrics} />
        <div className="hidden lg:block flex-1 w-full">
          <AttendanceChart data={attendanceData} />
        </div>
      </div>
    </div>
  );
}
