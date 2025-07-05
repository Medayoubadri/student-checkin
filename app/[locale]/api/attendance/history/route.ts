// app/[locale]/api/attendance/history/route.ts
import { NextResponse } from "next/server";
import { PrismaClient } from "@prisma/client";
import { getServerSession } from "next-auth/next";
import { authOptions } from "@/lib/authOptions";

const prisma = new PrismaClient();

export async function GET() {
  const session = await getServerSession(authOptions);

  if (!session || !session.user) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  try {
    const attendanceData = await prisma.attendance.groupBy({
      by: ["date"],
      _count: {
        studentId: true,
      },
      orderBy: {
        date: "asc",
      },
      take: 7, // Last 30 days
    });

    const formattedData = attendanceData.map((item) => ({
      date: item.date.toISOString().split("T")[0],
      attendance: item._count.studentId,
    }));

    return NextResponse.json(formattedData);
  } catch (error) {
    console.error("Error fetching attendance history:", error);
    return NextResponse.json(
      { error: "Failed to fetch attendance history" },
      { status: 500 }
    );
  }
}
