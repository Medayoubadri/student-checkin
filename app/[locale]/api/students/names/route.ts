import { NextResponse } from "next/server";
import { PrismaClient } from "@prisma/client";
import { getServerSession } from "next-auth/next";
import { authOptions } from "@/lib/authOptions";
// import { redis } from "@/lib/cache";

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
      // const cacheKey = `students:${session.user.id}:${name}`;
      // const cachedStudents = await redis.get(cacheKey);

      // if (cachedStudents) {
      //   return NextResponse.json(cachedStudents);
      // }

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

      // Cache the results for 60 minutes
      // await redis.set(cacheKey, JSON.stringify(students), { ex: 3600 });
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
