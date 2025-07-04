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
  const name = searchParams.get("name");

  try {
    if (name) {
      const students = await prisma.student.findMany({
        where: {
          name: {
            contains: name,
            mode: "insensitive",
          },
          userId: session.user.id,
        },
        take: 5, // Limit results for better performance
      });
      return NextResponse.json(students);
    }
  } catch (error) {
    console.error("Error fetching students:", error);
    return NextResponse.json(
      { error: "Failed to fetch students. Please try again." },
      { status: 500 }
    );
  }
}
