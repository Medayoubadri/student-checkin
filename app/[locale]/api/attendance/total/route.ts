// app/[locale]/api/attendance/total/route.ts
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
  const studentIds = searchParams.get("studentIds")?.split(",") || [];

  if (studentIds.length === 0) {
    return NextResponse.json(
      { error: "Student IDs parameter is required" },
      { status: 400 }
    );
  }

  try {
    const attendanceCounts = await prisma.attendance.groupBy({
      by: ["studentId"],
      _count: {
        studentId: true,
      },
      where: {
        studentId: { in: studentIds },
        student: {
          userId: session.user.id,
        },
      },
    });

    const result = attendanceCounts.reduce(
      (acc: { [key: string]: number }, curr) => {
        acc[curr.studentId] = curr._count.studentId;
        return acc;
      },
      {}
    );

    return NextResponse.json(result);
  } catch (error) {
    console.error("Error fetching total attendance:", error);
    return NextResponse.json(
      { error: "Failed to fetch total attendance" },
      { status: 500 }
    );
  }
}
