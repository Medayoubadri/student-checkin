import { useState } from "react";
import { Download } from "lucide-react";
import { Button } from "@/components/ui/button";
import * as XLSX from "xlsx";

interface DownloadAttendanceProps {
  className?: string;
}

export function DownloadAttendance({ className }: DownloadAttendanceProps) {
  const [isDownloading, setIsDownloading] = useState(false);

  const downloadAttendanceReport = async () => {
    try {
      setIsDownloading(true);
      const today = new Date().toISOString().split("T")[0];
      const response = await fetch(
        `/api/attendance/daily-report?date=${today}`
      );
      const data = await response.json();

      // Prepare the data for Excel
      const worksheetData = [
        ["Chess Club Attendance Report"], // Title
        [], // Empty row for spacing
        [], // Empty row for spacing
        [`Date: ${today}`], // Date
        [], // Empty row for spacing
        ["Full Name", "Age", "Gender", "Attendance"], // Headers
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        ...data.map((record: any) => [
          record.fullName,
          record.age,
          record.gender,
          record.attendance,
        ]),
      ];

      // Create a new workbook and worksheet
      const wb = XLSX.utils.book_new();
      const ws = XLSX.utils.aoa_to_sheet(worksheetData);

      // Style the header
      ws["!merges"] = [
        { s: { r: 0, c: 0 }, e: { r: 2, c: 3 } },
        { s: { r: 3, c: 0 }, e: { r: 3, c: 3 } },
      ]; // Merge cells for title

      // Style the title cell
      const titleCell = ws[XLSX.utils.encode_cell({ r: 0, c: 0 })];
      titleCell.s = {
        font: {
          bold: true,
          size: 20, // Font size (approximately 20pt)
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
      ws["!cols"] = [
        { wch: 30 }, // Full Name
        { wch: 10 }, // Age
        { wch: 15 }, // Gender
        { wch: 15 }, // Attendance
      ];

      // Add the worksheet to the workbook
      XLSX.utils.book_append_sheet(wb, ws, "Attendance");

      // Generate the file
      XLSX.writeFile(wb, `attendance-${today}.xlsx`);
    } catch (error) {
      console.error("Error downloading attendance report:", error);
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
      className={className}
    >
      <Download className="!w-5 !h-5" />
    </Button>
  );
}
