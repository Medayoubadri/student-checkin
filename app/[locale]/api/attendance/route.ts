// app/api/attendance/route.ts
import { NextResponse } from "next/server";
import { PrismaClient } from "@prisma/client";
import { getServerSession } from "next-auth/next";
import { authOptions } from "@/lib/authOptions";

const prisma = new PrismaClient();

export async function POST(request: Request) {
  const session = await getServerSession(authOptions);

  if (!session || !session.user) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  try {
    const { studentId } = await request.json();

    const today = new Date();
    today.setHours(0, 0, 0, 0);

    const existingAttendance = await prisma.attendance.findFirst({
      where: {
        studentId: studentId,
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
        studentId: studentId,
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
