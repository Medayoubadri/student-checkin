// app/[locale]/api/import/route.ts
import { NextResponse } from "next/server";
import { parse } from "csv-parse/sync";
import { PrismaClient } from "@prisma/client";
import { getServerSession } from "next-auth/next";
import { authOptions } from "@/lib/authOptions";

const prisma = new PrismaClient();

interface CSVRecord {
  [key: string]: string;
}

interface ColumnMapping {
  [key: string]: string;
}

interface CleanedStudent {
  name: string;
  age: number;
  gender: string;
  phoneNumber?: string;
}

function cleanData(data: string): string {
  // Remove any non-alphanumeric characters except spaces and hyphens
  return data.replace(/[^a-zA-Z0-9\s-]/g, "").trim();
}

function normalizePhoneNumber(phone: string): string {
  // Remove all non-digit characters
  return phone.replace(/\D/g, "");
}

function normalizeName(name: string): string {
  return name.toLowerCase().split(" ").sort().join(" ");
}

export async function POST(req: Request) {
  const session = await getServerSession(authOptions);

  if (!session || !session.user) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  try {
    const formData = await req.formData();
    const file = formData.get("file") as File;
    const columnMappingString = formData.get("columnMapping") as string;

    if (!file || !columnMappingString) {
      return NextResponse.json(
        { error: "Missing file or column mapping" },
        { status: 400 }
      );
    }

    const columnMapping: ColumnMapping = JSON.parse(columnMappingString);

    const fileContent = await file.text();
    const records = parse(fileContent, {
      columns: true,
      skip_empty_lines: true,
    }) as CSVRecord[];

    const cleanedRecords: CleanedStudent[] = records.map(
      (record: CSVRecord) => ({
        name: cleanData(record[columnMapping.name]),
        age: Number.parseInt(cleanData(record[columnMapping.age])),
        gender: cleanData(record[columnMapping.gender]),
        phoneNumber: columnMapping.phoneNumber
          ? normalizePhoneNumber(record[columnMapping.phoneNumber])
          : undefined,
      })
    );

    // Remove duplicates and handle flipped names
    const uniqueRecords = Array.from(
      new Map(
        cleanedRecords.map((record) => [normalizeName(record.name), record])
      ).values()
    );

    const importedStudents = await Promise.all(
      uniqueRecords.map(async (record: CleanedStudent) => {
        // Check if a student with the same name (or flipped name) already exists
        const existingStudent = await prisma.student.findFirst({
          where: {
            userId: session.user.id,
            name: {
              contains: record.name.split(" ")[0],
              mode: "insensitive",
            },
          },
        });

        if (existingStudent) {
          // Update existing student
          return prisma.student.update({
            where: { id: existingStudent.id },
            data: {
              age: record.age,
              gender: record.gender,
              phoneNumber: record.phoneNumber,
            },
          });
        } else {
          // Create new student
          return prisma.student.create({
            data: {
              ...record,
              userId: session.user.id,
            },
          });
        }
      })
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
          "Failed to import students. Please check your CSV file and column mapping, then try again.",
      },
      { status: 500 }
    );
  }
}
