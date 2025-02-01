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
  const studentId = searchParams.get("studentId");

  if (!studentId) {
    return NextResponse.json(
      { error: "Student ID parameter is required" },
      { status: 400 }
    );
  }

  try {
    const totalAttendance = await prisma.attendance.count({
      where: {
        studentId: studentId,
        student: {
          userId: session.user.id,
        },
      },
    });

    return NextResponse.json({ total: totalAttendance });
  } catch (error) {
    console.error("Error fetching total attendance:", error);
    return NextResponse.json(
      { error: "Failed to fetch total attendance" },
      { status: 500 }
    );
  }
}
