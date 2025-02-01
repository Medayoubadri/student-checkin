"use client";

import { useState, useEffect } from "react";
import { ChevronLeft, ChevronRight, X } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { DownloadAttendance } from "./DownloadAttendance";
import { useTranslations } from "next-intl";
import { Calendar } from "@/components/ui/calendar";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { Skeleton } from "@/components/ui/skeleton";
import { toast } from "@/hooks/use-toast";

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

  useEffect(() => {
    fetchAttendanceData(currentDate);
  }, [currentDate, refreshTrigger]);

  const fetchAttendanceData = async (date: Date) => {
    setIsLoading(true);
    try {
      const dailyResponse = await fetch(`/api/attendance/daily?date=${date}`);
      if (!dailyResponse.ok) {
        throw new Error("Failed to fetch daily attendance data");
      }
      const presentStudents = await dailyResponse.json();

      if (presentStudents.length === 0) {
        setAttendanceData([]);
        setIsLoading(false);
        return;
      }

      const totalAttendancePromises = presentStudents.map(
        async (student: { id: string }) => {
          const totalResponse = await fetch(
            `/api/attendance/total?studentId=${student.id}`
          );
          if (!totalResponse.ok) {
            throw new Error("Failed to fetch total attendance data");
          }
          return totalResponse.json();
        }
      );

      const totalAttendances = await Promise.all(totalAttendancePromises);

      const formattedData: AttendanceEntry[] = presentStudents.map(
        (
          student: { id: string; name: string; createdAt: string },
          index: number
        ) => ({
          fullName: student.name,
          id: student.id,
          dailyAttendance: 1, // Since we're only getting present students
          totalAttendance: totalAttendances[index].total,
          createdAt: student.createdAt,
        })
      );

      setAttendanceData(formattedData);
      setIsLoading(false);
    } catch (error) {
      console.error("Error fetching attendance data:", error);
      setIsLoading(false);
    }
  };

  const isNewStudent = (createdAt: string) => {
    const oneWeekAgo = new Date();
    oneWeekAgo.setDate(oneWeekAgo.getDate() - 1);
    return new Date(createdAt) >= oneWeekAgo;
  };

  const navigateDate = (direction: "prev" | "next") => {
    setCurrentDate((prev) => {
      const newDate = new Date(prev);
      newDate.setDate(prev.getDate() + (direction === "next" ? 1 : -1));
      return newDate;
    });
  };

  const formatDate = t("dateFormat", {
    date: currentDate,
    weekday: "",
    day: "none",
    month: "long",
  });

  const handleRemoveAttendance = async (studentId: string) => {
    try {
      const response = await fetch(`/api/attendance/remove`, {
        method: "DELETE",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ studentId, date: currentDate }),
      });

      if (response.ok) {
        toast({
          title: t("attendanceRemoved"),
          description: t("attendanceRemovedDescription"),
          variant: "success",
        });
        fetchAttendanceData(currentDate);
        onAttendanceRemoved();
      } else {
        throw new Error("Failed to remove attendance");
      }
    } catch (error) {
      console.error("Error removing attendance:", error);
      toast({
        title: t("errorRemovingAttendance"),
        description: t("errorRemovingAttendanceDescription"),
        variant: "destructive",
      });
    }
  };

  return (
    <Card className="flex flex-col bg-background w-full h-[300px]">
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
                <CardTitle className="text-sm sm:text-base cursor-pointer">
                  {formatDate}
                </CardTitle>
              </PopoverTrigger>
              <PopoverContent className="p-0 w-auto" align="start">
                <Calendar
                  mode="single"
                  selected={currentDate}
                  onSelect={(date) => {
                    if (date) {
                      setCurrentDate(date);
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
          <div className="flex justify-center items-center h-full text-muted-foreground">
            {t("noAttendanceRecords")}
          </div>
        )}
      </CardContent>
    </Card>
  );
}
