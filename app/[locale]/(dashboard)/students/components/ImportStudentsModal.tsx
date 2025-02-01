import { useState } from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { toast } from "@/hooks/use-toast";
import { useTranslations } from "next-intl";
import { FileInput } from "@/components/ui/file-input";

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
  const [file] = useState<File | null>(null);
  const t = useTranslations("ImportStudentsModal");
  const [, setSelectedFile] = useState<File | null>(null);

  const handleImport = async () => {
    if (!file) {
      toast({
        title: t("toastitle-warning"),
        description: t("tostdescription"),
        variant: "warning",
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
          title: t("toastitle-success"),
          description: t("toastdescription-success"),
          variant: "success",
        });
        onImportComplete();
        onClose();
      } else {
        throw new Error("Import failed");
      }
    } catch (error) {
      console.error("Error importing students:", error);
      toast({
        title: t("toastitle-failed"),
        description: t("toastdescription-failed"),
        variant: "destructive",
      });
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>{t("title")}</DialogTitle>
        </DialogHeader>
        <div className="gap-4 grid py-4">
          <div className="flex items-center gap-4">
            <FileInput onFileSelect={setSelectedFile} />
            <Button
              variant="default"
              disabled={!file}
              onClick={handleImport}
              className="bg-primary/45 text-background-light"
            >
              {t("import")}
            </Button>
          </div>
          <p className="text-muted-foreground text-sm">{t("description")}</p>
        </div>
      </DialogContent>
    </Dialog>
  );
}
