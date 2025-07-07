// utils/attendanceService.ts

// Service for managing real-time attendance with offline support
const ATTENDANCE_CACHE_KEY = "attendance";

interface AttendanceResponse {
  status: number;
  message: string;
}

interface AttendanceRecord {
  studentId: string;
  date: string;
  synced: boolean;
}

export const attendanceService = {
  // Records attendance with optimistic updates and server sync
  async markAttendance(studentId: string): Promise<AttendanceResponse> {
    // Update cache immediately
    const newAttendance = {
      studentId,
      date: new Date().toISOString(),
      synced: false,
    };
    const attendance = JSON.parse(
      localStorage.getItem(ATTENDANCE_CACHE_KEY) || "[]"
    );
    attendance.unshift(newAttendance);
    localStorage.setItem(ATTENDANCE_CACHE_KEY, JSON.stringify(attendance));

    // Sync with server
    try {
      const response = await fetch("/api/attendance", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ studentId }),
      });
      const data = await response.json();
      // Mark as synced
      const updated = attendance.map((a: AttendanceRecord) =>
        a === newAttendance ? { ...a, synced: true } : a
      );
      localStorage.setItem(ATTENDANCE_CACHE_KEY, JSON.stringify(updated));
      return { status: response.status, message: data.message };
    } catch (error) {
      console.error("Sync failed, will retry later", error);
      return { status: 500, message: "Sync failed, will retry later" };
    }
  },

  // Retrieves recent attendance records from local cache
  async getRecentAttendance(): Promise<AttendanceRecord[]> {
    // First check unsynced items
    const cached = localStorage.getItem(ATTENDANCE_CACHE_KEY);
    const localAttendance = cached ? JSON.parse(cached) : [];

    // Return local items immediately
    return localAttendance;
  },
};
