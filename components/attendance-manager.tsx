"use client";

import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Toaster as toast } from "@/components/ui/toaster";
import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

export default function AttendanceManager() {
  const [name, setName] = useState("");
  const [age, setAge] = useState("");
  const [gender, setGender] = useState("male");
  const [presentStudents, setPresentStudents] = useState<any[]>([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [filterBy, setFilterBy] = useState("name");
  const { data: session } = useSession();
  const router = useRouter();

  useEffect(() => {
    if (!session) {
      router.push("/api/auth/signin");
    }
  }, [session, router]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const res = await fetch("/api/attendance", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ name, age: Number.parseInt(age), gender }),
      });
      const data = await res.json();
      if (data.success) {
        toast({
          title: "Success",
          description: data.message,
        });
        setName("");
        setAge("");
        setGender("male");
        fetchPresentStudents();
      } else {
        toast({
          title: "Error",
          description: data.message,
          variant: "destructive",
        });
      }
    } catch (error) {
      console.error("Error submitting attendance:", error);
      toast({
        title: "Error",
        description: "An error occurred while submitting attendance.",
        variant: "destructive",
      });
    }
  };

  const fetchPresentStudents = async () => {
    try {
      const res = await fetch("/api/attendance");
      const data = await res.json();
      setPresentStudents(data.students);
    } catch (error) {
      console.error("Error fetching present students:", error);
    }
  };

  useEffect(() => {
    fetchPresentStudents();
  }, []);

  const exportToXLSX = async () => {
    try {
      const res = await fetch("/api/export");
      const blob = await res.blob();
      const url = window.URL.createObjectURL(blob);
      const a = document.createElement("a");
      a.href = url;
      a.download = "attendance.xlsx";
      document.body.appendChild(a);
      a.click();
      window.URL.revokeObjectURL(url);
    } catch (error) {
      console.error("Error exporting to XLSX:", error);
      toast({
        title: "Error",
        description: "An error occurred while exporting to XLSX.",
        variant: "destructive",
      });
    }
  };

  const filteredStudents = presentStudents.filter((student) => {
    if (filterBy === "name") {
      return student.name.toLowerCase().includes(searchTerm.toLowerCase());
    } else if (filterBy === "age") {
      return student.age.toString().includes(searchTerm);
    } else if (filterBy === "gender") {
      return student.gender.toLowerCase().includes(searchTerm.toLowerCase());
    }
    return true;
  });

  return (
    <div>
      <form onSubmit={handleSubmit} className="space-y-4 mb-8">
        <div>
          <Label htmlFor="name">Name</Label>
          <Input
            id="name"
            value={name}
            onChange={(e) => setName(e.target.value)}
            required
          />
        </div>
        <div>
          <Label htmlFor="age">Age</Label>
          <Input
            id="age"
            type="number"
            value={age}
            onChange={(e) => setAge(e.target.value)}
          />
        </div>
        <div>
          <Label>Gender</Label>
          <RadioGroup value={gender} onValueChange={setGender}>
            <div className="flex items-center space-x-2">
              <RadioGroupItem value="male" id="male" />
              <Label htmlFor="male">Male</Label>
            </div>
            <div className="flex items-center space-x-2">
              <RadioGroupItem value="female" id="female" />
              <Label htmlFor="female">Female</Label>
            </div>
          </RadioGroup>
        </div>
        <Button type="submit">Mark Attendance</Button>
      </form>

      <div className="mb-4">
        <Label htmlFor="search">Search</Label>
        <div className="flex space-x-2">
          <Input
            id="search"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            placeholder="Search students..."
          />
          <Select value={filterBy} onValueChange={setFilterBy}>
            <SelectTrigger className="w-[180px]">
              <SelectValue placeholder="Filter by" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="name">Name</SelectItem>
              <SelectItem value="age">Age</SelectItem>
              <SelectItem value="gender">Gender</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </div>

      <h2 className="mb-4 font-bold text-2xl">Present Students</h2>
      <ul>
        {filteredStudents.map((student) => (
          <li key={student.id}>
            {student.name} - Age: {student.age}, Gender: {student.gender}
          </li>
        ))}
      </ul>

      <Button onClick={exportToXLSX} className="mt-4">
        Export to XLSX
      </Button>
    </div>
  );
}
