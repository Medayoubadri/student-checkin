"use client";

import { useState, useEffect, useCallback } from "react";
import { Download, Plus, X, CalendarIcon } from "lucide-react";
import { Button } from "@/components/ui/button";
import * as ExcelJS from "exceljs";
import { saveAs } from "file-saver";
import { useFormatter, useTranslations } from "next-intl";
import { toast } from "@/hooks/use-toast";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { Calendar } from "@/components/ui/calendar";

interface DownloadAttendanceProps {
  selectedDate: Date;
}

interface DataRecords {
  fullName: string;
  age: number;
  gender: string;
  phone: string;
}

export function DownloadAttendance({ selectedDate }: DownloadAttendanceProps) {
  const [isDownloading, setIsDownloading] = useState(false);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [teachers, setTeachers] = useState<string[]>([""]);
  const [downloadDate, setDownloadDate] = useState(selectedDate);
  const t = useTranslations("DownloadAttendance");
  const format = useFormatter();

  const handleTeacherChange = (index: number, value: string) => {
    const newTeachers = [...teachers];
    newTeachers[index] = value;
    setTeachers(newTeachers);
  };

  const addTeacherField = () => {
    setTeachers([...teachers, ""]);
  };

  const removeTeacherField = (index: number) => {
    const newTeachers = teachers.filter((_, i) => i !== index);
    setTeachers(newTeachers);
  };

  const resetForm = useCallback(() => {
    setTeachers([""]);
    setDownloadDate(selectedDate);
  }, [selectedDate]);

  useEffect(() => {
    if (!isModalOpen) {
      setDownloadDate(selectedDate);
      resetForm();
    }
  }, [selectedDate, isModalOpen, resetForm]);

  const downloadAttendanceReport = async () => {
    try {
      setIsDownloading(true);
      const formattedDate = t("dateFormat", {
        date: downloadDate,
        weekday: "long",
        year: "numeric",
        month: "long",
        day: "numeric",
      });
      const response = await fetch(
        `/api/attendance/daily?date=${selectedDate}`
      );

      if (!response.ok) {
        throw new Error("Failed to fetch attendance data");
      }

      const data = await response.json();
      console.log("fetched data:", JSON.stringify(data));

      if (data.length === 0) {
        toast({
          title: t("noDataTitle"),
          description: t("noDataDescription"),
          variant: "warning",
        });
        return;
      }

      // Create a new workbook and worksheet
      const workbook = new ExcelJS.Workbook();
      const worksheet = workbook.addWorksheet(downloadDate.toDateString());

      // Add title
      worksheet.mergeCells("A1:D3");
      const titleCell = worksheet.getCell("A1");
      titleCell.value = t("reportTitle");
      titleCell.font = { bold: true, size: 16, name: "Carlito" };
      titleCell.alignment = {
        vertical: "middle",
        horizontal: "center",
        wrapText: true,
      };

      // Add date
      worksheet.mergeCells("A4:D4");
      const dateCell = worksheet.getCell("A4");
      dateCell.value = t("dateLabel", { date: formattedDate });
      dateCell.font = { bold: true, size: 12, name: "Carlito" };

      // Add teachers label
      worksheet.mergeCells("A5:B5");
      const teachersLabelCell = worksheet.getCell("A5");
      teachersLabelCell.value = t("teachersName");
      teachersLabelCell.font = { bold: true, size: 12, name: "Carlito" };

      // Add teachers list
      worksheet.mergeCells("C5:D5");
      const teachersListCell = worksheet.getCell("C5");
      teachersListCell.value = teachers.filter((t) => t).join("\n");
      teachersListCell.alignment = {
        vertical: "middle",
        horizontal: "left",
        wrapText: true,
      };

      // Create table without result details
      worksheet.addTable({
        name: "AttendanceTable",
        ref: "A7",
        columns: [
          { name: t("fullName"), filterButton: true },
          { name: t("age"), filterButton: true },
          { name: t("gender"), filterButton: true },
          { name: t("phone"), filterButton: true },
        ],
        rows: data.map((record: DataRecords) => [
          record.fullName,
          record.age,
          record.gender === "Female"
            ? "F"
            : record.gender === "Male"
            ? "M"
            : record.gender,
          record.phone,
        ]),
        style: {
          theme: "TableStyleMedium2",
          showRowStripes: true,
        },
      });

      // Style the header row
      const headerRow = worksheet.getRow(7);
      headerRow.font = { bold: true, name: "Carlito" };
      headerRow.fill = {
        type: "pattern",
        pattern: "solid",
        fgColor: { argb: "a6e2a6" },
      };

      // Set column widths
      worksheet.columns = [
        { width: 25 },
        { width: 5 },
        { width: 5 },
        { width: 10 },
      ];

      // Set row heights
      worksheet.getRow(1).height = 55; // Title row
      worksheet.getRow(5).height = 30; // Teachers label row
      teachers
        .filter((t) => t)
        .forEach((_, index) => {
          worksheet.getRow(6 + index).height = 35; // Teacher rows
        });
      worksheet.getRow(7).height = 15; // Header row

      // Generate the file
      const buffer = await workbook.xlsx.writeBuffer();
      const blob = new Blob([buffer], {
        type: "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
      });
      saveAs(blob, `${t("attendanceFileName")}-${formattedDate}.xlsx`);

      toast({
        title: t("downloadSuccess"),
        description: t("downloadSuccessDescription"),
        variant: "success",
      });

      resetForm();
    } catch (error) {
      console.error("Error downloading attendance report:", error);
      toast({
        title: t("downloadError"),
        description: t("downloadErrorDescription"),
        variant: "destructive",
      });
    } finally {
      setIsDownloading(false);
      setIsModalOpen(false);
    }
  };

  return (
    <Dialog open={isModalOpen} onOpenChange={setIsModalOpen}>
      <DialogTrigger asChild>
        <Button
          variant="default"
          size="sm"
          onClick={() => setIsModalOpen(true)}
          className="gap-2 bg-primary hover:border-green-600 font-medium text-primary-foreground"
        >
          <Download className="w-5 h-5" />
          <span className="hidden md:block">{t("download")}</span>
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[400px] md:max-w-[500px]">
        <DialogHeader>
          <DialogTitle className="mb-2 font-bold text-2xl text-center">
            {t("downloadModalTitle")}
          </DialogTitle>
        </DialogHeader>
        <div className="gap-6 grid py-4">
          <div className="flex flex-col items-center gap-2 bg-slate-200 dark:bg-zinc-950 shadow-sm p-4 rounded-lg">
            <div className="font-semibold text-3xl capitalize">
              {format.dateTime(downloadDate, {
                weekday: "long",
                day: "numeric",
              })}
            </div>
            <div className="font-medium text-muted-foreground text-lg capitalize">
              {format.dateTime(downloadDate, {
                month: "long",
                year: "numeric",
              })}
            </div>
            <Popover>
              <PopoverTrigger asChild>
                <Button variant="outline" className="mt-2">
                  <CalendarIcon className="w-4 h-4" />
                  {t("changedate")}
                </Button>
              </PopoverTrigger>
              <PopoverContent>
                <Calendar
                  mode="single"
                  selected={downloadDate}
                  onSelect={(date) => {
                    if (date) {
                      setDownloadDate(date);
                    }
                  }}
                />
              </PopoverContent>
            </Popover>
          </div>
          <div className="space-y-4">
            <Label>{t("ModalteachersLabel")}</Label>
            {teachers.map((teacher, index) => (
              <div key={index} className="flex items-center gap-2">
                <Input
                  value={teacher}
                  onChange={(e) => handleTeacherChange(index, e.target.value)}
                  placeholder={t("teacherPlaceholder", { number: index + 1 })}
                />
                {index > 0 && (
                  <Button
                    variant="outline"
                    size="icon"
                    onClick={() => removeTeacherField(index)}
                  >
                    <X className="w-4 h-4" />
                  </Button>
                )}
              </div>
            ))}
            <Button
              variant="outline"
              size="sm"
              onClick={addTeacherField}
              className="w-full"
            >
              <Plus className="mr-2 w-4 h-4" />
              {t("addTeacher")}
            </Button>
          </div>
        </div>
        <Button
          onClick={downloadAttendanceReport}
          disabled={isDownloading}
          className="w-full"
        >
          {isDownloading ? t("downloading") : t("download")}
        </Button>
      </DialogContent>
    </Dialog>
  );
}
