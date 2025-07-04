import { Student } from "@/types/import";

// utils/studentService.ts
const STUDENT_CACHE_KEY = "students";
const CACHE_TTL = 60 * 60 * 1000; // 1 hour

export const studentService = {
  async getStudents(): Promise<Student[]> {
    // Check cache first
    const cached = localStorage.getItem(STUDENT_CACHE_KEY);
    if (cached) {
      const { data, timestamp } = JSON.parse(cached);
      if (Date.now() - timestamp < CACHE_TTL) {
        return data;
      }
    }

    // Fetch from API if cache is expired or missing
    const response = await fetch("/api/students");
    const data = await response.json();
    localStorage.setItem(
      STUDENT_CACHE_KEY,
      JSON.stringify({
        data,
        timestamp: Date.now(),
      })
    );
    return data;
  },

  async searchStudents(query: string): Promise<Student[]> {
    const students = await this.getStudents();
    return students.filter((student) =>
      student.name.toLowerCase().includes(query.toLowerCase())
    );
  },

  async createStudent(student: Omit<Student, "id">): Promise<Student> {
    const response = await fetch("/api/students", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(student),
    });
    const newStudent = await response.json();

    // Update cache
    const cached = localStorage.getItem(STUDENT_CACHE_KEY);
    if (cached) {
      const { data, timestamp } = JSON.parse(cached);
      localStorage.setItem(
        STUDENT_CACHE_KEY,
        JSON.stringify({
          data: [...data, newStudent],
          timestamp,
        })
      );
    }

    return newStudent;
  },

  invalidateCache() {
    localStorage.removeItem(STUDENT_CACHE_KEY);
  },
};
