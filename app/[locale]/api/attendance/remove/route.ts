import { NextResponse } from "next/server";
import { PrismaClient } from "@prisma/client";
import { getServerSession } from "next-auth/next";
import { authOptions } from "@/lib/authOptions";

const prisma = new PrismaClient();

// DELETE request for removing attendance record 

export async function DELETE(request: Request) {
  const session = await getServerSession(authOptions);

  if (!session || !session.user) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  try {
    const { studentId, date } = await request.json();

    if (!studentId || !date) {
      return NextResponse.json(
        { error: "Missing required parameters" },
        { status: 400 }
      );
    }

    const attendanceDate = new Date(date);
    attendanceDate.setHours(0, 0, 0, 0);

    const nextDay = new Date(attendanceDate);
    nextDay.setDate(nextDay.getDate() + 1);

    const deletedAttendance = await prisma.attendance.deleteMany({
      where: {
        studentId: studentId,
        date: {
          gte: attendanceDate,
          lt: nextDay,
        },
        student: {
          userId: session.user.id,
        },
      },
    });

    if (deletedAttendance.count === 0) {
      return NextResponse.json(
        { error: "No attendance record found" },
        { status: 404 }
      );
    }

    return NextResponse.json({
      message: "Attendance record removed successfully",
    });
  } catch (error) {
    console.error("Error removing attendance record:", error);
    return NextResponse.json(
      { error: "Failed to remove attendance record. Please try again." },
      { status: 500 }
    );
  }
}
