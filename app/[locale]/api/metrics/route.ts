// app/[locale]/api/metrics/route.ts
import { NextResponse } from "next/server";
import { PrismaClient } from "@prisma/client";
import { getServerSession } from "next-auth/next";
import { authOptions } from "@/lib/authOptions";

const prisma = new PrismaClient();

// GET request for fetching student metrics 
export async function GET() {
  const session = await getServerSession(authOptions);

  if (!session || !session.user) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  try {
    const totalStudents = await prisma.student.count({
      where: {
        userId: session.user.id,
      },
    });

    const today = new Date();
    today.setHours(0, 0, 0, 0);
    const todayAttendance = await prisma.attendance.count({
      where: {
        date: {
          gte: today,
        },
        student: {
          userId: session.user.id,
        },
      },
    });

    const totalAttendance = await prisma.attendance.count({
      where: {
        student: {
          userId: session.user.id,
        },
      },
    });

    const averageAttendance =
      totalStudents > 0
        ? Math.round((totalAttendance / totalStudents) * 100)
        : 0;

    return NextResponse.json({
      totalStudents,
      todayAttendance,
      averageAttendance,
      totalAttendance,
    });
  } catch (error) {
    console.error("Error fetching metrics:", error);
    return NextResponse.json(
      { error: "Failed to fetch metrics" },
      { status: 500 }
    );
  }
}
