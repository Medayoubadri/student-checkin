// app/(dashboard)/students/components/SelectedDateDisplay.tsx
import { Button } from "@/components/ui/button";
import { X } from "lucide-react";
import { useTranslations } from "next-intl";

interface SelectedDateDisplayProps {
  selectedDate: Date | null;
  onClear: () => void;
}

export function SelectedDateDisplay({
  selectedDate,
  onClear,
}: SelectedDateDisplayProps) {
  if (!selectedDate) return null;
  const t = useTranslations("SelectedDateDisplay");
  const formattedDate = selectedDate.toISOString().split("T")[0];

  return (
    <div className="flex items-center gap-2">
      <span className="text-muted-foreground">{t("studentsPresentOn")}</span>
      <span>
        {formattedDate}
        <Button
          variant="ghost"
          size="icon"
          onClick={onClear}
          className="bg-red-500 ml-2 p-0 w-6 h-6"
        >
          <X />
        </Button>
      </span>
    </div>
  );
}
