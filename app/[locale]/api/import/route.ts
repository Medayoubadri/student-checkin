// app/[locale]/api/import/route.ts
import { NextResponse } from "next/server";
import { parse } from "csv-parse/sync";
import { PrismaClient } from "@prisma/client";
import { getServerSession } from "next-auth/next";
import { authOptions } from "@/lib/authOptions";

export const maxDuration = 60;

const prisma = new PrismaClient();

// Interface for CSV records where keys are defined dynamically
interface CSVRecord {
  [key: string]: string;
}

// Interface to map CSV columns to respective data properties
interface ColumnMapping {
  [key: string]: string;
}

// Interface to map CSV columns to respective data properties
interface CleanedStudent {
  name: string;
  age: number;
  gender: string;
  phoneNumber?: string;
}

// Function to clean data by removing unwanted characters
function cleanData(data: string): string {
  return data.replace(/[^a-zA-Z0-9\s-]/g, "").trim();
}

// Function to normalize phone numbers to a standard format
function normalizePhoneNumber(phone: string): string {
  const digits = phone.replace(/\D/g, "");
  return digits.length === 10 ? digits : "";
}

// Function to normalize names by standardizing case and formatting
function normalizeName(name: string): string {
  return name.toLowerCase().split(" ").filter(Boolean).sort().join(" ");
}

// Function to validate and clean age input
function validateAge(age: string): number | null {
  const cleanedAge = cleanData(age);
  const parsedAge = Number.parseInt(cleanedAge, 10);
  return !isNaN(parsedAge) && parsedAge > 0 && parsedAge < 80
    ? parsedAge
    : null;
}

// Function to validate and clean gender input
function validateGender(gender: string): string {
  const normalizedGender = gender.toLowerCase().trim();
  return ["Male", "Female"].includes(normalizedGender) ? normalizedGender : "";
}

// POST request handler to import students from a CSV file
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

    console.log(`Total records in CSV: ${records.length}`);

    const cleanedRecords: CleanedStudent[] = [];
    const skippedRecords: { record: CSVRecord; reason: string }[] = [];

    records.forEach((record: CSVRecord) => {
      const name = cleanData(record[columnMapping.name]);
      const age = validateAge(record[columnMapping.age]);
      const gender = validateGender(record[columnMapping.gender]);
      const phoneNumber = columnMapping.phoneNumber
        ? normalizePhoneNumber(record[columnMapping.phoneNumber])
        : undefined;

      if (!name) {
        skippedRecords.push({ record, reason: "Invalid name" });
      } else if (age === null) {
        skippedRecords.push({ record, reason: "Invalid age" });
      } else {
        cleanedRecords.push({ name, age, gender, phoneNumber });
      }
    });

    console.log(`Cleaned records: ${cleanedRecords.length}`);
    console.log(`Skipped records: ${skippedRecords.length}`);

    // Deduplication process
    const uniqueRecords = Array.from(
      new Map(
        cleanedRecords.map((record) => {
          const key = normalizeName(record.name);
          console.log(`Normalized name for deduplication: "${key}"`);
          return [key, record];
        })
      ).values()
    );

    console.log(`Unique records after deduplication: ${uniqueRecords.length}`);

    const BATCH_SIZE = 10;
    let totalImported = 0;
    let totalProcessed = 0;

    for (let i = 0; i < uniqueRecords.length; i += BATCH_SIZE) {
      const batch = uniqueRecords.slice(i, i + BATCH_SIZE);
      console.log(
        `Processing batch ${i / BATCH_SIZE + 1}, size: ${batch.length}`
      );

      const batchResults = await Promise.all(
        batch.map(async (record: CleanedStudent) => {
          try {
            const existingStudent = await prisma.student.findFirst({
              where: {
                userId: session.user.id,
                name: {
                  equals: record.name,
                  mode: "insensitive",
                },
              },
            });

            if (existingStudent) {
              await prisma.student.update({
                where: { id: existingStudent.id },
                data: {
                  age: record.age,
                  gender: record.gender,
                  phoneNumber: record.phoneNumber,
                },
              });
              return { action: "updated" };
            } else {
              await prisma.student.create({
                data: {
                  ...record,
                  userId: session.user.id,
                },
              });
              return { action: "created" };
            }
          } catch (error) {
            console.error(
              `Error processing record: ${JSON.stringify(record)}`,
              error
            );
            return { action: "error", error };
          }
        })
      );

      const batchStats = batchResults.reduce(
        (acc, result) => {
          if (result.action === "created" || result.action === "updated") {
            acc.imported++;
          }
          acc.processed++;
          return acc;
        },
        { imported: 0, processed: 0 }
      );

      totalImported += batchStats.imported;
      totalProcessed += batchStats.processed;

      console.log(
        `Batch ${i / BATCH_SIZE + 1} results: Processed ${
          batchStats.processed
        }, Imported/Updated ${batchStats.imported}`
      );
      console.log(
        `Total progress: Processed ${totalProcessed}/${uniqueRecords.length}, Imported/Updated ${totalImported}`
      );
    }

    console.log(
      `Import completed. Total processed: ${totalProcessed}, Total imported/updated: ${totalImported}`
    );

    return NextResponse.json({
      message: "Students import completed",
      totalRecords: records.length,
      cleanedRecords: cleanedRecords.length,
      uniqueRecords: uniqueRecords.length,
      skippedRecords: skippedRecords.length,

      skippedRecordsDetails: skippedRecords.map((record) => ({
        record: record.record,
        reason: record.reason,
      })),
      processedRecords: totalProcessed,
      importedOrUpdatedRecords: totalImported,
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
