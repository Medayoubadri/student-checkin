import { NextResponse } from "next/server";
import { PrismaClient } from "@prisma/client";
import * as XLSX from "xlsx";

const prisma = new PrismaClient();

export async function GET() {
  try {
    // Get today's date
    const today = new Date();
    today.setHours(0, 0, 0, 0);

    // Fetch today's attendance records with student details
    const attendanceRecords = await prisma.attendance.findMany({
      where: {
        date: {
          gte: today,
          lt: new Date(today.getTime() + 24 * 60 * 60 * 1000),
        },
      },
      include: {
        student: true,
      },
    });

    // Prepare data for XLSX
    const data = attendanceRecords.map((record) => ({
      "Student Name": record.student.name,
      Age: record.student.age,
      Gender: record.student.gender,
      "Check-in Time": record.createdAt.toLocaleTimeString(),
    }));

    // Create workbook and worksheet
    const wb = XLSX.utils.book_new();
    const ws = XLSX.utils.json_to_sheet(data);

    // Add worksheet to workbook
    XLSX.utils.book_append_sheet(wb, ws, "Attendance");

    // Generate XLSX file
    const xlsxBuffer = XLSX.write(wb, { type: "buffer", bookType: "xlsx" });

    // Set headers for file download
    const headers = new Headers();
    headers.append(
      "Content-Disposition",
      `attachment; filename="attendance_${
        today.toISOString().split("T")[0]
      }.xlsx"`
    );
    headers.append(
      "Content-Type",
      "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet"
    );

    // Return the XLSX file
    return new NextResponse(xlsxBuffer, { status: 200, headers });
  } catch (error) {
    console.error("Error exporting attendance:", error);
    return NextResponse.json(
      { error: "Failed to export attendance" },
      { status: 500 }
    );
  }
}
