import { NextResponse } from "next/server";
import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

export async function GET() {
  try {
    const totalStudents = await prisma.student.count();

    const today = new Date();
    today.setHours(0, 0, 0, 0);
    const todayAttendance = await prisma.attendance.count({
      where: {
        date: {
          gte: today,
        },
      },
    });

    const totalAttendance = await prisma.attendance.count();

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
