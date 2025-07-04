import { NextResponse } from "next/server";
import { stringify } from "csv-stringify/sync";
import * as ExcelJS from "exceljs";
import { PrismaClient } from "@prisma/client";
import { getServerSession } from "next-auth/next";
import { authOptions } from "@/lib/authOptions";

const prisma = new PrismaClient();

export async function GET(request: Request) {
  const session = await getServerSession(authOptions);

  if (!session || !session.user) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const { searchParams } = new URL(request.url);
  const format = searchParams.get("format") || "csv";

  try {
    const students = await prisma.student.findMany({
      where: {
        userId: session.user.id,
      },
      orderBy: { name: "asc" },
    });

    const transformedStudents = students.map((student) => ({
      fullName: student.name,
      age: student.age,
      gender: student.gender,
      phoneNumber: student.phoneNumber,
    }));

    if (format === "csv") {
      const csvData = stringify(transformedStudents, {
        header: true,
        columns: ["fullName", "age", "gender", "phoneNumber"],
      });

      return new NextResponse(csvData, {
        headers: {
          "Content-Type": "text/csv",
          "Content-Disposition":
            "attachment; filename=Check-in_Mate_students-list.csv",
        },
      });
    } else {
      const workbook = new ExcelJS.Workbook();
      const worksheet = workbook.addWorksheet("Students");

      // Add header row
      worksheet.addRow(["Full Name", "Age", "Gender", "Phone Number"]);

      // Style header row
      worksheet.getRow(1).font = { bold: true };
      worksheet.getRow(1).alignment = {
        vertical: "middle",
        horizontal: "center",
      };

      // Add data rows
      transformedStudents.forEach((student) => {
        worksheet.addRow([
          student.fullName,
          student.age,
          student.gender,
          student.phoneNumber,
        ]);
      });

      // Auto-fit columns
      worksheet.columns.forEach((column) => {
        column.width = Math.max(column.width || 10, 15);
      });

      // Generate Excel buffer
      const buffer = await workbook.xlsx.writeBuffer();

      return new NextResponse(buffer, {
        headers: {
          "Content-Type":
            "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
          "Content-Disposition":
            "attachment; filename=Check-in_Mate_students-list.xlsx",
        },
      });
    }
  } catch (error) {
    console.error("Error exporting students:", error);
    return NextResponse.json(
      { error: "Failed to export students. Please try again later." },
      { status: 500 }
    );
  }
}
