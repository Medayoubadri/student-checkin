import { useState } from "react";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { ImportStudentsModal } from "@/app/[locale]/(dashboard)/students/components/ImportStudentsModal";
import { ExportOptionsModal } from "@/app/[locale]/(dashboard)/students/components/ExportOptionsModal";
import { useTranslations } from "next-intl";
import { ArrowUpDownIcon, DownloadIcon, UploadIcon } from "lucide-react";

export function ActionsButton({
  onImportComplete,
}: {
  onImportComplete: () => void;
}) {
  const [isImportModalOpen, setIsImportModalOpen] = useState(false);
  const [isExportModalOpen, setIsExportModalOpen] = useState(false);
  const t = useTranslations("ActionsButton");

  return (
    <>
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <Button variant="outline">
            <ArrowUpDownIcon className="w-4 h-4" />
            {t("actions")}
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent align="end" className="bg-background p-2">
          <DropdownMenuItem
            onSelect={() => setIsImportModalOpen(true)}
            className="cursor-pointer"
          >
            <DownloadIcon className="mr-2 w-4 h-4" />
            {t("importStudents")}
          </DropdownMenuItem>
          <DropdownMenuItem
            onSelect={() => setIsExportModalOpen(true)}
            className="cursor-pointer"
          >
            <UploadIcon className="mr-2 w-4 h-4" />
            {t("exportStudents")}
          </DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>
      <ImportStudentsModal
        isOpen={isImportModalOpen}
        onClose={() => setIsImportModalOpen(false)}
        onImportComplete={onImportComplete}
      />
      <ExportOptionsModal
        isOpen={isExportModalOpen}
        onClose={() => setIsExportModalOpen(false)}
      />
    </>
  );
}
