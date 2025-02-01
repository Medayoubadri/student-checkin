// app/[locale]/api/attendance/daily/route.ts
import { NextResponse } from "next/server";
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
  const date = searchParams.get("date");

  if (!date) {
    return NextResponse.json(
      { error: "Date parameter is required" },
      { status: 400 }
    );
  }

  try {
    // const targetDate = new Date(date);
    // targetDate.setUTCHours(0, 0, 0, 0);

    let students;

    if (date) {
      const dateObj = new Date(date);
      dateObj.setHours(0, 0, 0, 0);
      const nextDay = new Date(dateObj);
      nextDay.setDate(nextDay.getDate() + 1);

      students = await prisma.student.findMany({
        where: {
          userId: session.user.id,
          attendances: {
            some: {
              date: {
                gte: dateObj,
                lt: nextDay,
              },
            },
          },
        },
        include: {
          attendances: {
            where: {
              date: {
                gte: dateObj,
                lt: nextDay,
              },
            },
            take: 1,
          },
        },
      });
    } else {
      students = await prisma.student.findMany({
        where: {
          userId: session.user.id,
        },
        include: {
          attendances: {
            orderBy: { date: "desc" },
            take: 1,
          },
        },
      });
    }

    const studentsWithLastAttendance = students.map((student) => ({
      ...student,
      lastAttendance: student.attendances[0]?.date || null,
      attendances: undefined,
      fullName: student.name,
      age: student.age,
      gender: student.gender,
      phone: student.phoneNumber || "",
      checkInTime: student.attendances[0]?.date
        ? student.attendances[0]?.date.toISOString()
        : "", // Updated from 'record.date' to 'student.attendances[0]?.date'
    }));

    // console.log("Formatted Data:", formattedData);

    return NextResponse.json(studentsWithLastAttendance);
  } catch (error) {
    console.error("Error fetching daily attendance:", error);
    return NextResponse.json(
      { error: "Failed to fetch daily attendance" },
      { status: 500 }
    );
  }
}
