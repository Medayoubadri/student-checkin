import { NextResponse } from "next/server";
import { parse } from "csv-parse/sync";
import { PrismaClient } from "@prisma/client";
import { getServerSession } from "next-auth/next";
import { authOptions } from "@/lib/authOptions";

const prisma = new PrismaClient();

interface CSVRecord {
  name: string;
  age: string;
  gender: string;
  phoneNumber?: string;
}

export async function POST(req: Request) {
  const session = await getServerSession(authOptions);

  if (!session || !session.user) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  try {
    const formData = await req.formData();
    const file = formData.get("file") as File;

    if (!file) {
      return NextResponse.json({ error: "No file uploaded" }, { status: 400 });
    }

    const fileContent = await file.text();
    const records = parse(fileContent, {
      columns: true,
      skip_empty_lines: true,
    }) as CSVRecord[];

    const importedStudents = await Promise.all(
      records.map((record: CSVRecord) =>
        prisma.student.create({
          data: {
            name: record.name,
            age: Number.parseInt(record.age),
            gender: record.gender,
            phoneNumber: record.phoneNumber,
            userId: session.user.id,
          },
        })
      )
    );

    return NextResponse.json({
      message: "Students imported successfully",
      count: importedStudents.length,
    });
  } catch (error) {
    console.error("Error importing students:", error);
    return NextResponse.json(
      {
        error:
          "Failed to import students. Please check your CSV file and try again.",
      },
      { status: 500 }
    );
  }
}
