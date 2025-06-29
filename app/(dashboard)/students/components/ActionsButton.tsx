import { useState } from "react";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { ImportStudentsModal } from "./ImportStudentsModal";
import { ExportOptionsModal } from "./ExportOptionsModal";

export function ActionsButton({
  onImportComplete,
}: {
  onImportComplete: () => void;
}) {
  const [isImportModalOpen, setIsImportModalOpen] = useState(false);
  const [isExportModalOpen, setIsExportModalOpen] = useState(false);

  return (
    <>
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <Button variant="outline">Actions</Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent>
          <DropdownMenuItem onSelect={() => setIsImportModalOpen(true)}>
            Import Students
          </DropdownMenuItem>
          <DropdownMenuItem onSelect={() => setIsExportModalOpen(true)}>
            Export Students
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
