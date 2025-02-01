// app/[locale]/dashboard/students/components/ImportStudentsModal.tsx
"use client";

import { useState, useEffect, useCallback } from "react";
import { useDropzone } from "react-dropzone";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { toast } from "@/hooks/use-toast";
import { useTranslations } from "next-intl";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Loader2Icon, Upload, File, X } from "lucide-react";
import { ProcessingScreen } from "./ProcessingScreen";
import type { ImportResult } from "@/types/import";

interface ImportStudentsModalProps {
  isOpen: boolean;
  onClose: () => void;
  onImportComplete: (result: ImportResult) => void;
}

interface ColumnMapping {
  [key: string]: string;
}

export function ImportStudentsModal({
  isOpen,
  onClose,
  onImportComplete,
}: ImportStudentsModalProps) {
  const [file, setFile] = useState<File | null>(null);
  const [headers, setHeaders] = useState<string[]>([]);
  const [columnMapping, setColumnMapping] = useState<ColumnMapping>({});
  const [step, setStep] = useState<"upload" | "map" | "processing">("upload");
  const [isLoading, setIsLoading] = useState(false);
  const t = useTranslations("ImportStudentsModal");

  const requiredFields = ["name", "age", "gender"];
  const optionalFields = ["phoneNumber"];

  const onDrop = useCallback((acceptedFiles: File[]) => {
    if (acceptedFiles.length > 0) {
      const selectedFile = acceptedFiles[0];
      setFile(selectedFile);

      const reader = new FileReader();
      reader.onload = (event) => {
        const content = event.target?.result as string;
        const firstLine = content.split("\n")[0];
        const csvHeaders = firstLine.split(",").map((header) => header.trim());
        setHeaders(csvHeaders);
      };
      reader.readAsText(selectedFile);
    }
  }, []);

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    multiple: false,
    accept: {
      "text/csv": [".csv"],
    },
  });

  const handleColumnMap = (field: string, value: string) => {
    setColumnMapping((prev) => ({ ...prev, [field]: value }));
  };

  const handleImport = async () => {
    if (!file) {
      toast({
        title: t("toastitle-warning"),
        description: t("tostdescription"),
        variant: "warning",
      });
      return;
    }

    setIsLoading(true);
    setStep("processing");

    const formData = new FormData();
    formData.append("file", file);
    formData.append("columnMapping", JSON.stringify(columnMapping));

    try {
      const response = await fetch("/api/import", {
        method: "POST",
        body: formData,
      });

      const result: ImportResult = await response.json();

      if (response.ok) {
        toast({
          title: t("toastitle-success"),
          description: t("toastdescription-success", {
            count: result.importedOrUpdatedRecords,
          }),
          variant: "success",
        });
        onImportComplete(result);
      } else {
        throw new Error(result.error || "Import failed");
      }
    } catch (error) {
      console.error("Error importing students:", error);
      const errorResult: ImportResult = {
        error: t("error"),
        totalRecords: 0,
        cleanedRecords: 0,
        uniqueRecords: 0,
        processedRecords: 0,
        importedOrUpdatedRecords: 0,
        skippedRecords: 0,
      };
      toast({
        title: t("toastitle-failed"),
        description: t("toastdescription-failed"),
        variant: "destructive",
      });
      onImportComplete(errorResult);
    } finally {
      setIsLoading(false);
      setStep("upload");
    }
  };

  const resetImport = useCallback(() => {
    setFile(null);
    setHeaders([]);
    setColumnMapping({});
    setStep("upload");
    setIsLoading(false);
  }, []);

  const handleClose = () => {
    resetImport();
    onClose();
  };

  const isMapComplete = requiredFields.every((field) => columnMapping[field]);

  useEffect(() => {
    if (!isOpen) {
      resetImport();
    }
  }, [isOpen, resetImport]);

  return (
    <Dialog open={isOpen} onOpenChange={handleClose}>
      <DialogContent className="sm:max-w-[425px] md:max-w-[480px]">
        <DialogHeader>
          <DialogTitle className="text-xl md:text-2xl">
            {t("title")}
          </DialogTitle>
        </DialogHeader>
        {step === "upload" && (
          <div className="flex flex-col items-center gap-4 py-4">
            <div
              {...getRootProps()}
              className={`border-2 border-dashed rounded-lg p-4 text-center cursor-pointer transition-colors ${
                isDragActive
                  ? "border-primary bg-primary/10"
                  : "border-muted-foreground"
              }`}
            >
              <input {...getInputProps()} />
              {file ? (
                <div className="flex justify-center items-center">
                  <File className="mr-2 w-6 h-6 text-muted-foreground" />
                  <span className="text-muted-foreground text-sm">
                    {file.name}
                  </span>
                  <Button
                    variant="ghost"
                    size="icon"
                    onClick={(e) => {
                      e.stopPropagation();
                      setFile(null);
                    }}
                    className="ml-2 w-6 h-6"
                  >
                    <X className="w-4 h-4" />
                  </Button>
                </div>
              ) : (
                <>
                  <Upload className="mx-auto w-12 h-12 text-muted-foreground" />
                  <p className="mt-2 text-muted-foreground text-sm">
                    {t("dragAndDrop")}
                  </p>
                </>
              )}
            </div>
            <Button
              variant="default"
              disabled={!file}
              onClick={() => setStep("map")}
              className="mt-4 w-full"
            >
              {t("next")}
            </Button>
            <p className="text-muted-foreground text-sm">{t("description")}</p>
          </div>
        )}
        {step === "map" && (
          <div className="flex flex-col gap-4 py-4">
            <h3 className="mb-4 w-3/4 font-light test-xs">{t("subtitle")}</h3>
            {[...requiredFields, ...optionalFields].map((field) => (
              <div key={field} className="flex items-center gap-2">
                <label className="w-1/3">{t(field)}</label>
                <Select
                  onValueChange={(value) => handleColumnMap(field, value)}
                >
                  <SelectTrigger className="w-2/3">
                    <SelectValue placeholder={t("selectColumn")} />
                  </SelectTrigger>
                  <SelectContent>
                    {headers.map((header) => (
                      <SelectItem key={header} value={header}>
                        {header}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            ))}
            <Button
              variant="default"
              disabled={!isMapComplete || isLoading}
              onClick={handleImport}
              className="mt-4 w-full"
            >
              {isLoading ? (
                <>
                  <Loader2Icon className="mr-2 w-4 h-4 animate-spin" />
                  {t("importing")}
                </>
              ) : (
                t("import")
              )}
            </Button>
          </div>
        )}
        {step === "processing" && <ProcessingScreen />}
      </DialogContent>
    </Dialog>
  );
}
