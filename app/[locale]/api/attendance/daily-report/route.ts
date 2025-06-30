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
    const startOfDay = new Date(date);
    startOfDay.setHours(0, 0, 0, 0);

    const endOfDay = new Date(date);
    endOfDay.setHours(23, 59, 59, 999);

    const attendanceData = await prisma.attendance.findMany({
      where: {
        date: {
          gte: startOfDay,
          lte: endOfDay,
        },
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
          },
        },
      },
      orderBy: {
        date: "asc",
      },
    });

    const formattedData = attendanceData.map((record) => ({
      fullName: record.student.name,
      age: record.student.age,
      gender: record.student.gender,
      attendance: "Present",
      checkInTime: record.date.toISOString(),
    }));

    return NextResponse.json(formattedData);
  } catch (error) {
    console.error("Error fetching daily attendance:", error);
    return NextResponse.json(
      { error: "Failed to fetch daily attendance" },
      { status: 500 }
    );
  }
}
