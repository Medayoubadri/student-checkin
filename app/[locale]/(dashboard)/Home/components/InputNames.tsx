"use client";

import { useState, useRef, useCallback, useEffect } from "react";
import { Input } from "@/components/ui/input";
import { Card, CardContent } from "@/components/ui/card";
import { useTranslations } from "next-intl";

interface Student {
  id: string;
  name: string;
}

interface NameInputsProps {
  value: string;
  onChange: (value: string) => void;
  onSelectStudent: (student: Student) => void;
}

export function NameInputs({
  value,
  onChange,
  onSelectStudent,
}: NameInputsProps) {
  const t = useTranslations("HomePage");
  const [suggestions, setSuggestions] = useState<Student[]>([]);
  const inputRef = useRef<HTMLInputElement>(null);
  const [isLoading, setIsLoading] = useState(false);

  const fetchSuggestions = useCallback(async (query: string) => {
    try {
      setIsLoading(true);
      const response = await fetch(
        `/api/students/names?name=${encodeURIComponent(query)}`
      );
      if (!response.ok) throw new Error("Failed to fetch");
      const data = await response.json();
      setSuggestions(data);
    } catch (error) {
      console.error("Error fetching suggestions:", error);
      setSuggestions([]);
    } finally {
      setIsLoading(false);
    }
  }, []);

  const debouncedFetch = useDebounce(fetchSuggestions, 300);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const newValue = e.target.value;
    onChange(newValue);
    if (newValue.length >= 3) {
      debouncedFetch(newValue);
    } else {
      setSuggestions([]);
    }
  };

  const handleSelect = (student: Student) => {
    onChange(student.name);
    setSuggestions([]);
    onSelectStudent(student);
    inputRef.current?.focus();
  };
  return (
    <div className="relative w-full">
      <Input
        ref={inputRef}
        value={value}
        onChange={handleInputChange}
        placeholder={t("startTypingStudentName")}
      />
      {suggestions.length > 0 && (
        <Card className="z-10 absolute mt-1 w-full">
          <CardContent className="p-0">
            <ul className="py-2 max-h-60 overflow-auto">
              {suggestions.map((student) => (
                <li
                  key={student.id}
                  className="hover:bg-gray-100 px-4 py-2 cursor-pointer"
                  onClick={() => handleSelect(student)}
                >
                  {student.name}
                </li>
              ))}
              {isLoading && (
                <li className="px-4 py-2 text-muted-foreground">
                  {t("loading")}
                </li>
              )}
            </ul>
          </CardContent>
        </Card>
      )}
    </div>
  );
}

// Custom debounce hook
// eslint-disable-next-line @typescript-eslint/no-unsafe-function-type
function useDebounce(callback: Function, delay: number) {
  const timerRef = useRef<NodeJS.Timeout>();

  useEffect(() => {
    return () => {
      if (timerRef.current) clearTimeout(timerRef.current);
    };
  }, []);

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  return (...args: any[]) => {
    if (timerRef.current) clearTimeout(timerRef.current);
    timerRef.current = setTimeout(() => callback(...args), delay);
  };
}
