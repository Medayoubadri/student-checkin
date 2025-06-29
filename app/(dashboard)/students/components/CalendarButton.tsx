import { Button } from "@/components/ui/button";
import { Calendar } from "@/components/ui/calendar";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { CalendarIcon } from "lucide-react";
import { format, isWeekend } from "date-fns";

interface CalendarButtonProps {
  onDateSelect: (date: Date | undefined) => void;
  selectedDate: Date | null;
}

export function CalendarButton({
  onDateSelect,
  selectedDate,
}: CalendarButtonProps) {
  const handleSelect = (newDate: Date | undefined) => {
    onDateSelect(newDate);
  };

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
            <span>Pick a date</span>
          )}
        </Button>
      </PopoverTrigger>
      <PopoverContent className="p-0 w-auto" align="start">
        <Calendar
          mode="single"
          selected={selectedDate || undefined}
          onSelect={handleSelect}
          initialFocus
          disabled={(date) => !isWeekend(date)}
        />
      </PopoverContent>
    </Popover>
  );
}
