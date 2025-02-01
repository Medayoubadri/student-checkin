import { NextResponse } from "next/server";
import { parse } from "csv-parse/sync";
import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

export async function POST(req: Request) {
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
    });

    for (const record of records) {
      await prisma.student.create({
        data: {
          name: record.name,
          age: Number.parseInt(record.age),
          gender: record.gender,
        },
      });
    }

    return NextResponse.json({ message: "Students imported successfully" });
  } catch (error) {
    console.error("Error importing students:", error);
    return NextResponse.json(
      { error: "Failed to import students" },
      { status: 500 }
    );
  }
}
