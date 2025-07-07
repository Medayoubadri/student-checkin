import { saveAs } from "file-saver";
import { toast } from "@/hooks/use-toast";

// Handles the export of student data to CSV or XLSX format with success/error notifications
export async function exportStudents(fileFormat: "csv" | "xlsx") {
  try {
    const response = await fetch(`/api/export?format=${fileFormat}`);
    if (response.ok) {
      const blob = await response.blob();
      const filename = `Check-in_Mate_students-list.${fileFormat}`;
      saveAs(blob, filename);
      toast({
        title: "Export successful",
        description: "The student list have been exported successfully.",
        variant: "success",
      });
    } else {
      throw new Error("Export failed");
    }
  } catch (error) {
    console.error("Error exporting students:", error);
    toast({
      title: "Export failed",
      description: `Failed to export students. ${error}`,
      variant: "destructive",
    });
  }
}
