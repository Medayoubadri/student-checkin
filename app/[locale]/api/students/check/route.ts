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
  const normalizedName = searchParams.get("name");

  if (!normalizedName) {
    return NextResponse.json(
      { error: "Name parameter is required" },
      { status: 400 }
    );
  }

  try {
    const students = await prisma.student.findMany({
      where: {
        userId: session.user.id,
      },
    });

    const matchingStudent = students.find((student) => {
      const studentNormalizedName = student.name
        .toLowerCase()
        .split(" ")
        .sort()
        .join(" ");
      return studentNormalizedName === normalizedName;
    });

    if (matchingStudent) {
      return NextResponse.json(matchingStudent);
    } else {
      return NextResponse.json(null);
    }
  } catch (error) {
    console.error("Error checking student:", error);
    return NextResponse.json(
      { error: "Failed to check student. Please try again." },
      { status: 500 }
    );
  }
}
