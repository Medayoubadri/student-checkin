// app/api/students/route.ts
import { NextResponse } from "next/server";
import { PrismaClient } from "@prisma/client";
import { getServerSession } from "next-auth/next";
import { authOptions } from "@/lib/authOptions";

const prisma = new PrismaClient();

export async function POST(request: Request) {
  const session = await getServerSession(authOptions);

  if (!session || !session.user) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const { name, age, gender } = await request.json();

  try {
    const student = await prisma.student.create({
      data: {
        name,
        age,
        gender,
        userId: session.user.id,
      },
    });
    return NextResponse.json(student);
  } catch (error) {
    console.error("Error creating student:", error);
    return NextResponse.json(
      { error: "Failed to create student. Please try again." },
      { status: 500 }
    );
  }
}

export async function GET(request: Request) {
  const session = await getServerSession(authOptions);

  if (!session || !session.user) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const { searchParams } = new URL(request.url);
  const name = searchParams.get("name");
  const date = searchParams.get("date");

  try {
    if (name) {
      const student = await prisma.student.findFirst({
        where: { name: { equals: name }, userId: session.user.id },
        include: {
          attendances: {
            orderBy: { date: "desc" },
            take: 1,
          },
        },
      });
      return NextResponse.json(student || null);
    }

    let students;

    if (date) {
      const dateObj = new Date(date);
      dateObj.setUTCHours(0, 0, 0, 0);
      const nextDay = new Date(dateObj);
      nextDay.setUTCDate(nextDay.getUTCDate() + 1);

      students = await prisma.student.findMany({
        where: {
          userId: session.user.id,
          attendances: {
            some: {
              date: {
                gte: dateObj,
                lt: nextDay,
              },
            },
          },
        },
        include: {
          attendances: {
            where: {
              date: {
                gte: dateObj,
                lt: nextDay,
              },
            },
            take: 1,
          },
        },
      });
    } else {
      students = await prisma.student.findMany({
        where: {
          userId: session.user.id,
        },
        include: {
          attendances: {
            orderBy: { date: "desc" },
            take: 1,
          },
        },
      });
    }

    const studentsWithLastAttendance = students.map((student) => ({
      ...student,
      lastAttendance: student.attendances[0]?.date || null,
      attendances: undefined,
    }));

    return NextResponse.json(studentsWithLastAttendance);
  } catch (error) {
    console.error("Error fetching students:", error);
    return NextResponse.json(
      { error: "Failed to fetch students. Please try again." },
      { status: 500 }
    );
  }
}
