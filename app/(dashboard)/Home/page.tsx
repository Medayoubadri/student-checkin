// app/(dashboard)/Home/page.tsx
"use client";

import { useState, useEffect } from "react";
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
import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";
import { ChevronDown } from "lucide-react";

export default function HomePage() {
  const { status } = useSession();
  const router = useRouter();
  const [name, setName] = useState("");
  const [age, setAge] = useState("");
  const [gender, setGender] = useState("");
  const [showAdditionalFields, setShowAdditionalFields] = useState(false);
  const [metrics, setMetrics] = useState({
    totalStudents: 0,
    todayAttendance: 0,
    averageAttendance: 0,
    totalAttendance: 0,
  });

  useEffect(() => {
    fetchMetrics();
  }, []);

  const fetchMetrics = async () => {
    try {
      const response = await fetch("/api/metrics");
      const data = await response.json();
      setMetrics(data);
    } catch (error) {
      console.error("Error fetching metrics:", error);
    }
  };

  if (status === "loading") {
    return (
      <div className="flex justify-center items-center h-full">Loading...</div>
    );
  }

  if (status === "unauthenticated") {
    router.push("/auth/signin");
    return null;
  }

  const handleCheck = async () => {
    try {
      const checkResponse = await fetch(
        `/api/students?name=${encodeURIComponent(name)}`
      );
      const existingStudent = await checkResponse.json();

      if (existingStudent) {
        await markAttendance(existingStudent.id);
      } else {
        setShowAdditionalFields(true);
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

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    try {
      const createResponse = await fetch("/api/students", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ name, age: Number.parseInt(age), gender }),
      });
      if (!createResponse.ok) {
        throw new Error("Failed to create student");
      }
      const newStudent = await createResponse.json();
      await markAttendance(newStudent.id);
      setShowAdditionalFields(false);
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
      fetchMetrics();
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
    <div className="flex flex-col justify-center items-center space-y-8 h-full">
      <Card className="bg-background w-full md:max-w-md">
        <CardHeader>
          <CardTitle className="font-bold text-2xl text-center">
            Student Check-in
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="name">Full Name</Label>
              <Input
                id="name"
                className="bg-background dark:bg-zinc-900 dark:border-none"
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder="Enter student name"
                required
              />
            </div>
            {!showAdditionalFields && (
              <Button onClick={handleCheck} className="w-full">
                Check
              </Button>
            )}
            {showAdditionalFields && (
              <form onSubmit={handleSubmit} className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="age">Age</Label>
                  <Input
                    id="age"
                    type="number"
                    className="bg-background dark:bg-zinc-900 dark:border-none"
                    value={age}
                    onChange={(e) => setAge(e.target.value)}
                    placeholder="Enter age"
                    required
                  />
                </div>
                <div>
                  <Label htmlFor="gender">Gender</Label>
                  <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                      <Button
                        variant="secondary"
                        className="bg-background dark:bg-zinc-900 mt-2 border dark:border-none w-full"
                      >
                        <span className="flex items-center w-full text-left text-muted-foreground">
                          {gender === "male" ? "Male" : "Female"}
                          <ChevronDown className="ml-auto w-4 h-4" />
                        </span>
                      </Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent className="flex flex-col gap-3 px-4 py-2 w-[320px] lg:w-[400px]">
                      <DropdownMenuItem onClick={() => setGender("male")}>
                        Male
                      </DropdownMenuItem>
                      <DropdownMenuItem onClick={() => setGender("female")}>
                        Female
                      </DropdownMenuItem>
                    </DropdownMenuContent>
                  </DropdownMenu>
                </div>
                <Button type="submit" className="w-full">
                  Submit
                </Button>
              </form>
            )}
          </div>
        </CardContent>
      </Card>

      <div className="gap-4 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 w-full max-w-4xl">
        <Card className="bg-background">
          <CardHeader>
            <CardTitle>Total Students</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="font-bold text-3xl">{metrics.totalStudents}</p>
          </CardContent>
        </Card>
        <Card className="bg-background">
          <CardHeader>
            <CardTitle>Today&apos;s Attendance</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="font-bold text-3xl">{metrics.todayAttendance}</p>
          </CardContent>
        </Card>
        <Card className="bg-background">
          <CardHeader>
            <CardTitle>Average Attendance</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="font-bold text-3xl">{metrics.averageAttendance}%</p>
          </CardContent>
        </Card>
        <Card className="bg-background">
          <CardHeader>
            <CardTitle>Total Attendance</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="font-bold text-3xl">{metrics.totalAttendance}</p>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
