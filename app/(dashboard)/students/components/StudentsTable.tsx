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
import {
  ChevronLeft,
  ChevronRight,
  ChevronsLeft,
  ChevronsRight,
} from "lucide-react";

interface Student {
  id: string;
  name: string;
  age: number;
  gender: string;
  createdAt: string;
}

interface StudentsTableProps {
  students: Student[];
  searchTerm: string;
}

export function StudentsTable({ students, searchTerm }: StudentsTableProps) {
  const [currentPage, setCurrentPage] = useState(1);
  const [studentsPerPage, setStudentsPerPage] = useState(10);
  const [sortColumn, setSortColumn] = useState<keyof Student>("name");
  const [sortDirection, setSortDirection] = useState<"asc" | "desc">("asc");

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
    const oneMonthAgo = new Date();
    oneMonthAgo.setMonth(oneMonthAgo.getMonth() - 1);
    return new Date(createdAt) > oneMonthAgo;
  };

  return (
    <>
      <div className="border rounded-md overflow-x-auto">
        <Table>
          <TableHeader className="bg-primary/20">
            <TableRow>
              <TableHead className="w-[50px]">No.</TableHead>
              <TableHead
                onClick={() => handleSort("name")}
                className="whitespace-nowrap cursor-pointer"
              >
                Full Name
                {sortColumn === "name" && (sortDirection === "asc" ? "▲" : "▼")}
              </TableHead>
              <TableHead
                onClick={() => handleSort("age")}
                className="whitespace-nowrap cursor-pointer"
              >
                Age
                {sortColumn === "age" && (sortDirection === "asc" ? "▲" : "▼")}
              </TableHead>
              <TableHead
                onClick={() => handleSort("gender")}
                className="whitespace-nowrap cursor-pointer"
              >
                Gender
                {sortColumn === "gender" &&
                  (sortDirection === "asc" ? "▲" : "▼")}
              </TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {currentStudents.map((student, index) => (
              <TableRow key={student.id}>
                <TableCell>{indexOfFirstStudent + index + 1}</TableCell>
                <TableCell className="flex items-start">
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
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>
      <div className="flex justify-between items-start md:items-center gap-4 py-4">
        <Select
          value={studentsPerPage.toString()}
          onValueChange={(value) => setStudentsPerPage(Number(value))}
        >
          <SelectTrigger className="w-full md:w-[180px]">
            <SelectValue placeholder="Students per page" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="5">5 per page</SelectItem>
            <SelectItem value="10">10 per page</SelectItem>
            <SelectItem value="20">20 per page</SelectItem>
            <SelectItem value="50">50 per page</SelectItem>
          </SelectContent>
        </Select>
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
