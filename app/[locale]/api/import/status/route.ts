import { NextResponse } from "next/server";
import { getServerSession } from "next-auth/next";
import { authOptions } from "@/lib/authOptions";

export async function GET(req: Request) {
  const session = await getServerSession(authOptions);

  if (!session || !session.user) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const { searchParams } = new URL(req.url);
  const importId = searchParams.get("importId");

  if (!importId) {
    return NextResponse.json({ error: "Missing importId" }, { status: 400 });
  }

  const encoder = new TextEncoder();
  const stream = new ReadableStream({
    async start(controller) {
      // Simulated import process
      const steps = [
        "initializing",
        "cleaning",
        "deduplicating",
        "importing",
        "completed",
      ];
      const totalRecords = 100;
      let cleanedRecords = 0;
      let uniqueRecords = 0;
      let processedRecords = 0;
      let importedOrUpdatedRecords = 0;
      let skippedRecords = 0;

      for (const step of steps) {
        await new Promise((resolve) => setTimeout(resolve, 2000));

        if (step === "cleaning") {
          cleanedRecords = Math.floor(totalRecords * 0.95);
          skippedRecords = totalRecords - cleanedRecords;
        } else if (step === "deduplicating") {
          uniqueRecords = Math.floor(cleanedRecords * 0.9);
        } else if (step === "importing") {
          for (let i = 0; i < uniqueRecords; i += 10) {
            await new Promise((resolve) => setTimeout(resolve, 500));
            processedRecords = Math.min(i + 10, uniqueRecords);
            importedOrUpdatedRecords = Math.floor(processedRecords * 0.95);
            const progress = Math.floor(
              (processedRecords / uniqueRecords) * 100
            );

            const data = JSON.stringify({
              step,
              progress,
              totalRecords,
              cleanedRecords,
              uniqueRecords,
              processedRecords,
              importedOrUpdatedRecords,
              skippedRecords,
            });

            controller.enqueue(encoder.encode(`data: ${data}\n\n`));
          }
        } else {
          const progress = step === "completed" ? 100 : 0;
          const data = JSON.stringify({
            step,
            progress,
            totalRecords,
            cleanedRecords,
            uniqueRecords,
            processedRecords,
            importedOrUpdatedRecords,
            skippedRecords,
          });

          controller.enqueue(encoder.encode(`data: ${data}\n\n`));
        }
      }

      controller.close();
    },
  });

  return new NextResponse(stream, {
    headers: {
      "Content-Type": "text/event-stream",
      "Cache-Control": "no-cache",
      Connection: "keep-alive",
    },
  });
}
