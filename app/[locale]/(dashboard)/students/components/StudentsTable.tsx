"use client";

import { useState } from "react";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import { AnimatePresence, motion } from "framer-motion";
import {
  ChevronLeft,
  ChevronRight,
  ChevronsLeft,
  ChevronsRight,
  Edit,
  EllipsisVertical,
  Trash2,
} from "lucide-react";
import { useTranslations } from "next-intl";
import { Skeleton } from "@/components/ui/skeleton";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

interface Student {
  id: string;
  name: string;
  age: number;
  gender: string;
  phoneNumber: string;
  image: string;
  createdAt: string;
}

interface StudentsTableProps {
  students: Student[];
  searchTerm: string;
  selectedDate: Date | null;
  onEdit: (student: Student) => void;
  onDelete: (studentId: string) => void;
  onBulkDelete: (studentIds: string[]) => void;
  isLoading: boolean;
}

// StudentsTable component for displaying and managing student records
// This component includes sorting, filtering, and pagination functionalities
// It allows the user to edit, delete, and bulk delete student records
export function StudentsTable({
  students = [],
  searchTerm,
  selectedDate,
  onEdit,
  onDelete,
  onBulkDelete,
  isLoading,
}: StudentsTableProps) {
  const [currentPage, setCurrentPage] = useState(1);
  const t = useTranslations("StudentsTable");
  const [studentsPerPage, setStudentsPerPage] = useState(10);
  const [sortColumn, setSortColumn] = useState<keyof Student>("name");
  const [sortDirection, setSortDirection] = useState<"asc" | "desc">("asc");
  const [selectedStudents, setSelectedStudents] = useState<string[]>([]);

  // This function handles sorting of the table based on the selected column
  const handleSort = (column: keyof Student) => {
    if (column === sortColumn) {
      setSortDirection(sortDirection === "asc" ? "desc" : "asc");
    } else {
      setSortColumn(column);
      setSortDirection("asc");
    }
  };

  // Filter students based on the search term and selected date
  const filteredStudents = students.filter((student) =>
    student.name.toLowerCase().includes(searchTerm.toLowerCase())
  );

  // Sort the filtered students based on the selected column and direction
  const sortedStudents = [...filteredStudents].sort((a, b) => {
    if (a[sortColumn] < b[sortColumn]) return sortDirection === "asc" ? -1 : 1;
    if (a[sortColumn] > b[sortColumn]) return sortDirection === "asc" ? 1 : -1;
    return 0;
  });

  // Pagination logic
  // Calculate the indices for slicing the sorted students array
  const indexOfLastStudent = currentPage * studentsPerPage;
  // Calculate the index of the first student in the current page
  const indexOfFirstStudent = indexOfLastStudent - studentsPerPage;
  // Slice the sorted students array to get the current page's students
  const currentStudents = sortedStudents.slice(
    indexOfFirstStudent,
    indexOfLastStudent
  );

  // Handle pagination
  // This function updates the current page based on the selected page number
  const paginate = (pageNumber: number) => setCurrentPage(pageNumber);

  // This function checks if a student is new (created within the last week)
  // It compares the student's creation date with the current date minus 7 days
  const isNewStudent = (createdAt: string) => {
    const oneWeekAgo = new Date();
    oneWeekAgo.setDate(oneWeekAgo.getDate() - 7);
    return new Date(createdAt) > oneWeekAgo;
  };

  // Handle selection of individual students
  const handleSelectStudent = (studentId: string) => {
    setSelectedStudents((prev) =>
      prev.includes(studentId)
        ? prev.filter((id) => id !== studentId)
        : [...prev, studentId]
    );
  };

  // This function toggles the selection of all students in the current page
  const handleSelectAllStudents = () => {
    setSelectedStudents(
      selectedStudents.length === currentStudents.length
        ? []
        : currentStudents.map((student) => student.id)
    );
  };

  // This function handles the deletion of a single student
  const handleDeleteClick = (studentId: string) => {
    onDelete(studentId);
  };

  // This function handles the bulk deletion of selected students
  const handleBulkDelete = () => {
    onBulkDelete(selectedStudents);
    setSelectedStudents([]);
  };

  // Render the table with sorting, filtering, and pagination functionalities
  return (
    <>
      <div className="relative border rounded-xl w-full [&>div]:max-h-[calc(100vh-350px)] overflow-hidden">
        <Table className="[&_tfoot_td]:border-t [&_td]:border-border [&_th]:border-b [&_th]:border-border [&_tr:not(:last-child)_td]:border-b [&_tr]:border-none border-separate border-spacing-0">
          <TableHeader className="top-0 z-10 sticky bg-background/80 dark:bg-background/90 backdrop-blur-[100px] rounded-xl">
            <TableRow>
              <TableHead className="w-[50px]">
                <Checkbox
                  checked={
                    selectedStudents.length === currentStudents.length &&
                    currentStudents.length > 0
                  }
                  onCheckedChange={handleSelectAllStudents}
                />
              </TableHead>
              <TableHead className="w-[50px]">{t("No")}</TableHead>
              <TableHead
                onClick={() => handleSort("name")}
                className="w-28 md:w-1/2 whitespace-nowrap cursor-pointer"
              >
                {t("FullName")}
                {sortColumn === "name" &&
                  (sortDirection === "asc" ? " ↑" : " ↓")}
              </TableHead>
              <TableHead
                onClick={() => handleSort("age")}
                className="w-[100px] whitespace-nowrap cursor-pointer"
              >
                {t("Age")}
                {sortColumn === "age" &&
                  (sortDirection === "asc" ? " ↑" : " ↓")}
              </TableHead>
              <TableHead
                onClick={() => handleSort("gender")}
                className="hidden md:table-cell w-[150px] whitespace-nowrap cursor-pointer"
              >
                {t("Gender")}
                {sortColumn === "gender" &&
                  (sortDirection === "asc" ? " ↑" : " ↓")}
              </TableHead>
              <TableHead className="hidden md:table-cell w-[350px]">
                {t("PhoneNumber")}
              </TableHead>
              <TableHead className="w-[100px]">{t("Edit")}</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {/* Render the table with sorting, filtering, and pagination functionalities */}
            {isLoading
              ? // Loading skeleton
                Array.from({ length: 6 }).map((_, index) => (
                  <TableRow key={index}>
                    {Array.from({ length: 7 }).map((_, cellIndex) => (
                      <TableCell key={cellIndex}>
                        <Skeleton className="w-full h-9" />
                      </TableCell>
                    ))}
                  </TableRow>
                ))
              : // Existing table body content
                currentStudents.map((student, index) => (
                  <TableRow key={student.id}>
                    <TableCell>
                      <Checkbox
                        checked={selectedStudents.includes(student.id)}
                        onCheckedChange={() => handleSelectStudent(student.id)}
                      />
                    </TableCell>
                    <TableCell>{indexOfFirstStudent + index + 1}</TableCell>
                    <TableCell className="w-[150px] md:w-auto truncate">
                      {student.name}
                      {isNewStudent(student.createdAt) && (
                        <div className="bg-green-500 ml-2 rounded-full w-2 h-2" />
                      )}
                    </TableCell>
                    <TableCell className="whitespace-nowrap">
                      {student.age}
                    </TableCell>
                    <TableCell className="hidden md:table-cell whitespace-nowrap">
                      {student.gender === "Female"
                        ? t("female")
                        : student.gender === "Male"
                        ? t("male")
                        : student.gender}
                    </TableCell>
                    <TableCell className="hidden md:table-cell">
                      {student.phoneNumber}
                    </TableCell>
                    <TableCell>
                      <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                          <Button variant="outline" size="sm">
                            <EllipsisVertical className="" />
                          </Button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent align="end">
                          <DropdownMenuItem
                            className="cursor-pointer"
                            onClick={() => onEdit(student)}
                          >
                            <Edit className="w-4 h-4" />
                            {t("Edit")}
                          </DropdownMenuItem>
                          <DropdownMenuItem
                            className="hover:!bg-red-800 text-red-600 hover:!text-destructive-foreground cursor-pointer"
                            onClick={() => handleDeleteClick(student.id)}
                          >
                            <Trash2 className="w-4 h-4" />
                            {t("Delete")}
                          </DropdownMenuItem>
                        </DropdownMenuContent>
                      </DropdownMenu>
                    </TableCell>
                  </TableRow>
                ))}
          </TableBody>
        </Table>
        {/* Show a message when no students are found for the selected date */}
        {!isLoading && currentStudents.length === 0 && (
          <div className="flex justify-center items-end py-4 w-full h-1/2 text-muted-foreground text-center">
            {selectedDate
              ? `${t("noStudentsFound")} ${
                  searchTerm ? t("forSearch") : ""
                } for the selected date.`
              : `${t("noStudentsFound")}${searchTerm ? t("forSearch") : "."}`}
          </div>
        )}
      </div>
      {/* This button appears when one or more students are selected */}
      <AnimatePresence>
        {selectedStudents.length > 0 && (
          <motion.div
            initial={{ y: 100, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            exit={{ y: 100, opacity: 0 }}
            transition={{ type: "spring", stiffness: 300, damping: 30 }}
            className="md:right-1/3 bottom-56 md:bottom-28 z-10 absolute rounded-md text-destructive-foreground"
          >
            <Button
              onClick={handleBulkDelete}
              variant="default"
              className="bg-destructive hover:bg-red-800 shadow-[0px_-10px_100px_rgba(173,0,1)] drop-shadow-xl px-10 py-6 hover:text-white"
            >
              {t("deleteBulk", { count: selectedStudents.length })}
            </Button>
          </motion.div>
        )}
      </AnimatePresence>
      {/* This section allows users to navigate through pages of students */}
      {!isLoading && (
        <div className="flex justify-between items-center md:items-center gap-4 w-full">
          <Select
            value={studentsPerPage.toString()}
            onValueChange={(value) => setStudentsPerPage(Number(value))}
          >
            <SelectTrigger className="bg-background w-full md:w-[200px]">
              <SelectValue
                placeholder="Students per page"
                className="flex gap-2"
              />
            </SelectTrigger>
            <SelectContent className="bg-background">
              {[5, 10, 30, 60, 100].map((value) => (
                <SelectItem key={value} value={value.toString()}>
                  {value}
                  {t("itemPerPage")}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
          <p className="hidden md:block">
            <span className="font-semibold">{filteredStudents.length}</span>{" "}
            {t("studentsTotal")}
          </p>
          <div className="flex justify-center items-center space-x-2 w-full md:w-auto">
            <Button
              variant="outline"
              size="sm"
              onClick={() => paginate(1)}
              disabled={currentPage === 1}
            >
              <ChevronsLeft className="w-4 h-4" />
            </Button>
            <Button
              variant="outline"
              size="sm"
              onClick={() => paginate(currentPage - 1)}
              disabled={currentPage === 1}
            >
              <ChevronLeft className="w-4 h-4" />
            </Button>
            <Button
              variant="outline"
              size="sm"
              onClick={() => paginate(currentPage + 1)}
              disabled={indexOfLastStudent >= filteredStudents.length}
            >
              <ChevronRight className="w-4 h-4" />
            </Button>
            <Button
              variant="outline"
              size="sm"
              onClick={() =>
                paginate(Math.ceil(filteredStudents.length / studentsPerPage))
              }
              disabled={indexOfLastStudent >= filteredStudents.length}
            >
              <ChevronsRight className="w-4 h-4" />
            </Button>
          </div>
        </div>
      )}
    </>
  );
}
