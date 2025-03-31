"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { ImportStudentsModal } from "./ImportStudentsModal";
import { ImportLogModal } from "./ImportLogModal";
import { ExportOptionsModal } from "./ExportOptionsModal";
import { useTranslations } from "next-intl";
import { ArrowUpDownIcon, DownloadIcon, UploadIcon } from "lucide-react";
import { ImportResult } from "@/types/import";

// ActionsButton component for managing student data
// This component provides options to import and export student data
// It includes modals for importing students, viewing import logs, and exporting options
export function ActionsButton({
  onImportComplete,
}: {
  onImportComplete: () => void;
}) {
  const [isImportModalOpen, setIsImportModalOpen] = useState(false);
  const [isExportModalOpen, setIsExportModalOpen] = useState(false);
  const [isLogModalOpen, setIsLogModalOpen] = useState(false);
  const [importResult, setImportResult] = useState<ImportResult | null>(null);
  const t = useTranslations("ActionsButton");

  // Function to handle the completion of the import process
  const handleImportComplete = (result: ImportResult) => {
    setImportResult(result);
    setIsLogModalOpen(true);
    onImportComplete();
  };

  // Function to handle closing the log modal
  const handleLogModalClose = () => {
    setIsLogModalOpen(false);
    setIsImportModalOpen(false);
  };

  return (
    <>
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <Button variant="outline">
            <ArrowUpDownIcon className="mr-2 w-4 h-4" />
            {t("actions")}
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent align="end" className="bg-background rounded-xl">
          <DropdownMenuItem onSelect={() => setIsImportModalOpen(true)}>
            <DownloadIcon className="mr-2 w-4 h-4" />
            {t("importStudents")}
          </DropdownMenuItem>
          <DropdownMenuItem onSelect={() => setIsExportModalOpen(true)}>
            <UploadIcon className="mr-2 w-4 h-4" />
            {t("exportStudents")}
          </DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>
      <ImportStudentsModal
        isOpen={isImportModalOpen}
        onClose={() => setIsImportModalOpen(false)}
        onImportComplete={handleImportComplete}
      />
      <ImportLogModal
        isOpen={isLogModalOpen}
        onClose={handleLogModalClose}
        importResult={importResult}
      />
      <ExportOptionsModal
        isOpen={isExportModalOpen}
        onClose={() => setIsExportModalOpen(false)}
      />
    </>
  );
}
