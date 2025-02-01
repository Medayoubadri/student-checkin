import { useState } from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Label } from "@/components/ui/label";
import { exportStudents } from "@/lib/exportStudents";
import { useTranslations } from "next-intl";

interface ExportOptionsModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export function ExportOptionsModal({
  isOpen,
  onClose,
}: ExportOptionsModalProps) {
  const [fileFormat, setFileFormat] = useState<"csv" | "xlsx">("csv");
  const t = useTranslations("ExportOptionsModal");

  const handleExport = async () => {
    await exportStudents(fileFormat);
    onClose();
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>{t("title")}</DialogTitle>
        </DialogHeader>
        <div className="gap-4 grid py-4">
          <RadioGroup
            value={fileFormat}
            onValueChange={(value: "csv" | "xlsx") => setFileFormat(value)}
          >
            <div className="flex items-center space-x-2">
              <RadioGroupItem value="csv" id="csv" />
              <Label htmlFor="csv">CSV</Label>
            </div>
            <div className="flex items-center space-x-2">
              <RadioGroupItem value="xlsx" id="xlsx" />
              <Label htmlFor="xlsx">Excel (XLSX)</Label>
            </div>
          </RadioGroup>
          <Button onClick={handleExport}>{t("export")}</Button>
        </div>
      </DialogContent>
    </Dialog>
  );
}
