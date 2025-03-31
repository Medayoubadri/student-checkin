// app/(dashboard)/students/components/SelectedDateDisplay.tsx
import { Button } from "@/components/ui/button";
import { X } from "lucide-react";
import { useTranslations } from "next-intl";

interface SelectedDateDisplayProps {
  selectedDate: Date | null;
  onClear: () => void;
}

// SelectedDateDisplay component for displaying the selected date
export function SelectedDateDisplay({
  selectedDate,
  onClear,
}: SelectedDateDisplayProps) {
  const t = useTranslations("SelectedDateDisplay");

  // Format the selected date using the provided translation key
  // The date is formatted to include the weekday, year, month, and day
  if (!selectedDate) return null;
  const formattedDate = t("dateFormat", {
    date: selectedDate,
    weekday: "long",
    year: "numeric",
    month: "long",
    day: "numeric",
  });

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
