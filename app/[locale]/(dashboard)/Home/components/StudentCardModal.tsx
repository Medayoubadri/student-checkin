"use client";

import type React from "react";

import { useState, useEffect } from "react";
import Image from "next/image";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Edit,
  Phone,
  User2Icon,
  Calendar,
  CheckCircle2,
  BarChart3,
} from "lucide-react";
import { studentService } from "@/utils/studentService";
import { useFormatter, useTranslations } from "next-intl";
import type { Student } from "@/types/import";
import { toast } from "@/hooks/use-toast";
import { cn } from "@/lib/utils";

// Add attendance type definition
interface AttendanceRecord {
  id: string;
  date: string;
  studentId: string;
}

interface StudentCardModalProps {
  studentId: string;
  open: boolean;
  totalAttendance: number;
  onOpenChange: (open: boolean) => void;
}

export function StudentCardModal({
  studentId,
  open,
  totalAttendance,
  onOpenChange,
}: StudentCardModalProps) {
  const [isEditing, setIsEditing] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [isSaving, setIsSaving] = useState(false);
  const [studentData, setStudentData] = useState<Student | null>(null);
  const [originalData, setOriginalData] = useState<Student | null>(null);
  const [attendanceHistory, setAttendanceHistory] = useState<
    AttendanceRecord[]
  >([]);
  const [activeTab, setActiveTab] = useState<"summary" | "history">("summary");
  const t = useTranslations("StudentCardModal");
  const format = useFormatter();

  useEffect(() => {
    if (open && studentId) {
      const fetchStudentData = async () => {
        setIsLoading(true);
        try {
          // Fetch student details
          const students = await studentService.getStudents();
          const student = students.find((s) => s.id === studentId);

          if (student) {
            const normalizedGender = student.gender
              ? (student.gender.toLowerCase() as "male" | "female" | "")
              : "";

            const studentData = {
              id: student.id,
              name: student.name,
              age: student.age,
              gender: normalizedGender,
              phoneNumber: student.phoneNumber || "",
              image: student.image,
              createdAt: student.createdAt,
            };
            setStudentData(studentData);
            setOriginalData(studentData);

            // Fetch attendance history for the student using the new endpoint
            try {
              const response = await fetch(
                `/api/attendance/log?studentId=${studentId}`
              );
              if (response.ok) {
                const data = await response.json();
                setAttendanceHistory(data.attendanceRecords || []);
              } else {
                throw new Error("Failed to fetch attendance history");
              }
            } catch (error) {
              console.error("Error fetching attendance history:", error);
              toast({
                title: t("errorFetchingAttendance"),
                description: t("errorFetchingAttendanceDescription"),
                variant: "destructive",
              });
            }
          }
        } catch (error) {
          console.error("Error fetching student data:", error);
          toast({
            title: t("errorFetchingData"),
            description: t("errorFetchingDataDescription"),
            variant: "destructive",
          });
        } finally {
          setIsLoading(false);
        }
      };

      fetchStudentData();
    }
  }, [studentId, open, t, totalAttendance]);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    if (studentData) {
      setStudentData((prev) => (prev ? { ...prev, [name]: value } : null));
    }
  };

  const handleGenderChange = (value: "male" | "female" | "") => {
    if (studentData) {
      setStudentData((prev) => (prev ? { ...prev, gender: value } : null));
    }
  };

  const handleSave = async () => {
    if (!studentData) return;

    setIsSaving(true);
    try {
      // Call the API to update the student
      const response = await fetch(`/api/students`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          id: studentData.id,
          name: studentData.name,
          age: Number(studentData.age),
          gender: studentData.gender || null,
          phoneNumber: studentData.phoneNumber,
          image: studentData.image,
        }),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || t("errorUpdatingStudent"));
      }

      // Update was successful
      toast({
        title: t("studentUpdated"),
        description: t("studentUpdatedDescription"),
        variant: "success",
      });

      // Invalidate cache to ensure fresh data on next load
      studentService.invalidateCache();
      setIsEditing(false);

      // Update the original data
      setOriginalData(studentData);
    } catch (error) {
      console.error("Error updating student:", error);
      toast({
        title: t("errorUpdatingStudent"),
        description:
          error instanceof Error
            ? error.message
            : t("errorUpdatingStudentDescription"),
        variant: "destructive",
      });
    } finally {
      setIsSaving(false);
    }
  };

  const handleCancel = () => {
    // Reset to original data
    setStudentData(originalData);
    setIsEditing(false);
  };

  // Helper function to get the translated gender text
  const getGenderText = (gender: string | undefined | null) => {
    if (!gender) return t("notSpecified");
    return t(gender.toLowerCase());
  };

  // Group attendance records by month
  const groupAttendanceByMonth = () => {
    const grouped: Record<string, AttendanceRecord[]> = {};

    attendanceHistory.forEach((record) => {
      const date = new Date(record.date);
      const monthYear = new Intl.DateTimeFormat("en-US", {
        month: "long",
        year: "numeric",
      }).format(date);

      if (!grouped[monthYear]) {
        grouped[monthYear] = [];
      }

      grouped[monthYear].push(record);
    });

    return grouped;
  };

  // Calculate attendance statistics
  const calculateAttendanceStats = () => {
    if (!attendanceHistory.length) return { percentage: 0, streak: 0 };

    // Sort dates in ascending order
    const sortedDates = [...attendanceHistory]
      .map((record) => new Date(record.date))
      .sort((a, b) => a.getTime() - b.getTime());

    // Calculate current streak
    let streak = 1;
    for (let i = 1; i < sortedDates.length; i++) {
      const prevDate = sortedDates[i - 1];
      const currDate = sortedDates[i];

      // Check if dates are consecutive
      const diffTime = Math.abs(currDate.getTime() - prevDate.getTime());
      const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));

      if (diffDays === 1) {
        streak++;
      } else {
        break;
      }
    }

    return {
      percentage: Math.min(100, Math.round((totalAttendance / 50) * 100)),
      streak,
    };
  };

  const stats = calculateAttendanceStats();
  const groupedAttendance = groupAttendanceByMonth();

  if (isLoading || !studentData) {
    return (
      <Dialog open={open} onOpenChange={onOpenChange}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle>{t("loadingStudentInfo")}</DialogTitle>
          </DialogHeader>
          <div className="space-y-6 py-6">
            {/* Skeleton for profile image and name */}
            <div className="flex sm:flex-row flex-col items-center gap-4">
              <div className="bg-muted rounded-full w-24 h-24 animate-pulse"></div>
              <div className="w-full">
                <div className="bg-muted mb-2 rounded w-3/4 h-6 animate-pulse"></div>
                <div className="flex sm:flex-row flex-col sm:gap-4">
                  <div className="bg-muted rounded w-20 h-4 animate-pulse"></div>
                  <div className="bg-muted rounded w-24 h-4 animate-pulse"></div>
                </div>
                <div className="bg-muted mt-2 rounded w-32 h-4 animate-pulse"></div>
              </div>
            </div>

            {/* Skeleton for tabs */}
            <div className="pt-4 border-t">
              <div className="flex mb-4">
                <div className="flex-1 bg-muted mx-1 rounded h-8 animate-pulse"></div>
                <div className="flex-1 bg-muted mx-1 rounded h-8 animate-pulse"></div>
              </div>

              {/* Skeleton for content */}
              <div className="gap-3 grid grid-cols-2 mb-4">
                <div className="bg-muted rounded-lg h-24 animate-pulse"></div>
                <div className="bg-muted rounded-lg h-24 animate-pulse"></div>
              </div>

              <div className="bg-muted mb-4 rounded-lg h-16 animate-pulse"></div>

              <div className="space-y-2">
                <div className="bg-muted rounded h-10 animate-pulse"></div>
                <div className="bg-muted rounded h-10 animate-pulse"></div>
                <div className="bg-muted rounded h-10 animate-pulse"></div>
              </div>
            </div>
          </div>
        </DialogContent>
      </Dialog>
    );
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>
            {isEditing ? t("editStudentInfo") : t("studentInfo")}
          </DialogTitle>
        </DialogHeader>

        <div className="space-y-4 py-4">
          {!isEditing ? (
            // View Mode
            <>
              <div className="flex sm:flex-row flex-col items-center gap-4">
                <div className="relative flex justify-center items-center bg-muted rounded-full w-24 h-24 overflow-hidden">
                  {studentData.image ? (
                    <Image
                      src={studentData.image || "/placeholder.svg"}
                      alt={studentData.name}
                      width={100}
                      height={100}
                      className="object-cover"
                    />
                  ) : (
                    <User2Icon
                      className={cn(
                        "p-2 w-24 h-24",
                        studentData.gender === "female"
                          ? "text-rose-500"
                          : studentData.gender === "male"
                          ? "text-blue-800"
                          : ""
                      )}
                    />
                  )}
                </div>
                <div className="sm:text-left text-center">
                  <h3 className="mb-2 font-bold text-xl">{studentData.name}</h3>
                  <div className="flex sm:flex-row flex-col sm:gap-4 text-muted-foreground text-sm">
                    <span>
                      {t("age")}: {studentData.age}
                    </span>
                    <span>
                      {t("gender")}: {getGenderText(studentData.gender)}
                    </span>
                  </div>
                  <div className="flex items-center gap-2 mt-1 text-muted-foreground text-sm">
                    <Phone className="w-4 h-4" />
                    <span>{studentData.phoneNumber}</span>
                  </div>
                </div>
              </div>

              <div className="pt-4 border-t">
                {/* Attendance Tabs */}
                <div className="flex mb-4">
                  <Button
                    variant="link"
                    className={cn(
                      "pb-2 px-4 text-sm font-medium flex flex-1 items-center gap-1.5 !no-underline",
                      activeTab === "summary"
                        ? "border-b-2 border-primary text-primary"
                        : "text-muted-foreground hover:text-foreground transition-colors"
                    )}
                    onClick={() => setActiveTab("summary")}
                  >
                    <BarChart3 className="w-4 h-4" />
                    {t("summary")}
                  </Button>
                  <Button
                    variant="link"
                    className={cn(
                      "pb-2 px-4 text-sm font-medium flex flex-1 items-center gap-1.5 text-center !no-underline",
                      activeTab === "history"
                        ? "border-b-2 border-primary text-primary"
                        : "text-muted-foreground hover:text-foreground transition-colors"
                    )}
                    onClick={() => setActiveTab("history")}
                  >
                    <Calendar className="w-4 h-4" />
                    {t("history")}
                  </Button>
                </div>

                {activeTab === "summary" ? (
                  // Summary Tab
                  <>
                    {/* Attendance Stats Cards */}
                    <div className="gap-3 grid grid-cols-2 mb-4">
                      <div className="flex flex-col items-center bg-muted/50 p-3 rounded-lg">
                        <div className="mb-1 text-muted-foreground text-xs">
                          {t("totalAttendance")}
                        </div>
                        <div className="font-bold text-2xl">
                          {totalAttendance}
                        </div>
                        <div className="text-muted-foreground text-xs">
                          {t("days")}
                        </div>
                      </div>

                      <div className="flex flex-col items-center bg-muted/50 p-3 rounded-lg">
                        <div className="mb-1 text-muted-foreground text-xs">
                          {t("currentStreak")}
                        </div>
                        <div className="font-bold text-2xl">{stats.streak}</div>
                        <div className="text-muted-foreground text-xs">
                          {t("consecutiveDays")}
                        </div>
                      </div>
                    </div>

                    {/* Attendance Progress */}
                    <div className="bg-muted/50 mb-4 p-4 rounded-lg">
                      <div className="flex justify-between items-center mb-1">
                        <span className="font-medium text-sm">
                          {t("attendanceProgress")}
                        </span>
                        <span className="font-bold text-sm">
                          {stats.percentage}%
                        </span>
                      </div>

                      {/* Progress Bar */}
                      <div className="bg-muted mb-1 rounded-full h-2.5">
                        <div
                          className={cn(
                            "rounded-full h-2.5 transition-all duration-500",
                            stats.percentage >= 75
                              ? "bg-green-500"
                              : stats.percentage >= 50
                              ? "bg-amber-500"
                              : "bg-red-500"
                          )}
                          style={{ width: `${stats.percentage}%` }}
                        ></div>
                      </div>

                      <div className="mt-1 text-muted-foreground text-xs text-center">
                        {t("targetAttendance", { target: 50 })}
                      </div>
                    </div>

                    {/* Recent Attendance */}
                  </>
                ) : (
                  // History Tab
                  <div className="pr-1 max-h-[300px] overflow-y-auto">
                    {Object.entries(groupedAttendance).length > 0 ? (
                      Object.entries(groupedAttendance).map(
                        ([monthYear, records]) => (
                          <div key={monthYear} className="mb-4">
                            <h5 className="top-0 sticky bg-background mb-2 py-1 font-medium text-sm">
                              {monthYear}{" "}
                              <span className="text-muted-foreground">
                                ({records.length} {t("days")})
                              </span>
                            </h5>
                            <div className="space-y-2">
                              {records.map((record) => (
                                <div
                                  key={record.id}
                                  className="flex justify-between items-center bg-muted/30 p-2 rounded-md"
                                >
                                  <span className="text-sm">
                                    {format.dateTime(new Date(record.date), {
                                      weekday: "long",
                                      day: "numeric",
                                      month: "long",
                                      year: "numeric",
                                    })}
                                  </span>
                                  <CheckCircle2 className="w-4 h-4 text-green-500" />
                                </div>
                              ))}
                            </div>
                          </div>
                        )
                      )
                    ) : (
                      <div className="py-8 text-muted-foreground text-sm text-center">
                        {t("noAttendanceRecords")}
                      </div>
                    )}
                  </div>
                )}
              </div>
            </>
          ) : (
            // Edit Mode
            <>
              <div className="flex flex-col items-center gap-4">
                <div className="relative flex justify-center items-center rounded-full outline w-24 h-24 overflow-hidden">
                  {studentData.image ? (
                    <Image
                      src={studentData.image || "/placeholder.svg"}
                      alt={studentData.name}
                      width={100}
                      height={100}
                      className="bg-muted object-cover"
                    />
                  ) : (
                    <User2Icon className="bg-muted p-2 w-24 h-24" />
                  )}
                </div>
                <Button variant="outline" size="sm">
                  {t("changePhoto")}
                </Button>
              </div>

              <div className="gap-4 grid">
                <div className="gap-2 grid">
                  <Label htmlFor="name">{t("fullName")}</Label>
                  <Input
                    id="name"
                    name="name"
                    value={studentData.name}
                    onChange={handleInputChange}
                  />
                </div>

                <div className="gap-4 grid grid-cols-2">
                  <div className="gap-2 grid">
                    <Label htmlFor="age">{t("age")}</Label>
                    <Input
                      id="age"
                      name="age"
                      type="number"
                      value={studentData.age}
                      onChange={(e) =>
                        setStudentData((prev) =>
                          prev
                            ? {
                                ...prev,
                                age: Number.parseInt(e.target.value) || 0,
                              }
                            : null
                        )
                      }
                    />
                  </div>

                  <div className="gap-2 grid">
                    <Label htmlFor="gender">{t("gender")}</Label>
                    <Select
                      value={studentData.gender}
                      onValueChange={handleGenderChange}
                    >
                      <SelectTrigger id="gender">
                        <SelectValue placeholder={t("selectGender")} />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="male">{t("male")}</SelectItem>
                        <SelectItem value="female">{t("female")}</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </div>

                <div className="gap-2 grid">
                  <Label htmlFor="phoneNumber">{t("phoneNumber")}</Label>
                  <Input
                    id="phoneNumber"
                    name="phoneNumber"
                    value={studentData.phoneNumber}
                    onChange={handleInputChange}
                  />
                </div>
              </div>
            </>
          )}
        </div>

        <div className="flex justify-end gap-2">
          {isEditing ? (
            <>
              <Button
                variant="outline"
                onClick={handleCancel}
                disabled={isSaving}
              >
                {t("cancel")}
              </Button>
              <Button onClick={handleSave} disabled={isSaving}>
                {isSaving ? t("saving") : t("saveChanges")}
              </Button>
            </>
          ) : (
            <Button onClick={() => setIsEditing(true)} className="gap-2">
              <Edit className="w-4 h-4" />
              {t("edit")}
            </Button>
          )}
        </div>
      </DialogContent>
    </Dialog>
  );
}
