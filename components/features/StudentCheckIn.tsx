"use client";

import { useEffect, useState } from "react";
import {
  Check,
  CheckCircle,
  Clock,
  Search,
  UserCheck,
  Users,
} from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import Image from "next/image";

// Sample student data
const students = [
  {
    id: 1,
    name: "Alex Johnson",
    avatar: "/assets/female-avatar.jpg",
    course: "Computer Science",
    lastSeen: "2 days ago",
  },
  {
    id: 2,
    name: "Jamie Smith",
    avatar: "/assets/male-avatar.jpg",
    course: "Data Science",
    lastSeen: "1 week ago",
  },
];

// This component simulates a student check-in process with auto-play functionality
// It allows searching for students, selecting one, and confirming their check-in
export function StudentCheckInDemo() {
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedStudent, setSelectedStudent] = useState<
    (typeof students)[0] | null
  >(null);
  const [checkedIn, setCheckedIn] = useState(false);
  const [step, setStep] = useState(0);

  // Filter students based on search query
  const filteredStudents = students.filter((student) =>
    student.name.toLowerCase().includes(searchQuery.toLowerCase())
  );

  // Create a dependency variable for the useEffect
  const shouldRestartCycle = step === 0 && !selectedStudent && !checkedIn;

  // Auto-play functionality with infinite loop
  useEffect(() => {
    const timers: NodeJS.Timeout[] = [];

    // Initial delay before starting the demo
    timers.push(
      setTimeout(() => {
        // Step 1: Show search results
        setSearchQuery("a");

        // Step 2: Select a student
        timers.push(
          setTimeout(() => {
            setSelectedStudent(students[0]);
            setStep(1);

            // Step 3: Check in the student
            timers.push(
              setTimeout(() => {
                setCheckedIn(true);
                setStep(2);

                // Reset after showing success
                timers.push(
                  setTimeout(() => {
                    setCheckedIn(false);
                    setSelectedStudent(null);
                    setSearchQuery("");
                    setStep(0);

                    // No condition to stop - will loop infinitely
                  }, 3000)
                );
              }, 2000)
            );
          }, 1500)
        );
      }, 1000)
    );

    return () => {
      timers.forEach((timer) => clearTimeout(timer));
    };
  }, [shouldRestartCycle]); // Dependency to restart the cycle

  const handleCheckIn = () => {
    setCheckedIn(true);
    setStep(2);
  };

  const handleReset = () => {
    setCheckedIn(false);
    setSelectedStudent(null);
    setSearchQuery("");
    setStep(0);
  };

  return (
    <div className="flex flex-col mx-auto w-full h-full">
      {/* Header with title and time */}
      <div className="flex justify-between items-center px-6 py-4">
        <h3 className="font-medium text-base">
          {step === 0 && "Student Check-In"}
          {step === 1 && "Confirm Check-In"}
          {step === 2 && "Check-In Complete"}
        </h3>
        <div className="flex items-center gap-1">
          <Clock size={14} className="text-muted-foreground" />
          <span className="text-muted-foreground text-xs">
            {new Date().toLocaleTimeString([], {
              hour: "2-digit",
              minute: "2-digit",
            })}
          </span>
        </div>
      </div>

      {/* Main content area with side-by-side layout */}
      <div className="flex mx-auto w-[calc(100%-6rem)] h-[calc(100%-2rem)]">
        {/* Left side - Check-in details */}
        <div className="flex flex-col p-4 w-1/2">
          <div className="relative mb-3">
            <div className="left-0 absolute inset-y-0 flex items-center pl-3 pointer-events-none">
              <Search size={16} className="text-muted-foreground" />
            </div>
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="bg-background py-2 pr-4 pl-10 border rounded-md focus:outline-none focus:ring-1 focus:ring-primary w-full text-sm"
              placeholder="Search students..."
            />
          </div>

          <div className="flex-1 overflow-auto">
            {searchQuery ? (
              filteredStudents.length > 0 ? (
                <div className="space-y-2">
                  {filteredStudents.map((student) => (
                    <motion.div
                      key={student.id}
                      initial={{ opacity: 0, y: 5 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ duration: 0.2 }}
                      className={`flex items-center p-2 rounded-lg hover:bg-muted/50 cursor-pointer ${
                        selectedStudent?.id === student.id
                          ? "bg-primary/10 border border-primary/20"
                          : ""
                      }`}
                      onClick={() => {
                        setSelectedStudent(student);
                        setStep(1);
                      }}
                    >
                      <div className="relative flex-shrink-0">
                        <Image
                          width={40}
                          height={40}
                          src={student.avatar || "/placeholder.svg"}
                          alt={student.name}
                          className="rounded-full w-10 h-10 object-cover"
                        />
                      </div>
                      <div className="flex-1 ml-3">
                        <p className="font-medium text-sm">{student.name}</p>
                        <p className="text-muted-foreground text-xs">
                          {student.course}
                        </p>
                      </div>
                      <div className="flex items-center text-muted-foreground text-xs">
                        <Clock size={12} className="mr-1" />
                        {student.lastSeen}
                      </div>
                    </motion.div>
                  ))}
                </div>
              ) : (
                <div className="py-8 text-center">
                  <Users className="mx-auto w-8 h-8 text-muted-foreground" />
                  <p className="mt-2 text-muted-foreground text-sm">
                    No students found
                  </p>
                </div>
              )
            ) : (
              <div className="space-y-2">
                {students.map((student) => (
                  <motion.div
                    key={student.id}
                    initial={{ opacity: 0, y: 5 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.2, delay: student.id * 0.05 }}
                    className="flex items-center hover:bg-muted/50 p-2 rounded-lg cursor-pointer"
                    onClick={() => {
                      setSelectedStudent(student);
                      setStep(1);
                    }}
                  >
                    <div className="relative flex-shrink-0">
                      <Image
                        width={40}
                        height={40}
                        src={student.avatar || "/placeholder.svg"}
                        alt={student.name}
                        className="rounded-full w-10 h-10 object-cover"
                      />
                    </div>
                    <div className="flex-1 ml-3">
                      <p className="font-medium text-sm">{student.name}</p>
                      <p className="text-muted-foreground text-xs">
                        {student.course}
                      </p>
                    </div>
                    <div className="flex items-center text-muted-foreground text-xs">
                      <Clock size={12} className="mr-1" />
                      {student.lastSeen}
                    </div>
                  </motion.div>
                ))}
              </div>
            )}
          </div>
        </div>

        {/* Right side - Student list */}
        <div className="flex flex-col p-4 w-1/2">
          <AnimatePresence mode="wait">
            {step === 0 && (
              <motion.div
                key="welcome"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                className="flex flex-col flex-1 items-center"
              >
                <div className="text-center">
                  <Users className="mx-auto mb-2 w-12 h-12 text-primary/60" />
                  <h3 className="font-medium text-lg">Welcome</h3>
                  <p className="text-muted-foreground text-sm">
                    Search for a student to check in
                  </p>
                </div>

                <div className="gap-3 grid grid-cols-2 mt-2 w-full">
                  <div className="bg-muted/50 p-3 rounded-md text-center">
                    <p className="font-medium text-xs">Today</p>
                    <p className="font-bold text-xl">24</p>
                    <p className="text-muted-foreground text-xs">Check-ins</p>
                  </div>
                  <div className="bg-muted/50 p-3 rounded-md text-center">
                    <p className="font-medium text-xs">Total</p>
                    <p className="font-bold text-xl">142</p>
                    <p className="text-muted-foreground text-xs">This week</p>
                  </div>
                </div>
              </motion.div>
            )}

            {step === 1 && selectedStudent && (
              <motion.div
                key="confirm"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                className="flex flex-col flex-1"
              >
                <div className="flex items-center mb-4">
                  <Image
                    width={40}
                    height={40}
                    src={selectedStudent.avatar || "/placeholder.svg"}
                    alt={selectedStudent.name}
                    className="mr-4 rounded-full w-16 h-16 object-cover"
                  />
                  <div>
                    <h3 className="font-medium text-lg">
                      {selectedStudent.name}
                    </h3>
                    <p className="text-muted-foreground text-sm">
                      {selectedStudent.course}
                    </p>
                    <p className="text-muted-foreground text-xs">
                      Student ID: #10{selectedStudent.id}42
                    </p>
                  </div>
                </div>

                <div className="bg-muted/30 mb-4 p-3 rounded-lg">
                  <div className="mb-2 text-muted-foreground text-xs">
                    Current Class
                  </div>
                  <div className="flex justify-between items-center">
                    <div>
                      <p className="font-medium text-base">
                        CS-301: Data Structures
                      </p>
                      <p className="text-sm">Room B-204</p>
                    </div>
                    <div className="text-right">
                      <p className="font-medium text-base">10:30 AM</p>
                      <p className="text-muted-foreground text-xs">
                        Duration: 1h 30m
                      </p>
                    </div>
                  </div>
                </div>

                <motion.button
                  whileHover={{ scale: 1.03 }}
                  whileTap={{ scale: 0.97 }}
                  onClick={handleCheckIn}
                  className="flex justify-center items-center bg-primary mt-auto py-2 rounded-md text-primary-foreground"
                >
                  <UserCheck size={18} className="mr-2" />
                  Check In Student
                </motion.button>
              </motion.div>
            )}

            {step === 2 && (
              <motion.div
                key="success"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                className="flex flex-col flex-1 justify-center items-center"
              >
                <motion.div
                  initial={{ scale: 0.5, opacity: 0 }}
                  animate={{
                    scale: 1,
                    opacity: 1,
                    y: [0, -10, 0],
                  }}
                  transition={{
                    duration: 0.5,
                    y: { repeat: 0, duration: 0.5 },
                  }}
                  className="mb-4 text-green-500"
                >
                  <CheckCircle size={50} />
                </motion.div>
                <h3 className="mb-1 font-medium text-lg">
                  Check-In Successful
                </h3>
                <p className="mb-4 text-muted-foreground text-sm">
                  {selectedStudent?.name} is now checked in
                </p>

                <div className="bg-muted/30 mb-4 p-3 rounded-lg w-full">
                  <div className="flex items-start">
                    <div className="bg-green-500/20 mt-1 mr-3 p-2 rounded-full">
                      <Check size={16} className="text-green-500" />
                    </div>
                    <div>
                      <p className="text-muted-foreground text-xs">
                        Attendance recorded for
                      </p>
                      <p className="font-medium text-sm">
                        CS-301: Data Structures
                      </p>
                      <p className="text-muted-foreground text-xs">
                        {new Date().toLocaleDateString()} • 10:30 AM
                      </p>
                    </div>
                  </div>
                </div>

                <motion.button
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  onClick={handleReset}
                  className="text-primary text-sm hover:underline"
                >
                  Check in another student
                </motion.button>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </div>

      {/* Progress indicators */}
      <div className="right-4 -bottom-[40%] absolute flex self-end gap-2 p-3">
        {[0, 1, 2].map((s) => (
          <motion.div
            key={s}
            className={`h-1.5 rounded-full ${
              s <= step ? "bg-primary" : "bg-primary/20"
            }`}
            initial={{ width: 20 }}
            animate={{
              width: s === step ? 40 : 20,
            }}
            transition={{ duration: 0.3 }}
          />
        ))}
      </div>
    </div>
  );
}
