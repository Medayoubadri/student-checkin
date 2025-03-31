// app/[locale]/api/attendance/history/route.ts
import { NextResponse } from "next/server";
import { PrismaClient } from "@prisma/client";
import { getServerSession } from "next-auth/next";
import { authOptions } from "@/lib/authOptions";

const prisma = new PrismaClient();

// Retrieves attendance statistics for the past 14 days, grouped by date
export async function GET() {
  const session = await getServerSession(authOptions);

  if (!session || !session.user) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  try {
    const sevenDaysAgo = new Date();
    sevenDaysAgo.setDate(sevenDaysAgo.getDate() - 14);

    const attendanceData = await prisma.attendance.groupBy({
      by: ["date"],
      where: {
        date: {
          gte: sevenDaysAgo,
        },
        student: {
          userId: session.user.id,
        },
      },
      _count: {
        id: true,
      },
      orderBy: {
        date: "asc",
      },
    });

    const formattedData = attendanceData.map((item) => ({
      date: item.date.toISOString().split("T")[0],
      attendance: item._count.id,
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
