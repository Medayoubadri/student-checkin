// app/[locale]/(dashboard)/Home/components/DownloadAttendance.tsx
"use client";

import { useState } from "react";
import { Download } from "lucide-react";
import { Button } from "@/components/ui/button";
import * as XLSX from "xlsx";
import { useTranslations } from "next-intl";
import { toast } from "@/hooks/use-toast";

interface DownloadAttendanceProps {
  selectedDate: Date;
}

export function DownloadAttendance({ selectedDate }: DownloadAttendanceProps) {
  const [isDownloading, setIsDownloading] = useState(false);
  const t = useTranslations("DownloadAttendance");

  const downloadAttendanceReport = async () => {
    try {
      setIsDownloading(true);
      // const isoDate = selectedDate.toLocaleDateString().replaceAll("/", "-");
      const formattedDate = t("dateFormat", {
        date: selectedDate,
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

      if (data.length === 0) {
        toast({
          title: t("noDataTitle"),
          description: t("noDataDescription"),
          variant: "warning",
        });
        return;
      }

      // Prepare the data for Excel
      const worksheetData = [
        [t("reportTitle")],
        [],
        [],
        [t("dateLabel", { date: formattedDate })],
        [],
        [t("fullName"), t("age"), t("gender"), t("phone")],
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        ...data.map((record: any) => [
          record.fullName,
          record.age,
          record.gender,
          record.phone,
        ]),
      ];

      // Create a new workbook and worksheet
      const wb = XLSX.utils.book_new();
      const ws = XLSX.utils.aoa_to_sheet(worksheetData);

      // Style the header
      ws["!merges"] = [
        { s: { r: 0, c: 0 }, e: { r: 2, c: 3 } },
        { s: { r: 3, c: 0 }, e: { r: 3, c: 3 } },
      ];

      // Style the title cell
      const titleCell = ws[XLSX.utils.encode_cell({ r: 0, c: 0 })];
      titleCell.s = {
        font: {
          bold: true,
          size: 20,
        },
      };

      // Style the date cell
      const dateCell = ws[XLSX.utils.encode_cell({ r: 3, c: 0 })];
      dateCell.s = {
        font: {
          bold: true,
        },
      };

      // Set column widths
      ws["!cols"] = [{ wch: 30 }, { wch: 10 }, { wch: 15 }, { wch: 15 }];

      // Add the worksheet to the workbook
      XLSX.utils.book_append_sheet(wb, ws, "Attendance");

      // Generate the file
      XLSX.writeFile(wb, `${t("attendanceFileName")}-${formattedDate}.xlsx`);

      toast({
        title: t("downloadSuccess"),
        description: t("downloadSuccessDescription"),
        variant: "success",
      });
    } catch (error) {
      console.error("Error downloading attendance report:", error);
      toast({
        title: t("downloadError"),
        description: t("downloadErrorDescription"),
        variant: "destructive",
      });
    } finally {
      setIsDownloading(false);
    }
  };

  return (
    <Button
      variant="default"
      size="sm"
      onClick={downloadAttendanceReport}
      disabled={isDownloading}
      className="gap-2 hover:border-green-600 bg-primary font-medium text-primary-foreground"
    >
      <Download className="w-5 h-5" />
      <span className="md:block hidden">{t("download")}</span>
    </Button>
  );
}
