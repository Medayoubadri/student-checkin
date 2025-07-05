"use client";

import { useState, useEffect, useCallback } from "react";
import { ChevronLeft, ChevronRight, X } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { DownloadAttendance } from "./DownloadAttendance";
import { useFormatter, useTranslations } from "next-intl";
import { Calendar } from "@/components/ui/calendar";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { Skeleton } from "@/components/ui/skeleton";
import { toast } from "@/hooks/use-toast";
import { attendanceLogService } from "@/utils/attendanceLogService";
import { attendanceHistoryService } from "@/utils/attendanceHistoryService";
import { metricsService } from "@/utils/metricsService";

interface AttendanceEntry {
  fullName: string;
  id: string;
  dailyAttendance: number;
  totalAttendance: number;
  createdAt: string;
}

interface AttendanceLogProps {
  refreshTrigger: number;
  onAttendanceRemoved: () => void;
}

export default function AttendanceLog({
  refreshTrigger,
  onAttendanceRemoved,
}: AttendanceLogProps) {
  const [currentDate, setCurrentDate] = useState(new Date());
  const [attendanceData, setAttendanceData] = useState<AttendanceEntry[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const t = useTranslations("AttendanceLog");
  const f = useFormatter();

  const fetchAttendanceData = useCallback(async () => {
    try {
      const [daily, totals] = await Promise.all([
        attendanceLogService.getDailyAttendance(currentDate),
        attendanceLogService.getTotalAttendances(
          (
            await attendanceLogService.getDailyAttendance(currentDate)
          ).map((entry) => entry.id)
        ),
      ]);

      const enrichedData = daily.map((entry) => ({
        ...entry,
        totalAttendance: totals[entry.id] || 1,
        dailyAttendance: entry.dailyAttendance,
      }));

      setAttendanceData(enrichedData);
    } catch (error) {
      console.error("Error fetching attendance data:", error);
      toast({ title: t("errorLoadingData"), variant: "destructive" });
    }
  }, [currentDate, t]);

  const isNewStudent = (createdAt: string) => {
    const oneWeekAgo = new Date();
    oneWeekAgo.setDate(oneWeekAgo.getDate() - 7);
    return new Date(createdAt) >= oneWeekAgo;
  };

  const navigateDate = (direction: "prev" | "next") => {
    setCurrentDate((prev) => {
      const newDate = new Date(prev);
      newDate.setDate(prev.getDate() + (direction === "next" ? 1 : -1));
      return newDate;
    });
  };

  // Update handleRemoveAttendance
  const handleRemoveAttendance = async (studentId: string) => {
    try {
      // Optimistic UI update
      setAttendanceData((prev) =>
        prev.filter((entry) => entry.id !== studentId)
      );
      await attendanceLogService.removeAttendance(studentId, currentDate);
      toast({
        title: t("attendanceRemoved"),
        description: t("attendanceRemovedDescription"),
        variant: "success",
      });
      setTimeout(() => {
        attendanceLogService.invalidateCache(undefined, currentDate);
        metricsService.invalidateCache();
        attendanceHistoryService.invalidateCache();
        fetchAttendanceData(); // Silent background refresh
        onAttendanceRemoved();
      }, 1000);
    } catch (error) {
      console.error("Error removing attendance:", error);
      fetchAttendanceData();
      toast({
        title: t("errorRemovingAttendance"),
        description: t("errorRemovingAttendanceDescription"),
        variant: "destructive",
      });
    }
  };

  useEffect(() => {
    setIsLoading(true);
    fetchAttendanceData().finally(() => setIsLoading(false));
  }, [refreshTrigger, fetchAttendanceData, currentDate]);

  return (
    <Card className="flex flex-col bg-background w-full h-[300px] overflow-hidden">
      <CardHeader className="py-4">
        <div className="flex justify-between items-center">
          <div className="flex items-center gap-4">
            <Button
              variant="outline"
              size="icon"
              onClick={() => navigateDate("prev")}
            >
              <ChevronLeft className="w-4 h-4" />
              <span className="sr-only">{t("previousDay")}</span>
            </Button>
            <Popover>
              <PopoverTrigger asChild>
                <CardTitle className="text-sm sm:text-base capitalize cursor-pointer">
                  {f.dateTime(currentDate, {
                    weekday: "long",
                    day: "numeric",
                    month: "long",
                  })}
                </CardTitle>
              </PopoverTrigger>
              <PopoverContent className="p-0 w-auto" align="start">
                <Calendar
                  mode="single"
                  selected={currentDate}
                  onSelect={(date) => {
                    if (date) {
                      const normalized = new Date(date);
                      normalized.setHours(0, 0, 0, 0); // Set local midnight
                      // Convert to UTC date
                      const utcDate = new Date(
                        normalized.getTime() -
                          normalized.getTimezoneOffset() * 60000
                      );
                      setCurrentDate(utcDate);
                      // Close the popover
                      const trigger = document.querySelector(
                        '[data-state="open"]'
                      );
                      if (trigger instanceof HTMLElement) {
                        trigger.click();
                      }
                    }
                  }}
                  initialFocus
                />
              </PopoverContent>
            </Popover>
            <Button
              variant="outline"
              size="icon"
              onClick={() => navigateDate("next")}
            >
              <ChevronRight className="w-4 h-4" />
              <span className="sr-only">{t("nextDay")}</span>
            </Button>
          </div>
          <DownloadAttendance selectedDate={currentDate} />
        </div>
      </CardHeader>
      <CardContent className="flex-grow px-6 overflow-y-auto">
        {isLoading ? (
          <div className="space-y-4">
            {[1, 2, 3, 4].map((i) => (
              <Skeleton
                key={i}
                className="bg-zinc-300 dark:bg-zinc-900 w-full h-8"
              />
            ))}
          </div>
        ) : attendanceData.length > 0 ? (
          attendanceData.map((entry, index) => (
            <div
              key={index}
              className="flex justify-between items-center py-2 border-b border-border last:border-b-0"
            >
              <div className="flex items-center gap-4">
                <div
                  className={`w-2 h-2 rounded-full ${
                    isNewStudent(entry.createdAt)
                      ? "bg-emerald-500"
                      : "bg-zinc-300 dark:bg-zinc-700"
                  }`}
                />
                <span className="font-medium text-sm">{entry.fullName}</span>
              </div>
              <div className="flex justify-center items-center text-muted-foreground text-sm">
                <span>
                  {t("totalAttendance", { count: entry.totalAttendance })}
                </span>
                <Button
                  variant="default"
                  onClick={() => handleRemoveAttendance(entry.id)}
                  className="bg-transparent hover:bg-transparent shadow-none w-4 h-6 text-destructive hover:text-destructive/90 hover:text-red-500"
                >
                  <X className="!w-5 !h-5" />
                  <span className="sr-only">{t("removeAttendance")}</span>
                </Button>
              </div>
            </div>
          ))
        ) : (
          <div className="flex justify-center items-center h-full text-muted-foreground text-center">
            {t("noAttendanceRecords")}
          </div>
        )}
      </CardContent>
    </Card>
  );
}
