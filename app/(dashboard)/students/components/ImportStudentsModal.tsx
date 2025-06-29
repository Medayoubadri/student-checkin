import { useState } from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { toast } from "@/hooks/use-toast";

interface ImportStudentsModalProps {
  isOpen: boolean;
  onClose: () => void;
  onImportComplete: () => void;
}

export function ImportStudentsModal({
  isOpen,
  onClose,
  onImportComplete,
}: ImportStudentsModalProps) {
  const [file, setFile] = useState<File | null>(null);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files) {
      setFile(e.target.files[0]);
    }
  };

  const handleImport = async () => {
    if (!file) {
      toast({
        title: "No file selected",
        description: "Please select a CSV file to import.",
        variant: "destructive",
      });
      return;
    }

    const formData = new FormData();
    formData.append("file", file);

    try {
      const response = await fetch("/api/import", {
        method: "POST",
        body: formData,
      });

      if (response.ok) {
        toast({
          title: "Import successful",
          description: "Students have been imported successfully.",
        });
        onImportComplete();
        onClose();
      } else {
        throw new Error("Import failed");
      }
    } catch (error) {
      toast({
        title: "Import failed",
        description: `Failed to import students. ${error}`,
        variant: "destructive",
      });
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Import Students</DialogTitle>
        </DialogHeader>
        <div className="gap-4 grid py-4">
          <div className="flex items-center gap-4">
            <Input type="file" accept=".csv" onChange={handleFileChange} />
            <Button onClick={handleImport}>Import</Button>
          </div>
          <p className="text-muted-foreground text-sm">
            Please upload a CSV file with the following columns: Full Name, Age,
            Gender
          </p>
        </div>
      </DialogContent>
    </Dialog>
  );
}
