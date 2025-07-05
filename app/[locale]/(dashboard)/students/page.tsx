"use client";

import { useState, useEffect, useCallback } from "react";
import { useSession } from "next-auth/react";
import { Input } from "@/components/ui/input";
import { StudentsTable } from "./components/StudentsTable";
import { CalendarButton } from "./components/CalendarButton";
import { ActionsButton } from "./components/ActionsButton";
import { SelectedDateDisplay } from "./components/SelectedDateDisplay";
import { EditStudentModal } from "./components/EditStudentModal";
import { Search, X } from "lucide-react";
import { useTranslations } from "next-intl";
import { DeleteConfirmationDialog } from "./components/DeleteConfirmationDialog";
import { useToast } from "@/hooks/use-toast";
import { Button } from "@/components/ui/button";

interface Student {
  id: string;
  name: string;
  age: number;
  gender: string;
  phoneNumber: string;
  createdAt: string;
}

export default function StudentsPage() {
  const { status } = useSession();
  const t = useTranslations("StudentsPage");
  const { toast } = useToast();
  const [students, setStudents] = useState<Student[]>([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedDate, setSelectedDate] = useState<Date | null>(null);
  const [editingStudent, setEditingStudent] = useState<Student | null>(null);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);
  const [studentsToDelete, setStudentsToDelete] = useState<string[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  const fetchStudents = useCallback(async () => {
    setIsLoading(true);
    try {
      let url = "/api/students";
      if (selectedDate) {
        url += `?date=${selectedDate}`;
      }
      const response = await fetch(url);
      const data = await response.json();
      if (Array.isArray(data)) {
        setStudents(data);
      } else {
        console.error("Unexpected data format:", data);
        setStudents([]);
      }
    } catch (error) {
      console.error("Error fetching students:", error);
      setStudents([]);
    } finally {
      setIsLoading(false);
    }
  }, [selectedDate]);

  useEffect(() => {
    if (status === "authenticated") {
      fetchStudents();
    }
  }, [status, fetchStudents]);

  if (status === "loading") {
    return (
      <div className="flex justify-center items-center w-full h-full">
        {t("loading")}
      </div>
    );
  }

  const handleClearSearch = () => {
    setSearchTerm("");
  };

  const handleSearch = (event: React.ChangeEvent<HTMLInputElement>) => {
    setSearchTerm(event.target.value);
  };

  const handleDateSelect = (date: Date | undefined) => {
    setSelectedDate(date || null);
  };

  const clearSelectedDate = () => {
    setSelectedDate(null);
  };

  const handleEdit = (student: Student) => {
    setEditingStudent(student);
    setIsEditModalOpen(true);
  };

  const handleSaveEdit = async (updatedStudent: Student) => {
    try {
      const response = await fetch(`/api/students`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(updatedStudent),
      });

      if (response.ok) {
        setStudents(
          students.map((s) => (s.id === updatedStudent.id ? updatedStudent : s))
        );
        toast({
          title: t("toastitle-update-success"),
          description: t("toastdescription-update-success"),
          variant: "success",
        });
        setIsEditModalOpen(false);
      } else {
        const errorData = await response.json();
        if (errorData.error === "A student with this name already exists") {
          toast({
            title: t("duplicateName-error"),
            description: t("duplicatename-error-description"),
            variant: "destructive",
          });
        } else {
          throw new Error("Failed to update student");
        }
      }
    } catch (error) {
      console.error("Error updating student:", error);
      toast({
        title: t("toastitle-update-error"),
        description: t("toastdescription-update-error"),
        variant: "destructive",
      });
    }
  };

  const handleDelete = async (studentId: string) => {
    setStudentsToDelete([studentId]);
    setIsDeleteDialogOpen(true);
  };

  const handleBulkDelete = (studentIds: string[]) => {
    setStudentsToDelete(studentIds);
    setIsDeleteDialogOpen(true);
  };

  const handleConfirmDelete = async () => {
    try {
      const deletePromises = studentsToDelete.map((id) =>
        fetch(`/api/students?id=${id}`, { method: "DELETE" })
      );
      await Promise.all(deletePromises);

      setStudents(students.filter((s) => !studentsToDelete.includes(s.id)));
      toast({
        title: t("toastitle-delete-success"),
        description: t("toastdescription-delete-success", {
          count: studentsToDelete.length,
        }),
        variant: "success",
      });
    } catch (error) {
      console.error("Error deleting students:", error);
      toast({
        title: t("toastitle-delete-error"),
        description: t("toastdescription-delete-error"),
        variant: "destructive",
      });
    }
    setIsDeleteDialogOpen(false);
    setStudentsToDelete([]);
  };

  return (
    <div className="flex flex-col items-center gap-4 md:mt-0 p-4 md:p-6 w-full h-full overflow-y-auto">
      <div className="flex flex-col items-center gap-4 w-full lg:max-w-7xl">
        <div className="flex justify-between items-center mb-4 md:mb-6">
          <h1 className="w-full lg:max-w-7xl font-bold text-2xl md:text-4xl">
            {t("title")}
          </h1>
        </div>
        <div className="flex flex-col items-center gap-4 w-full lg:max-w-7xl">
          <div className="flex md:flex-row flex-col md:justify-between gap-4 md:space-x-4 mb-4 w-full">
            <div className="flex md:flex-row flex-col md:items-center gap-4 w-full md:w-auto">
              <div className="relative w-full md:w-72">
                <Search className="top-1/2 left-2 absolute w-4 h-4 text-muted-foreground -translate-y-1/2 transform" />
                <Input
                  placeholder={t("SearchPlaceholder")}
                  value={searchTerm}
                  onChange={handleSearch}
                  className="pr-10 pl-8 w-full"
                />
                {searchTerm && (
                  <Button
                    variant="ghost"
                    size="icon"
                    className="top-0 right-0 absolute h-full"
                    onClick={handleClearSearch}
                  >
                    <X className="w-4 h-4" />
                  </Button>
                )}
              </div>
            </div>
            <SelectedDateDisplay
              selectedDate={selectedDate}
              onClear={clearSelectedDate}
            />
            <div className="flex gap-2 md:gap-4">
              <CalendarButton
                onDateSelect={handleDateSelect}
                selectedDate={selectedDate}
              />
              <ActionsButton onImportComplete={fetchStudents} />
            </div>
          </div>
          <StudentsTable
            students={students}
            searchTerm={searchTerm}
            selectedDate={selectedDate}
            onEdit={handleEdit}
            onDelete={handleDelete}
            onBulkDelete={handleBulkDelete}
            isLoading={isLoading}
          />
          <EditStudentModal
            student={editingStudent}
            isOpen={isEditModalOpen}
            onClose={() => setIsEditModalOpen(false)}
            onSave={handleSaveEdit}
          />
          <DeleteConfirmationDialog
            isOpen={isDeleteDialogOpen}
            onClose={() => setIsDeleteDialogOpen(false)}
            onConfirm={handleConfirmDelete}
            itemName={
              studentsToDelete.length > 1 ? t("students") : t("student")
            }
          />
        </div>
      </div>
    </div>
  );
}
