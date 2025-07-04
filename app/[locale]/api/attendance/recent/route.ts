// app/[locale]/api/attendance/recent/route.ts
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
    const today = new Date();
    today.setHours(0, 0, 0, 0);

    const recentActivity = await prisma.attendance.findMany({
      where: {
        student: {
          userId: session.user.id,
        },
        date: {
          gte: today,
        },
      },
      select: {
        id: true,
        date: true,
        student: {
          select: {
            name: true,
          },
        },
      },
      orderBy: {
        date: "desc",
      },
      take: 10,
    });

    const formattedActivity = recentActivity.map((activity) => ({
      id: activity.id,
      studentName: activity.student.name,
      timestamp: activity.date.toISOString(),
    }));

    return NextResponse.json(formattedActivity);
  } catch (error) {
    console.error("Error fetching recent activity:", error);
    return NextResponse.json(
      { error: "Failed to fetch recent activity. Please try again." },
      { status: 500 }
    );
  }
}
