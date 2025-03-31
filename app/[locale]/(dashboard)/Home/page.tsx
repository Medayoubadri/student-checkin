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

// Main component for the Home page
// This component fetches and displays various metrics related to student attendance
// It includes a check-in feature, attendance log, and a chart for visualizing attendance data
// It also handles optimistic updates for the metrics and refreshes the data periodically
// The component uses the `useSession` hook to manage user authentication state
// It also uses the `useTranslations` hook for internationalization
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
    // Invalidate cache before fetching new data
    metricsService.invalidateCache();
    attendanceHistoryService.invalidateCache();
    attendanceLogService.invalidateTotalCache();
    try {
      const metricsdata = await metricsService.getMetrics();
      const attendanceData = await attendanceHistoryService.getHistory();
      setMetrics(metricsdata);
      setAttendanceData(attendanceData);
    } catch (error) {
      console.error("Error fetching metrics:", error);
      toast({
        variant: "destructive",
        title: t("metrics-toastitle-error"),
        description: t("metrics-toasdescription-error"),
      });
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
    setTimeout(fetchMetrics, 3000); // Refresh after 3 seconds (may need to increase in production depending on the Server response time)
  };

  // Function to refresh recent activity
  const refreshRecentActivity = () => {
    setRefreshTrigger((prev) => prev + 1);
    fetchMetrics();
  };

  // Effect to fetch metrics data on component mount and user authentication
  // It also sets up an interval to fetch data every minute
  useEffect(() => {
    if (status === "authenticated") {
      fetchMetrics();
      // Schedule attendance data fetch every minute
      const interval = setInterval(fetchMetrics, 60000);
      return () => clearInterval(interval); // Cleanup interval on unmount
    }
  }, [status, fetchMetrics]);

  // Show loading skeleton while data is being fetched
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
          {/* Student Check-in component for checking in students */}
          <StudentCheckIn
            onCheckIn={() => handleOptimisticMetrics(true)}
            refreshRecentActivity={refreshRecentActivity}
          />
          {/* Attendance log component for displaying attendance records */}
          <AttendanceLog
            refreshTrigger={refreshTrigger}
            onAttendanceRemoved={fetchMetrics}
          />
        </div>
        {/* Metrics cards displaying various attendance metrics */}
        <MetricsCards metrics={metrics} />
        <div className="hidden lg:block flex-1 w-full">
          {/* Attendance chart for visualizing attendance data */}
          <AttendanceChart
            data={attendanceData}
            onDataUpdate={refreshRecentActivity}
          />
        </div>
      </div>
    </div>
  );
}
