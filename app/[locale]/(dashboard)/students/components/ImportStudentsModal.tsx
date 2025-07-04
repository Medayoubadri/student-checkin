// app/locale/dashboard/students/components/ImportStudentsModal.tsx
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
import { InputFile } from "@/components/ui/input-file";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Loader2Icon } from "lucide-react";

interface ImportStudentsModalProps {
  isOpen: boolean;
  onClose: () => void;
  onImportComplete: () => void;
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
  const [step, setStep] = useState<"upload" | "map">("upload");
  const [isLoading, setIsLoading] = useState(false);
  const t = useTranslations("ImportStudentsModal");

  const requiredFields = ["name", "age", "gender"];
  const optionalFields = ["phoneNumber"];

  const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files) {
      const selectedFile = e.target.files[0];
      setFile(selectedFile);

      // Read the first line of the CSV to get headers
      const reader = new FileReader();
      reader.onload = (event) => {
        const content = event.target?.result as string;
        const firstLine = content.split("\n")[0];
        const csvHeaders = firstLine.split(",").map((header) => header.trim());
        setHeaders(csvHeaders);
      };
      reader.readAsText(selectedFile);
    }
  };

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

    const formData = new FormData();
    formData.append("file", file);
    formData.append("columnMapping", JSON.stringify(columnMapping));

    try {
      const response = await fetch("/api/import", {
        method: "POST",
        body: formData,
      });

      if (response.ok) {
        const result = await response.json();
        toast({
          title: t("toastitle-success"),
          description: t("toastdescription-success", { count: result.count }),
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
    } finally {
      setIsLoading(false);
    }
  };

  const isMapComplete = requiredFields.every((field) => columnMapping[field]);

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle className="flex flex-col items-start gap-4">
            <h1 className="pt-4 font-bold text-2xl leading-[0]">
              {t("title")}
            </h1>
          </DialogTitle>
        </DialogHeader>
        <div className="gap-4 grid py-4">
          {step === "upload" && (
            <>
              <div className="flex items-center gap-4">
                <InputFile
                  type="file"
                  accept=".csv"
                  onChange={handleFileChange}
                />
                <Button
                  variant="default"
                  disabled={!file}
                  onClick={() => setStep("map")}
                  className="bg-primary/45 text-background-light"
                >
                  {t("next")}
                </Button>
              </div>
              <p className="text-muted-foreground text-sm">
                {t("description")}
              </p>
            </>
          )}
          {step === "map" && (
            <>
              <h3 className="mb-4 font-light test-xs">{t("subtitle")}</h3>
              <div className="space-y-4">
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
              </div>
              {isLoading ? (
                <p className="text-muted-foreground text-sm">
                  {t("dataCleaningInfo")}
                </p>
              ) : (
                <></>
              )}
              <Button
                variant="default"
                disabled={!isMapComplete || isLoading}
                onClick={handleImport}
                className="bg-primary/45 text-background-light"
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
            </>
          )}
        </div>
      </DialogContent>
    </Dialog>
  );
}
