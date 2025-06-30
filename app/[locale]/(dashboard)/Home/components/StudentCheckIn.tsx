import { useState } from "react";
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
import { ChevronDown } from "lucide-react";
import { NewStudentModal } from "@/app/[locale]/(dashboard)/Home/components/AddStudentModal";
import { useMediaQuery } from "@/hooks/use-media-query";
import { useTranslations } from "next-intl";

interface StudentCheckInProps {
  onCheckIn: () => void;
  refreshRecentActivity: () => void;
}

export function StudentCheckIn({
  onCheckIn,
  refreshRecentActivity,
}: StudentCheckInProps) {
  const t = useTranslations("Index");
  const [name, setName] = useState("");
  const [age, setAge] = useState("");
  const [gender, setGender] = useState("");
  const [showAdditionalFields, setShowAdditionalFields] = useState(false);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const isDesktop = useMediaQuery("(min-width: 768px)");

  const handleCheck = async () => {
    try {
      const checkResponse = await fetch(
        `/api/students?name=${encodeURIComponent(name)}`
      );
      const existingStudent = await checkResponse.json();

      if (existingStudent) {
        await markAttendance(existingStudent.id);
      } else {
        if (isDesktop) {
          setIsModalOpen(true);
        } else {
          setShowAdditionalFields(true);
        }
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
    submittedGender: string
  ) => {
    try {
      const createResponse = await fetch("/api/students", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          name: submittedName,
          age: Number.parseInt(submittedAge),
          gender: submittedGender,
        }),
      });
      if (!createResponse.ok) {
        throw new Error("Failed to create student");
      }
      const newStudent = await createResponse.json();
      await markAttendance(newStudent.id);
      setShowAdditionalFields(false);
      setIsModalOpen(false);
      setAge("");
      setGender("");
    } catch (error) {
      console.error("Error creating student:", error);
      toast({
        title: "Error",
        description: "Failed to create student. Please try again.",
        variant: "destructive",
      });
    }
  };

  const markAttendance = async (studentId: string) => {
    const attendanceResponse = await fetch("/api/attendance", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ studentId }),
    });

    const result = await attendanceResponse.json();

    if (attendanceResponse.ok) {
      toast({
        variant: "success",
        title: "Attendance",
        description: result.message,
      });
      setName("");
      onCheckIn();
      refreshRecentActivity();
    } else {
      toast({
        title: "Error",
        description: result.error,
        variant: "destructive",
      });
    }
    if (attendanceResponse.status === 201) {
      toast({
        variant: "info",
        title: "Already Marked",
        description: result.message,
      });
    }
  };

  return (
    <Card className="bg-background w-full">
      <CardHeader>
        <CardTitle className="font-bold text-2xl text-center">
          {t("studentCheckIn")}
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="name">{t("fullName")}</Label>
            <Input
              id="name"
              value={name}
              onKeyDown={(e) => {
                if (e.key === "Enter") {
                  handleCheck();
                }
              }}
              onChange={(e) => setName(e.target.value)}
              className="bg-background dark:bg-zinc-900 dark:border-none"
              placeholder={t("fullName")}
              required
            />
          </div>
          {!showAdditionalFields && (
            <Button onClick={handleCheck} className="w-full">
              {t("check")}
            </Button>
          )}
          {showAdditionalFields && (
            <form
              onSubmit={(e) => {
                e.preventDefault();
                handleSubmit(name, age, gender);
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
                      <span className="flex items-center w-full text-left text-muted-foreground">
                        {gender
                          ? t(gender as "male" | "female")
                          : t("selectGender")}
                        <ChevronDown className="ml-auto w-4 h-4" />
                      </span>
                    </Button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent className="flex flex-col gap-3 px-4 py-2 w-[320px] lg:w-[400px]">
                    <DropdownMenuItem onClick={() => setGender("male")}>
                      {t("male")}
                    </DropdownMenuItem>
                    <DropdownMenuItem onClick={() => setGender("female")}>
                      {t("female")}
                    </DropdownMenuItem>
                  </DropdownMenuContent>
                </DropdownMenu>
              </div>
              <Button type="submit" className="w-full">
                {t("submit")}
              </Button>
            </form>
          )}
        </div>
        <NewStudentModal
          isOpen={isModalOpen}
          onClose={() => setIsModalOpen(false)}
          onSubmit={handleSubmit}
          name={name}
        />
      </CardContent>
    </Card>
  );
}
