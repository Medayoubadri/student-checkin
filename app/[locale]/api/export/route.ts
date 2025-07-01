import { NextResponse } from "next/server";
import { stringify } from "csv-stringify/sync";
import * as XLSX from "xlsx";
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

    const transformedStudents = students.map((student, index) => ({
      number: index + 1,
      fullName: student.name,
      age: student.age,
      gender: student.gender,
      phoneNumber: student.phoneNumber,
    }));

    if (format === "csv") {
      const csvData = stringify(transformedStudents, {
        header: true,
        columns: ["number", "fullName", "age", "gender", "phoneNumber"],
      });

      return new NextResponse(csvData, {
        headers: {
          "Content-Type": "text/csv",
          "Content-Disposition":
            "attachment; filename=Check-in_Mate_students-list.csv",
        },
      });
    } else {
      const worksheet = XLSX.utils.json_to_sheet(transformedStudents);

      XLSX.utils.sheet_add_aoa(
        worksheet,
        [["Number", "Full Name", "Age", "Gender", "Phone Number"]],
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
    }
  } catch (error) {
    console.error("Error exporting students:", error);
    return NextResponse.json(
      { error: "Failed to export students. Please try again later." },
      { status: 500 }
    );
  }
}
