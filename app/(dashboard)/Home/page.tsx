"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { toast } from "@/hooks/use-toast";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";

export default function Dashboard() {
  const { status } = useSession();
  const router = useRouter();
  const [name, setName] = useState("");
  const [age, setAge] = useState("");
  const [gender, setGender] = useState("");
  const [showAdditionalFields, setShowAdditionalFields] = useState(false);

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
    const checkResponse = await fetch(
      `/api/students?name=${encodeURIComponent(name)}`
    );
    const existingStudent = await checkResponse.json();

    if (existingStudent) {
      await markAttendance(existingStudent.id);
    } else {
      setShowAdditionalFields(true);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    const createResponse = await fetch("/api/students", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ name, age: Number.parseInt(age), gender }),
    });
    const newStudent = await createResponse.json();
    await markAttendance(newStudent.id);
    setShowAdditionalFields(false);
    setAge("");
    setGender("");
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
    } else {
      toast({
        title: "Error",
        description: result.error,
        variant: "destructive",
      });
    }
  };

  return (
    <div className="flex justify-center items-center h-full">
      <Card className="bg-background w-full max-w-md">
        <CardHeader>
          <CardTitle className="font-bold text-2xl text-center">
            Student Check-in
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="name">Name</Label>
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
                <div className="space-y-2">
                  <Label htmlFor="gender">Gender</Label>
                  <Input
                    id="gender"
                    value={gender}
                    className="bg-background dark:bg-zinc-900 dark:border-none"
                    onChange={(e) => setGender(e.target.value)}
                    placeholder="Enter gender"
                    required
                  />
                </div>
                <Button type="submit" className="w-full">
                  Submit
                </Button>
              </form>
            )}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
