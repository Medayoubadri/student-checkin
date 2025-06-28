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

  if (name) {
    const students = await prisma.student.findMany({
      where: {
        name: {
          equals: name,
        },
      },
    });

    // Perform case-insensitive search manually
    const matchingStudent = students.find(
      (student) => student.name.toLowerCase() === name.toLowerCase()
    );

    return NextResponse.json(matchingStudent || null);
  }

  const students = await prisma.student.findMany();
  return NextResponse.json(students);
}
