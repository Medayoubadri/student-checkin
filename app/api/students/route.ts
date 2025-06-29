// app/api/students/route.ts
import { NextResponse } from "next/server";
import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

export async function POST(request: Request) {
  const { name, age, gender } = await request.json();

  try {
    const student = await prisma.student.create({
      data: {
        name,
        age,
        gender,
      },
    });
    return NextResponse.json(student);
  } catch (error) {
    return NextResponse.json(
      { error: `Failed to create student ${error}` },
      { status: 500 }
    );
  }
}

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const name = searchParams.get("name");
  const date = searchParams.get("date");

  try {
    if (name) {
      const student = await prisma.student.findFirst({
        where: { name: { equals: name } },
        include: {
          attendances: {
            orderBy: { date: "desc" },
            take: 1,
          },
        },
      });
      return NextResponse.json(student || null);
    }

    if (date) {
      const dateObj = new Date(date);
      dateObj.setHours(0, 0, 0, 0);
      const nextDay = new Date(dateObj);
      nextDay.setDate(nextDay.getDate() + 1);

      // Only fetch students who attended on the selected date
      const students = await prisma.student.findMany({
        where: {
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
          },
        },
      });

      const studentsWithLastAttendance = students.map((student) => ({
        ...student,
        lastAttendance: student.attendances[0]?.date || null,
        attendances: undefined,
      }));

      return NextResponse.json(studentsWithLastAttendance);
    }

    const students = await prisma.student.findMany({
      include: {
        attendances: {
          orderBy: { date: "desc" },
          take: 1,
        },
      },
    });

    const studentsWithLastAttendance = students.map((student) => ({
      ...student,
      lastAttendance: student.attendances[0]?.date || null,
      attendances: undefined, // Remove the attendances array from the response
    }));

    return NextResponse.json(studentsWithLastAttendance);
  } catch (error) {
    return NextResponse.json(
      { error: `Failed to fetch students: ${error}` },
      { status: 500 }
    );
  }
}
