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
    const students = await prisma.student.findMany({
      where: {
        userId: session.user.id,
      },
      select: {
        name: true,
      },
      orderBy: {
        name: "asc",
      },
    });

    const studentNames = students.map((student) => student.name);

    return NextResponse.json(studentNames);
  } catch (error) {
    console.error("Error fetching student names:", error);
    return NextResponse.json(
      { error: "Failed to fetch student names. Please try again." },
      { status: 500 }
    );
  }
}
