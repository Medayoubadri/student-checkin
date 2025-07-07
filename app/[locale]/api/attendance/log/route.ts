import { NextRequest, NextResponse } from "next/server";
import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

export async function GET(request: NextRequest) {
  try {
    const searchParams = request.nextUrl.searchParams;
    const studentId = searchParams.get("studentId");

    if (!studentId) {
      return NextResponse.json(
        { error: "Student ID is required" },
        { status: 400 }
      );
    }

    // Query the database for attendance records for the specific student
    // Order by date descending to get the most recent attendances first
    const attendanceRecords = await prisma.attendance.findMany({
      where: {
        studentId: studentId,
      },
      select: {
        id: true,
        date: true,
        studentId: true,
      },
      orderBy: {
        date: "desc",
      },
    });

    return NextResponse.json({
      attendanceRecords,
    });
  } catch (error) {
    console.error("Error fetching attendance records:", error);
    return NextResponse.json(
      { error: "Failed to fetch attendance records" },
      { status: 500 }
    );
  }
}
