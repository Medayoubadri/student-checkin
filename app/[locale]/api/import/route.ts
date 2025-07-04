// app/[locale]/api/import/route.ts
import { NextResponse } from "next/server";
import { parse } from "csv-parse/sync";
import { PrismaClient } from "@prisma/client";
import { getServerSession } from "next-auth/next";
import { authOptions } from "@/lib/authOptions";

// Increase timeout and set response limit
export const maxDuration = 60;

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
  return data.replace(/[^a-zA-Z0-9\s-]/g, "").trim();
}

function normalizePhoneNumber(phone: string): string {
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

    const batchSize = 100; // Process 100 records at a time
    let totalImported = 0;

    for (let i = 0; i < records.length; i += batchSize) {
      const batch = records.slice(i, i + batchSize);
      const importedCount = await processBatch(
        batch,
        columnMapping,
        session.user.id
      );
      totalImported += importedCount;
    }

    return NextResponse.json({
      message: "Students imported successfully",
      count: totalImported,
    });
  } catch (error) {
    console.error("Error importing students:", error);
    let errorMessage =
      "Failed to import students. Please check your CSV file and column mapping, then try again.";
    if (error instanceof Error) {
      errorMessage += ` Error details: ${error.message}`;
    }
    return NextResponse.json({ error: errorMessage }, { status: 500 });
  }
}

async function processBatch(
  batch: CSVRecord[],
  columnMapping: ColumnMapping,
  userId: string
) {
  const cleanedRecords: CleanedStudent[] = batch.map((record: CSVRecord) => ({
    name: cleanData(record[columnMapping.name]),
    age: Number.parseInt(cleanData(record[columnMapping.age])),
    gender: cleanData(record[columnMapping.gender]),
    phoneNumber: columnMapping.phoneNumber
      ? normalizePhoneNumber(record[columnMapping.phoneNumber])
      : undefined,
  }));

  const uniqueRecords = Array.from(
    new Map(
      cleanedRecords.map((record) => [normalizeName(record.name), record])
    ).values()
  );

  const importedStudents = await Promise.all(
    uniqueRecords.map(async (record: CleanedStudent) => {
      const existingStudent = await prisma.student.findFirst({
        where: {
          userId: userId,
          name: {
            contains: record.name.split(" ")[0],
            mode: "insensitive",
          },
        },
      });

      if (existingStudent) {
        return prisma.student.update({
          where: { id: existingStudent.id },
          data: {
            age: record.age,
            gender: record.gender,
            phoneNumber: record.phoneNumber,
          },
        });
      } else {
        return prisma.student.create({
          data: {
            ...record,
            userId: userId,
          },
        });
      }
    })
  );

  return importedStudents.length;
}
