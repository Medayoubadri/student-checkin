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
    const targetDate = new Date(date);
    targetDate.setUTCHours(0, 0, 0, 0);

    const attendanceData = await prisma.attendance.findMany({
      where: {
        date: targetDate,
        student: {
          userId: session.user.id,
        },
      },
      include: {
        student: {
          select: {
            name: true,
            age: true,
            gender: true,
            phoneNumber: true,
          },
        },
      },
      orderBy: {
        date: "asc",
      },
    });

    // console.log("Attendance Data:", attendanceData);

    const formattedData = attendanceData.map((record) => ({
      fullName: record.student.name,
      age: record.student.age,
      gender: record.student.gender,
      phone: record.student.phoneNumber || "",
      checkInTime: record.date ? record.date.toISOString() : "",
    }));

    // console.log("Formatted Data:", formattedData);

    return NextResponse.json(formattedData);
  } catch (error) {
    console.error("Error fetching daily attendance:", error);
    return NextResponse.json(
      { error: "Failed to fetch daily attendance" },
      { status: 500 }
    );
  }
}
