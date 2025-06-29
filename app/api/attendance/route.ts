import { NextResponse } from "next/server";
import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

export async function POST(request: Request) {
  const { studentId } = await request.json();
  const today = new Date();
  today.setHours(0, 0, 0, 0);

  try {
    const existingAttendance = await prisma.attendance.findFirst({
      where: {
        studentId,
        date: {
          gte: today,
          lt: new Date(today.getTime() + 24 * 60 * 60 * 1000), // Next day
        },
      },
    });

    if (existingAttendance) {
      return NextResponse.json(
        { message: "Attendance already marked for today" },
        { status: 201 }
      );
    }
    const attendance = await prisma.attendance.create({
      data: {
        studentId,
        date: today,
      },
    });

    return NextResponse.json(
      { message: "Attendance marked successfully", attendance },
      { status: 200 }
    );
  } catch (error) {
    console.error("Error marking attendance:", error);
    return NextResponse.json(
      { error: `Failed to mark attendance: ${error}` },
      { status: 500 }
    );
  }
}
