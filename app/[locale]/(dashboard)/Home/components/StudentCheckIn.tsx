// app/[locale]/(dashboard)/Home/components/StudentCheckIn.tsx
import { useState, useRef, useCallback } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { toast } from "@/hooks/use-toast";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { ChevronDown, X } from "lucide-react";
import { NewStudentModal } from "@/app/[locale]/(dashboard)/Home/components/AddStudentModal";
import { useMediaQuery } from "@/hooks/use-media-query";
import { useTranslations } from "next-intl";
import { studentService } from "@/utils/studentService";
import { attendanceService } from "@/utils/attendanceService";
import { attendanceLogService } from "@/utils/attendanceLogService";

interface StudentCheckInProps {
  onCheckIn: () => void;
  refreshRecentActivity: () => void;
}

interface Student {
  id: string;
  name: string;
}

export function StudentCheckIn({
  onCheckIn,
  refreshRecentActivity,
}: StudentCheckInProps) {
  const t = useTranslations("HomePage");
  const [name, setName] = useState("");
  const [suggestions, setSuggestions] = useState<Student[]>([]);
  const inputRef = useRef<HTMLInputElement>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [age, setAge] = useState("");
  const [gender, setGender] = useState("");
  const [phoneNumber, setPhoneNumber] = useState("");
  const [showAdditionalFields, setShowAdditionalFields] = useState(false);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const isDesktop = useMediaQuery("(min-width: 768px)");

  const normalizeName = (name: string): string => {
    return name.toLowerCase().split(" ").sort().join(" ");
  };

  const handleCheck = async () => {
    try {
      const normalizedName = normalizeName(name);
      const students = await studentService.searchStudents(normalizedName);
      const existingStudent = students[0];

      if (existingStudent) {
        await markAttendance(existingStudent.id);
      } else {
        setIsLoading(true);
        if (isDesktop) {
          setIsModalOpen(true);
        } else {
          setShowAdditionalFields(true);
        }
        studentService.invalidateCache();
        setIsLoading(false);
      }
    } catch (error) {
      console.error("Error checking student:", error);
      toast({
        title: "Error",
        description: "Failed to check student. Please try again.",
        variant: "destructive",
      });
    }
  };

  const handleSubmit = async (
    submittedName: string,
    submittedAge: string,
    submittedGender: string,
    submittedPhoneNumber: string
  ) => {
    try {
      setIsLoading(true);
      const newStudent = await studentService.createStudent({
        name: submittedName,
        age: Number(submittedAge),
        gender: submittedGender,
        phoneNumber: submittedPhoneNumber,
      });

      await markAttendance(newStudent.id);
      setShowAdditionalFields(false);
      setIsModalOpen(false);
      setAge("");
      setGender("");
      setPhoneNumber("");
    } catch (error) {
      console.error("Error creating student:", error);
      toast({
        title: "Error",
        description: "Failed to create student. Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  const markAttendance = async (studentId: string) => {
    try {
      // Optimistically invalidate cache before API call
      const result = await attendanceService.markAttendance(studentId);
      switch (result.status) {
        case 200:
          toast({
            variant: "success",
            title: t("checkInSuccess-Title"),
            description: t("checkInSuccess-Description"),
          });
          onCheckIn();
          refreshRecentActivity();
          attendanceLogService.invalidateCache(undefined, new Date());
          attendanceLogService.invalidateTotalCache();
          setName("");
          break;
        case 201:
          toast({
            variant: "info",
            title: t("checkInMarked-Title"),
            description: t("checkInMarked-Description"),
          });
          setName("");
          break;
      }
    } catch (error) {
      console.error("Error marking attendance:", error);
      toast({
        variant: "destructive",
        title: t("checkInError-Title"),
        description: t("checkInError-Description"),
      });
    }
  };

  const fetchSuggestions = useCallback(async (query: string) => {
    try {
      setIsLoading(true);
      const students = await studentService.searchStudents(query);
      setSuggestions(students);
    } catch (error) {
      console.error("Error fetching suggestions:", error);
      setSuggestions([]);
    } finally {
      setIsLoading(false);
    }
  }, []);

  const debouncedFetch = useDebounce(fetchSuggestions, 300);

  // Update handleInputChange to prevent unnecessary state updates
  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const newValue = e.target.value;
    if (newValue === name) return;

    setName(newValue);
    if (newValue.length >= 2) {
      debouncedFetch(newValue);
    } else {
      setSuggestions([]);
    }
  };

  const handleClearName = () => {
    setName("");
    setSuggestions([]);
  };

  const handleSelect = async (student: Student) => {
    setName(student.name);
    setSuggestions([]);
    setIsLoading(true);
    await markAttendance(student.id);
    setIsLoading(false);
    inputRef.current?.focus();
  };

  return (
    <Card className="bg-background w-full">
      <CardHeader>
        <CardTitle className="font-bold text-xl md:text-2xl text-center">
          {t("studentCheckIn")}
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="name">{t("fullName")}</Label>
            <div className="relative w-full">
              <Input
                ref={inputRef}
                value={name}
                onChange={handleInputChange}
                placeholder={t("startTypingStudentName")}
              />
              {suggestions.length > 0 && (
                <Card className="z-10 absolute mt-1 w-full">
                  <CardContent className="p-0">
                    <ul className="bg-background px-2 py-2 rounded-xl max-h-60 overflow-auto">
                      {suggestions.map((student) => (
                        <li
                          key={student.id}
                          className="hover:bg-gray-100/10 px-4 py-2 rounded-md cursor-pointer"
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
              {name && (
                <Button
                  variant="default"
                  size="icon"
                  className="top-0 right-0 absolute bg-transparent hover:bg-transparent shadow-none h-full text-destructive hover:text-red-500"
                  onClick={handleClearName}
                >
                  <X className="mr-4 p-0 !w-5 !h-5" />
                </Button>
              )}
            </div>
          </div>
          {!showAdditionalFields && (
            <Button
              onClick={handleCheck}
              className="w-full"
              disabled={!name || isLoading}
            >
              {isLoading ? t("loading") : t("check")}
            </Button>
          )}
          {showAdditionalFields && (
            <form
              onSubmit={(e) => {
                e.preventDefault();
                handleSubmit(name, age, gender, phoneNumber);
              }}
              className="space-y-4"
            >
              <div className="space-y-2">
                <Label htmlFor="age">{t("age")}</Label>
                <Input
                  id="age"
                  type="number"
                  className="bg-background dark:bg-zinc-900 dark:border-none"
                  value={age}
                  onChange={(e) => setAge(e.target.value)}
                  placeholder={t("age")}
                  required
                />
              </div>
              <div>
                <Label htmlFor="gender">{t("gender")}</Label>
                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <Button
                      variant="secondary"
                      className="bg-background dark:bg-zinc-900 mt-2 border dark:border-none w-full"
                    >
                      <span className="flex items-center w-full text-muted-foreground text-left">
                        {gender
                          ? t(gender as "male" | "female")
                          : t("selectGender")}
                        <ChevronDown className="ml-auto w-4 h-4" />
                      </span>
                    </Button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent className="flex flex-col gap-3 px-4 py-2 w-[320px] lg:w-[400px]">
                    <DropdownMenuItem onClick={() => setGender("Male")}>
                      {t("Male")}
                    </DropdownMenuItem>
                    <DropdownMenuItem onClick={() => setGender("Female")}>
                      {t("Female")}
                    </DropdownMenuItem>
                  </DropdownMenuContent>
                </DropdownMenu>
              </div>
              <div className="space-y-2"></div>
              <Label htmlFor="phoneNumber">
                {t("phoneNumber")}
                <Input
                  id="phoneNumber"
                  type="tel"
                  className="bg-background dark:bg-zinc-900 dark:border-none"
                  value={phoneNumber}
                  onChange={(e) => setPhoneNumber(e.target.value)}
                  placeholder={t("phoneNumber")}
                />
              </Label>
              <Button
                type="submit"
                className="w-full"
                disabled={!name || !age || !gender || isLoading}
              >
                {isLoading ? t("loading") : t("submit")}
              </Button>
            </form>
          )}
        </div>
        <NewStudentModal
          isOpen={isModalOpen}
          onClose={() => {
            if (!isLoading) {
              setIsModalOpen(false);
              setAge("");
              setGender("");
              setPhoneNumber("");
            }
          }}
          onSubmit={handleSubmit}
          name={name}
          isLoading={isLoading}
        />
      </CardContent>
    </Card>
  );
}

// eslint-disable-next-line @typescript-eslint/no-unsafe-function-type
function useDebounce(callback: Function, delay: number) {
  const timerRef = useRef<number>();

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  return (...args: any[]) => {
    window.clearTimeout(timerRef.current);
    timerRef.current = window.setTimeout(() => callback(...args), delay);
  };
}
