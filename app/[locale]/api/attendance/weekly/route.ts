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
    const sevenDaysAgo = new Date();
    sevenDaysAgo.setDate(sevenDaysAgo.getDate() - 7);

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

    const formattedData = attendanceData.map((entry) => ({
      date: entry.date.toISOString().split("T")[0],
      count: entry._count.id,
    }));

    return NextResponse.json(formattedData);
  } catch (error) {
    console.error("Error fetching weekly attendance:", error);
    return NextResponse.json(
      { error: "Failed to fetch weekly attendance. Please try again." },
      { status: 500 }
    );
  }
}
