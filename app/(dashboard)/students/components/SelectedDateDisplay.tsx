import { Button } from "@/components/ui/button";
import { X } from "lucide-react";

interface SelectedDateDisplayProps {
  selectedDate: Date | null;
  onClear: () => void;
}

export function SelectedDateDisplay({
  selectedDate,
  onClear,
}: SelectedDateDisplayProps) {
  if (!selectedDate) return null;

  const formattedDate = selectedDate.toISOString().split("T")[0]; // Format: yyyy-mm-dd

  return (
    <div className="flex items-center">
      <span>{formattedDate}</span>
      <Button
        variant="ghost"
        size="icon"
        onClick={onClear}
        className="bg-red-500 ml-2 p-0 w-6 h-6"
      >
        <X className="w-6 h-6" />
      </Button>
    </div>
  );
}
