import { Button } from "@/components/ui/button";
import { Calendar } from "@/components/ui/calendar";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { CalendarIcon } from "lucide-react";
import { format } from "date-fns";
import { useTranslations } from "next-intl";

interface CalendarButtonProps {
  onDateSelect: (date: Date | undefined) => void;
  selectedDate: Date | null;
}

// This component renders a button that opens a calendar popover
export function CalendarButton({
  onDateSelect,
  selectedDate,
}: CalendarButtonProps) {
  const handleSelect = (newDate: Date | undefined) => {
    onDateSelect(newDate);
  };
  const t = useTranslations("CalendarButton");

  return (
    <Popover>
      <PopoverTrigger asChild>
        <Button
          variant="outline"
          className="justify-start w-full md:w-[240px] font-normal text-left"
        >
          <CalendarIcon className="mr-2 w-4 h-4" />
          {selectedDate ? (
            format(selectedDate, "PPP")
          ) : (
            <span>{t("Pickadate")}</span>
          )}
        </Button>
      </PopoverTrigger>
      <PopoverContent
        className="p-0 rounded-xl w-auto overflow-hidden"
        align="end"
      >
        <Calendar
          mode="single"
          selected={selectedDate || undefined}
          onSelect={handleSelect}
          initialFocus
          className="bg-background"
        />
      </PopoverContent>
    </Popover>
  );
}
