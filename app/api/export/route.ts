import { NextResponse } from "next/server";
import { stringify } from "csv-stringify/sync";
import * as XLSX from "xlsx";
import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const format = searchParams.get("format") || "csv";

  try {
    const students = await prisma.student.findMany({
      orderBy: { name: "asc" },
    });

    // Transform the data
    const transformedStudents = students.map((student, index) => ({
      number: index + 1,
      fullName: student.name,
      age: student.age,
      gender: student.gender,
    }));

    if (format === "csv") {
      const csvData = stringify(transformedStudents, {
        header: true,
        columns: ["number", "fullName", "age", "gender"],
      });

      return new NextResponse(csvData, {
        headers: {
          "Content-Type": "text/csv",
          "Content-Disposition":
            "attachment; filename=Check-in_Mate_students-list.csv",
        },
      });
    } else if (format === "xlsx") {
      const worksheet = XLSX.utils.json_to_sheet(transformedStudents);

      // Rename the headers
      XLSX.utils.sheet_add_aoa(
        worksheet,
        [["Number", "Full Name", "Age", "Gender"]],
        { origin: "A1" }
      );

      const workbook = XLSX.utils.book_new();
      XLSX.utils.book_append_sheet(workbook, worksheet, "Students");
      const excelBuffer = XLSX.write(workbook, {
        bookType: "xlsx",
        type: "array",
      });

      return new NextResponse(excelBuffer, {
        headers: {
          "Content-Type":
            "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
          "Content-Disposition":
            "attachment; filename=Check-in_Mate_students-list.xlsx",
        },
      });
    } else {
      return NextResponse.json(
        { error: "Invalid format specified" },
        { status: 400 }
      );
    }
  } catch (error) {
    console.error("Error exporting students:", error);
    return NextResponse.json(
      { error: "Failed to export students" },
      { status: 500 }
    );
  }
}
