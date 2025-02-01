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
  Trash2,
} from "lucide-react";
import { useTranslations } from "next-intl";

interface Student {
  id: string;
  name: string;
  age: number;
  gender: string;
  phoneNumber: string;
  createdAt: string;
}

interface StudentsTableProps {
  students: Student[];
  searchTerm: string;
  selectedDate: Date | null;
  onEdit: (student: Student) => void;
  onDelete: (studentId: string) => void;
  onBulkDelete: (studentIds: string[]) => void;
}

export function StudentsTable({
  students = [],
  searchTerm,
  selectedDate,
  onEdit,
  onDelete,
  onBulkDelete,
}: StudentsTableProps) {
  const [currentPage, setCurrentPage] = useState(1);
  const t = useTranslations("StudentsTable");
  const [studentsPerPage, setStudentsPerPage] = useState(10);
  const [sortColumn, setSortColumn] = useState<keyof Student>("name");
  const [sortDirection, setSortDirection] = useState<"asc" | "desc">("asc");
  const [selectedStudents, setSelectedStudents] = useState<string[]>([]);

  const handleSort = (column: keyof Student) => {
    if (column === sortColumn) {
      setSortDirection(sortDirection === "asc" ? "desc" : "asc");
    } else {
      setSortColumn(column);
      setSortDirection("asc");
    }
  };

  const filteredStudents = students.filter((student) =>
    student.name.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const sortedStudents = [...filteredStudents].sort((a, b) => {
    if (a[sortColumn] < b[sortColumn]) return sortDirection === "asc" ? -1 : 1;
    if (a[sortColumn] > b[sortColumn]) return sortDirection === "asc" ? 1 : -1;
    return 0;
  });

  const indexOfLastStudent = currentPage * studentsPerPage;
  const indexOfFirstStudent = indexOfLastStudent - studentsPerPage;
  const currentStudents = sortedStudents.slice(
    indexOfFirstStudent,
    indexOfLastStudent
  );

  const paginate = (pageNumber: number) => setCurrentPage(pageNumber);

  const isNewStudent = (createdAt: string) => {
    const oneWeekAgo = new Date();
    oneWeekAgo.setDate(oneWeekAgo.getDate() - 7);
    return new Date(createdAt) > oneWeekAgo;
  };

  const handleSelectStudent = (studentId: string) => {
    setSelectedStudents((prev) =>
      prev.includes(studentId)
        ? prev.filter((id) => id !== studentId)
        : [...prev, studentId]
    );
  };

  const handleSelectAllStudents = () => {
    setSelectedStudents(
      selectedStudents.length === currentStudents.length
        ? []
        : currentStudents.map((student) => student.id)
    );
  };

  const handleDeleteClick = (studentId: string) => {
    onDelete(studentId);
  };

  const handleBulkDelete = () => {
    onBulkDelete(selectedStudents);
    setSelectedStudents([]);
  };

  return (
    <>
      <div className="relative border rounded-md w-full overflow-x-auto">
        <Table>
          <TableHeader className="bg-primary/20">
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
                className="whitespace-nowrap cursor-pointer"
              >
                {t("FullName")}
                {sortColumn === "name" &&
                  (sortDirection === "asc" ? " ↑" : " ↓")}
              </TableHead>
              <TableHead
                onClick={() => handleSort("age")}
                className="whitespace-nowrap cursor-pointer"
              >
                {t("Age")}
                {sortColumn === "age" &&
                  (sortDirection === "asc" ? " ↑" : " ↓")}
              </TableHead>
              <TableHead
                onClick={() => handleSort("gender")}
                className="whitespace-nowrap cursor-pointer"
              >
                {t("Gender")}
                {sortColumn === "gender" &&
                  (sortDirection === "asc" ? " ↑" : " ↓")}
              </TableHead>
              <TableHead className="hidden w-[250px] md:table-cell">
                {t("PhoneNumber")}
              </TableHead>
              <TableHead className="w-[100px]">{t("Edit")}</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody className="bg-background">
            {currentStudents.map((student, index) => (
              <TableRow key={student.id}>
                <TableCell>
                  <Checkbox
                    checked={selectedStudents.includes(student.id)}
                    onCheckedChange={() => handleSelectStudent(student.id)}
                  />
                </TableCell>
                <TableCell>{indexOfFirstStudent + index + 1}</TableCell>
                <TableCell className="flex items-center w-[150px] md:w-auto truncate">
                  {student.name}
                  {isNewStudent(student.createdAt) && (
                    <div className="bg-green-500 ml-2 rounded-full w-2 h-2" />
                  )}
                </TableCell>
                <TableCell className="whitespace-nowrap">
                  {student.age}
                </TableCell>
                <TableCell className="whitespace-nowrap">
                  {student.gender}
                </TableCell>
                <TableCell className="hidden md:table-cell">
                  {student.phoneNumber}
                </TableCell>
                <TableCell>
                  <div className="flex space-x-2">
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => onEdit(student)}
                    >
                      <Edit className="w-4 h-4" />
                    </Button>
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => handleDeleteClick(student.id)}
                    >
                      <Trash2 className="w-4 h-4" />
                    </Button>
                  </div>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>
      <AnimatePresence>
        {selectedStudents.length > 0 && (
          <motion.div
            initial={{ y: 100, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            exit={{ y: 100, opacity: 0 }}
            transition={{ type: "spring", stiffness: 300, damping: 30 }}
            className="right-1/3 bottom-12 absolute rounded-md text-destructive-foreground"
          >
            <Button
              onClick={handleBulkDelete}
              variant="default"
              className="bg-destructive hover:bg-red-800 drop-shadow-xl shadow-[0px_-10px_100px_rgba(173,0,0)] px-10 py-6 hover:text-white"
            >
              {t("deleteBulk", { count: selectedStudents.length })}
            </Button>
          </motion.div>
        )}
      </AnimatePresence>
      {currentStudents.length === 0 && (
        <div className="py-4 text-center">
          {selectedDate
            ? `${t("noStudentsFound")} ${
                searchTerm ? t("forSearch") : ""
              } for the selected date.`
            : `${t("noStudentsFound")}${searchTerm ? t("forSearch") : "."}`}
        </div>
      )}
      <div className="flex justify-between items-center md:items-center gap-4 py-4 w-full">
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
          <SelectContent>
            {[5, 10, 20, 50].map((value) => (
              <SelectItem key={value} value={value.toString()}>
                {value}
                {t("itemPerPage")}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
        <p>
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
    </>
  );
}
